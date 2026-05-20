// ── 전체 파이프라인 실행 ──────────────────────────────────────
// OCR → FastAPI 예측 → Gemini 건강 조언 → 최종 JSON 반환
import axios from 'axios';
import { runOCR, validateOCR, getAgeCode } from './ocr.js';
import { getHealthAdvice } from './healthAdvice.js';

async function predictAll(ocrResult, userInput) {
  const ageCode = getAgeCode(ocrResult.age);
  if (ageCode === null) {
    throw new Error(`서비스 대상 아님 (나이: ${ocrResult.age}세, 25~59세만 가능)`);
  }

  const apiData = {
    gender:        ocrResult.gender === "남성" ? 1 : 2,
    age_code:      ageCode,
    height:        ocrResult.height,
    weight:        ocrResult.weight,
    target_weight: ocrResult.weight - 5,
    waist:         ocrResult.waist,
    sbp:           ocrResult.sbp,
    dbp:           ocrResult.dbp,
    bs:            ocrResult.bs,
    tg:            ocrResult.tg,
    hdl:           ocrResult.hdl,
    smoke:         userInput.smoke,
    drink:         userInput.drink,
  };

  const response = await axios.post('http://localhost:8000/predict-all', apiData);
  return { apiData, result: response.data };
}

async function main() {
  try {
    // ── 설정 ────────────────────────────────────────────────
    const fileNames = ['진종언 24_1.png', '진종언 24_2.png', '진종언 24_3.png'];
    const userInput = { smoke: 1, drink: 1 };  // 프론트에서 받을 값
    const targetKg  = 10;                       // 프론트 슬라이더 값
    // ────────────────────────────────────────────────────────

    console.log('\n' + '='.repeat(60));
    console.log('  🚀 SlimHealth AI 파이프라인 시작');
    console.log('='.repeat(60));

    // STEP 1. OCR
    console.log('\n[STEP 1] Gemini OCR 분석 중...');
    const ocrResult = await runOCR(fileNames);
    validateOCR(ocrResult);
    console.log('✅ OCR 완료:', JSON.stringify(ocrResult));

    // STEP 2. FastAPI 예측
    console.log('\n[STEP 2] FastAPI 예측 중...');
    const { apiData, result } = await predictAll(ocrResult, userInput);
    console.log(`✅ 예측 완료: BMI ${result.current_bmi} / 슬라이더 최대 ${result.max_loss_kg}kg`);

    // STEP 3. Gemini 건강 조언
    console.log('\n[STEP 3] Gemini 건강 조언 생성 중...');
    const currentMetrics = {
      waist: ocrResult.waist, sbp: ocrResult.sbp, dbp: ocrResult.dbp,
      bs: ocrResult.bs, tg: ocrResult.tg, hdl: ocrResult.hdl,
    };
    const advice = await getHealthAdvice(
      ocrResult,
      { ...userInput, gender: apiData.gender },
      currentMetrics,
      result.predictions
    );
    console.log(`✅ 건강 조언 완료 (AI 추천 감량: ${advice.recommended_loss_kg}kg)`);

    // predictions 단순화
    const simplePredictions = {};
    Object.entries(result.predictions).forEach(([kg, p]) => {
      simplePredictions[kg] = {
        target_weight: parseFloat((ocrResult.weight - parseInt(kg)).toFixed(1)),
        waist: p.waist.predicted,
        sbp:   p.sbp.predicted,
        dbp:   p.dbp.predicted,
        bs:    p.bs.predicted,
        tg:    p.tg.predicted,
        hdl:   p.hdl.predicted,
      };
    });

    // 최종 통합 JSON
    const finalOutput = {
      ocr: ocrResult,
      predictions: {
        predictions:   simplePredictions,
        max_loss_kg:   result.max_loss_kg,
        current_bmi:   result.current_bmi,
        normal_weight: result.normal_weight,
        to_normal:     result.to_normal,
      },
      advice,
    };

    console.log('\n' + '='.repeat(60));
    console.log('  📦 최종 통합 JSON (프론트엔드 전달용)');
    console.log('='.repeat(60));
    console.log(JSON.stringify(finalOutput, null, 2));

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ FastAPI 서버 연결 실패!');
      console.error('   → python main_test.py 를 먼저 실행해주세요.');
    } else {
      console.error('\n❌ 오류:', error.message);
    }
  }
}

main();
