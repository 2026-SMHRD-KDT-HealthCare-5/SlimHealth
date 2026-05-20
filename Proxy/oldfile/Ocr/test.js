import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ 에러: GEMINI_API_KEY 환경 변수가 설정되지 않았습니다!");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// ── 이미지 → Base64 변환 ──────────────────────────────────────
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    },
  };
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf')                    return 'application/pdf';
  if (ext === '.png')                    return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp')                   return 'image/webp';
  if (ext === '.gif')                    return 'image/gif';
  if (ext === '.bmp')                    return 'image/bmp';
  return null;
}

// ── 나이 → age_code 변환 ─────────────────────────────────────
// 서비스 대상: 30~59세 (학습 데이터 범위)
// 30세 미만 또는 60세 이상은 null 반환 → 서비스 이용 불가 안내
function getAgeCode(age) {
  if (age < 25) return null;  // 서비스 대상 아님 (25세 미만)
  if (age < 35) return 7;     // 26~34세 → 30대 초반으로 처리 (외삽 최소화)
  if (age < 40) return 8;
  if (age < 45) return 9;
  if (age < 50) return 10;
  if (age < 55) return 11;
  if (age < 60) return 12;
  return null;                 // 서비스 대상 아님 (60대 이상)
}

// ── OCR 결과 + 사용자 입력 → FastAPI 입력 형식 변환 ──────────
// smoke, drink는 건강검진 통보서에 없으므로 사용자 수기 입력으로 받음
function convertToApiFormat(ocr, userInput) {
  const ageCode = getAgeCode(ocr.age);

  // 나이 범위 체크 (30~59세만 서비스 가능)
  if (ageCode === null) {
    return {
      error: true,
      message: `본 서비스는 59세 이하를 대상으로 합니다. (입력 나이: ${ocr.age}세)`
    };
  }

  return {
    error:         false,
    gender:        ocr.gender === "남성" ? 1 : 2,  // "남성" → 1, "여성" → 2
    age_code:      ageCode,                          // 나이 → age_code 변환
    height:        ocr.height,
    weight:        ocr.weight,
    target_weight: ocr.weight - 5,                  // 임시값 (슬라이더로 나중에 설정)
    waist:         ocr.waist,
    sbp:           ocr.sbp,
    dbp:           ocr.dbp,
    bs:            ocr.bs,
    tg:            ocr.tg,
    hdl:           ocr.hdl,
    // ↓ 건강검진 통보서에 없는 항목 → 사용자 수기 입력
    smoke:         userInput.smoke,  // 0=비흡연/금연, 1=현재흡연
    drink:         userInput.drink,  // 0=비음주, 1=음주
  };
}

