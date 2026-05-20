// ── OCR 모듈 ─────────────────────────────────────────────────
// 건강검진 이미지 → 10개 지표 JSON 추출
import * as fs from 'fs';
import * as path from 'path';
import { getAI, retryOnError } from './geminiClient.js';

// 이미지 → Base64 변환
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

// OCR 유효성 검사
export function validateOCR(ocr) {
  const ranges = {
    height: [130, 210], weight: [30, 160], waist: [40, 150],
    sbp: [70, 250], dbp: [40, 150], bs: [50, 400],
    tg: [5, 500], hdl: [10, 200],
  };
  let valid = true;
  for (const [key, [min, max]] of Object.entries(ranges)) {
    if (ocr[key] < min || ocr[key] > max) {
      console.warn(`⚠️  OCR 경고: ${key} = ${ocr[key]} (정상범위: ${min}~${max})`);
      valid = false;
    }
  }
  if (valid) console.log("✅ OCR 유효성 검사 통과");
  return valid;
}

// 나이 → age_code 변환
export function getAgeCode(age) {
  if (age < 25) return null;  // 서비스 대상 아님 (25세 미만)
  if (age < 35) return 7;     // 25~34세 → 30대 초반으로 처리
  if (age < 40) return 8;
  if (age < 45) return 9;
  if (age < 50) return 10;
  if (age < 55) return 11;
  if (age < 60) return 12;
  return null;                 // 서비스 대상 아님 (60세 이상)
}

// Gemini OCR 실행 (재시도 포함)
export async function runOCR(fileNames) {
  return retryOnError(async () => {
    const contentsInput = [];

    for (const fileName of fileNames) {
      const filePath = path.join(process.cwd(), fileName);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ 파일 없음: ${fileName}`);
        continue;
      }
      const mimeType = getMimeType(filePath);
      if (!mimeType) {
        console.error(`❌ 지원하지 않는 형식: ${fileName}`);
        continue;
      }
      console.log(`📁 파일 로드: ${fileName}`);
      contentsInput.push(fileToGenerativePart(filePath, mimeType));
    }

    if (contentsInput.length === 0) throw new Error("분석할 파일이 없습니다.");

    const prompt = `
      전송된 복수의 건강검진 문서 이미지들을 종합적으로 분석하여
      아래 지정된 10가지 항목만 찾아서 정확한 JSON 객체 형식으로 추출해줘.
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
                  ※ LDL(저밀도 콜레스테롤), 저밀도 콜레스테롤, 총콜레스테롤과 절대 혼동하지 말 것
    `;
    contentsInput.push(prompt);

    const response = await getAI().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contentsInput,
      config: { responseMimeType: "application/json", temperature: 0 }
    });

    return JSON.parse(response.text);
  }, 'OCR');
}