// ── 메인 함수 ─────────────────────────────────────────────────
async function startMultiImageOCR() {
  try {
    // ============================================================
    // [확인!] 분석할 이미지 파일명들을 배열 안에 차례대로 적어줍니다.
    const fileNames = ['진종언 24.pdf'];
    // ============================================================

    // ============================================================
    // [테스트용] 실제 서비스에서는 프론트엔드 UI에서 사용자가 직접 입력
    // smoke: 0=비흡연/금연, 1=현재흡연
    // drink: 0=비음주,      1=음주
    const userInput = {
      smoke: 1,
      drink: 1,
    };
    // ============================================================

    const contentsInput = [];

    // 1. 이미지 파일 로드 및 Base64 변환
    for (const fileName of fileNames) {
      const filePath = path.join(process.cwd(), fileName);

      if (!fs.existsSync(filePath)) {
        console.error(`❌ 에러: '${fileName}' 파일이 없습니다. 패스합니다.`);
        continue;
      }

      const mimeType = getMimeType(filePath);
      if (!mimeType) {
        console.error(`❌ 에러: '${fileName}'은 지원하지 않는 파일 형식입니다.`);
        continue;
      }

      console.log(`📁 파일 로드 완료: ${fileName} (${mimeType})`);
      contentsInput.push(fileToGenerativePart(filePath, mimeType));
    }

    if (contentsInput.length === 0) {
      console.error("❌ 에러: 분석할 수 있는 파일이 하나도 없습니다.");
      return;
    }

    // 2. Gemini 프롬프트
    // smoke/drink는 건강검진 통보서에 없으므로 OCR 항목에서 제외
    const prompt = `
      전송된 복수의 건강검진 문서 이미지들을 종합적으로 분석하여
      아래 지정된 10가지 항목만 찾아서 정확한 JSON 객체 형식으로 추출해줘.
      여러 페이지에 걸쳐 데이터가 흩어져 있으니 전체 이미지를 취합해서
      하나의 통합된 JSON 객체로 만들어야 해.
      텍스트나 마크다운 설명은 완전히 제외하고, 순수한 JSON 데이터만 반환해줘.

      [추출 항목 및 규칙]
      1.  gender : 성별 (주민등록번호 뒷자리 첫 숫자가 1또는 3이면 "남성", 2또는 4면 "여성")
      2.  age    : 나이 (검진년도 기준 만 나이 숫자)
      3.  height : 키 (cm 단위, 숫자만)
      4.  weight : 현재 체중 (kg 단위, 숫자만)
      5.  waist  : 허리둘레 (cm 단위, 숫자만)
      6.  sbp    : 수축기혈압 (mmHg, 숫자만)
      7.  dbp    : 이완기혈압 (mmHg, 숫자만)
      8.  bs     : 공복혈당 (mg/dL, 숫자만)
      9.  tg     : 중성지방 (mg/dL, 숫자만)
      10. hdl    : HDL 콜레스테롤 (mg/dL, 숫자만)
                  ※ 국민건강보험공단 검진 결과지에서 '고밀도 콜레스테롤' 항목의 값
                  ※ 'HDL', 'HDL 콜레스테롤', '고밀도 콜레스테롤' 모두 같은 항목
                  ※ HDL은 일반적으로 30~90 사이 값
                  ※ LDL(저밀도 콜레스테롤), 총콜레스테롤과 절대 혼동하지 말 것
    `;

    contentsInput.push(prompt);

    console.log(`\n🚀 Gemini가 ${contentsInput.length - 1}장의 이미지를 교차 분석 중입니다...`);

    // 3. Gemini API 호출
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contentsInput,
      config: { responseMimeType: "application/json" }
    });

    const ocrResult = JSON.parse(response.text);

    // ── OCR 결과 유효성 검사 ────────────────────────────────
    // 의학적 정상 범위를 벗어난 값은 경고 출력
    const validRanges = {
      height: [130, 210],   // 키 (cm)
      weight: [30,  160],   // 체중 (kg)
      waist:  [40,  150],   // 허리둘레 (cm)
      sbp:    [70,  250],   // 수축기혈압 (mmHg)
      dbp:    [40,  150],   // 이완기혈압 (mmHg)
      bs:     [50,  400],   // 공복혈당 (mg/dL)
      tg:     [5,   500],   // 중성지방 (mg/dL)
      hdl:    [10,  200],   // HDL (mg/dL) 
    };

    let ocrWarning = false;
    for (const [key, [min, max]] of Object.entries(validRanges)) {
      const val = ocrResult[key];
      if (val < min || val > max) {
        console.warn(`⚠️  OCR 경고: ${key} = ${val} (정상범위: ${min}~${max}) → 재확인 필요`);
        ocrWarning = true;
      }
    }
    if (!ocrWarning) console.log("✅ OCR 유효성 검사 통과");

    console.log('\n================ [🎯 OCR 추출 결과 (건강검진 통보서)] ================');
    console.log(JSON.stringify(ocrResult, null, 2));
    console.log('======================================================================\n');

    // 4. FastAPI 입력 형식으로 변환 (OCR + 사용자 수기 입력 합산)
    const apiData = convertToApiFormat(ocrResult, userInput);

    // 나이 범위 체크
    if (apiData.error) {
      console.error(`⚠️  서비스 이용 불가: ${apiData.message}`);
      return;
    }

    console.log('================ [🔄 FastAPI 변환 결과] ================');
    console.log(`  [OCR 추출]`);
    console.log(`    gender:   "${ocrResult.gender}" → ${apiData.gender} (1=남, 2=여)`);
    console.log(`    age:      ${ocrResult.age}세 → age_code: ${apiData.age_code}`);
    console.log(`  [사용자 수기 입력]`);
    console.log(`    smoke:    ${apiData.smoke} (0=비흡연/금연, 1=현재흡연)`);
    console.log(`    drink:    ${apiData.drink} (0=비음주, 1=음주)`);
    console.log('=========================================================\n');

    // 5. FastAPI /predict-all 호출
    console.log('🚀 FastAPI /predict-all 호출 중...');
    const predictResponse = await axios.post(
      'http://localhost:8000/predict-all',
      apiData
    );

    const result = predictResponse.data;

    console.log('\n================ [📊 예측 결과] ================');
    console.log(`  현재 BMI:      ${result.current_bmi}`);
    console.log(`  정상체중 상한:  ${result.normal_weight}kg`);
    console.log(`  정상까지:      -${result.to_normal}kg 남음`);
    console.log(`  슬라이더 최대:  ${result.max_loss_kg}kg 감량`);
    console.log(`\n  ${'감량'.padStart(4)}  ${'목표체중'.padStart(6)}  ${'허리'.padStart(6)}  ${'수축혈압'.padStart(8)}  ${'이완혈압'.padStart(8)}  ${'혈당'.padStart(7)}  ${'중성지방'.padStart(9)}  ${'HDL'.padStart(6)}`);
    console.log(`  ${'-'.repeat(74)}`);

    for (let kg = 1; kg <= Math.min(result.max_loss_kg, 15); kg++) {
      const p = result.predictions[`${kg}kg`];
      if (!p) break;
      const targetW = apiData.weight - kg;
      console.log(
        `  -${String(kg).padStart(2)}kg  ` +
        `${targetW.toFixed(1).padStart(6)}  ` +
        `${p.waist.predicted.toFixed(1).padStart(6)}  ` +
        `${p.sbp.predicted.toFixed(1).padStart(8)}  ` +
        `${p.dbp.predicted.toFixed(1).padStart(8)}  ` +
        `${p.bs.predicted.toFixed(1).padStart(7)}  ` +
        `${p.tg.predicted.toFixed(1).padStart(9)}  ` +
        `${p.hdl.predicted.toFixed(1).padStart(6)}`
      );
    }
    console.log(`  ${'-'.repeat(74)}\n`);

    // ── JSON 형식으로 최종 결과 출력 ────────────────────────
    // 프론트엔드에서 사용할 최종 데이터 구조
    const finalJson = {
      user: {
        gender:   apiData.gender,
        age_code: apiData.age_code,
        height:   apiData.height,
        weight:   apiData.weight,
        smoke:    apiData.smoke,
        drink:    apiData.drink,
      },
      meta: {
        current_bmi:   result.current_bmi,
        normal_weight: result.normal_weight,
        to_normal:     result.to_normal,
        max_loss_kg:   result.max_loss_kg,
      },
      predictions: Object.fromEntries(
        Object.entries(result.predictions).map(([kg, p]) => [
          kg,
          {
            target_weight: parseFloat((apiData.weight - parseInt(kg)).toFixed(1)),
            waist:         p.waist.predicted,   // 허리둘레 (cm)
            sbp:           p.sbp.predicted,     // 수축기혈압 (mmHg)
            dbp:           p.dbp.predicted,     // 이완기혈압 (mmHg)
            bs:            p.bs.predicted,      // 공복혈당 (mg/dL)
            tg:            p.tg.predicted,      // 중성지방 (mg/dL)
            hdl:           p.hdl.predicted,     // HDL (mg/dL)
          }
        ])
      )
    };

    console.log('================ [📦 최종 JSON 결과] ================');
    console.log(JSON.stringify(finalJson, null, 2));
    console.log('======================================================\n');

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ FastAPI 서버 연결 실패! 서버가 실행 중인지 확인하세요.');
      console.error('   → 주피터에서 FastAPI 서버를 먼저 실행해주세요.');
    } else {
      console.error('❌ 오류 발생:', error.message);
    }
  }
}

startMultiImageOCR();
