// ── SlimHealth Express 서버 ───────────────────────────────────
// OCR 경로: POST /analyze/ocr    (이미지 업로드 + 흡연/음주)
// 수기 경로: POST /analyze/manual (모든 수치 직접 입력)
import express from 'express';
import multer from 'multer';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import dotenv from 'dotenv';
import { runOCR, validateOCR, getAgeCode } from './ocr.js';
import { getHealthAdvice } from './healthAdvice.js';
dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8081';

app.use(express.json());

// 업로드된 이미지를 임시 폴더에 저장
const upload = multer({ dest: os.tmpdir() });


// ── 공통: FastAPI 예측 호출 ───────────────────────────────────
async function callPredictAll(apiData) {
  const response = await axios.post(`${FASTAPI_URL}/predict-all`, apiData);
  return response.data;
}


// ── 공통: 예측 결과 단순화 ────────────────────────────────────
function simplifyPredictions(predictions, currentWeight) {
  const simplified = {};
  Object.entries(predictions).forEach(([kg, p]) => {
    simplified[kg] = {
      target_weight: parseFloat((currentWeight - parseInt(kg)).toFixed(1)),
      waist: p.waist.predicted,
      sbp:   p.sbp.predicted,
      dbp:   p.dbp.predicted,
      bs:    p.bs.predicted,
      tg:    p.tg.predicted,
      hdl:   p.hdl.predicted,
    };
  });
  return simplified;
}


// ── 공통: Gemini 조언 + 최종 JSON 조합 ───────────────────────
async function buildFinalOutput(ocrResult, userInput, apiData, result) {
  const currentMetrics = {
    waist: ocrResult.waist,
    sbp:   ocrResult.sbp,
    dbp:   ocrResult.dbp,
    bs:    ocrResult.bs,
    tg:    ocrResult.tg,
    hdl:   ocrResult.hdl,
  };

  const advice = await getHealthAdvice(
    ocrResult,
    { ...userInput, gender: apiData.gender },
    currentMetrics,
    result.predictions
  );

  const simplePredictions = simplifyPredictions(result.predictions, ocrResult.weight);

  return {
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
}


// ── 경로 1: OCR 입력 ─────────────────────────────────────────
// POST /analyze/ocr
// form-data: images (파일, 복수 가능) + smoke (0|1) + drink (0|1)
app.post('/analyze/ocr', upload.array('images'), async (req, res) => {
  const tmpFiles = req.files || [];

  try {
    // 1-1. 입력 검증
    if (tmpFiles.length === 0) {
      return res.status(400).json({ error: '이미지 파일이 없습니다.' });
    }
    const smoke = parseInt(req.body.smoke ?? 0);
    const drink = parseInt(req.body.drink ?? 0);
    if (![0, 1].includes(smoke) || ![0, 1].includes(drink)) {
      return res.status(400).json({ error: 'smoke, drink 값은 0 또는 1이어야 합니다.' });
    }

    // 1-2. multer 임시 파일 경로 → OCR에 전달할 파일명 배열 생성
    //      originalname 기반으로 tmpdir에 복사 (Gemini가 확장자로 mimeType 판단)
    const renamedPaths = tmpFiles.map(f => {
      const dest = path.join(os.tmpdir(), f.originalname);
      fs.copyFileSync(f.path, dest);
      return dest;
    });

    // 1-3. OCR 실행 (절대경로 배열 전달)
    const ocrResult = await runOCR(renamedPaths);
    const isValid   = validateOCR(ocrResult);
    if (!isValid) {
      return res.status(422).json({
        error: 'OCR 수치가 정상 범위를 벗어났습니다. 이미지를 확인해주세요.',
        ocr: ocrResult,
      });
    }

    // 1-4. age_code 변환
    const ageCode = getAgeCode(ocrResult.age);
    if (ageCode === null) {
      return res.status(400).json({
        error: `서비스 대상 아님 (나이: ${ocrResult.age}세, 25~59세만 가능)`,
      });
    }

    // 1-5. FastAPI 예측
    const apiData = {
      gender:   ocrResult.gender,
      age_code: ageCode,
      height:   ocrResult.height,
      weight:   ocrResult.weight,
      waist:    ocrResult.waist,
      sbp:      ocrResult.sbp,
      dbp:      ocrResult.dbp,
      bs:       ocrResult.bs,
      tg:       ocrResult.tg,
      hdl:      ocrResult.hdl,
      smoke,
      drink,
    };
    const result = await callPredictAll(apiData);

    // 1-6. Gemini 조언 + 최종 JSON
    const userInput  = { smoke, drink };
    const finalOutput = await buildFinalOutput(ocrResult, userInput, apiData, result);

    return res.json(finalOutput);

  } catch (error) {
    console.error('❌ OCR 경로 오류:', error.message);
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'FastAPI 서버에 연결할 수 없습니다.' });
    }
    return res.status(500).json({ error: error.message });

  } finally {
    // 임시 파일 정리
    tmpFiles.forEach(f => {
      try { fs.unlinkSync(f.path); } catch {}
      try {
        const renamed = path.join(os.tmpdir(), f.originalname);
        fs.unlinkSync(renamed);
      } catch {}
    });
  }
});


// ── 경로 2: 수기 입력 ────────────────────────────────────────
// POST /analyze/manual
// Content-Type: application/json
// {
//   gender: 1|2, age: number, height: number, weight: number,
//   waist: number, sbp: number, dbp: number,
//   bs: number, tg: number, hdl: number,
//   smoke: 0|1, drink: 0|1
// }
app.post('/analyze/manual', async (req, res) => {
  try {
    // 2-1. 필수 필드 검증
    const REQUIRED = ['gender','age','height','weight','waist','sbp','dbp','bs','tg','hdl','smoke','drink'];
    const missing  = REQUIRED.filter(k => req.body[k] === undefined || req.body[k] === null || req.body[k] === '');
    if (missing.length > 0) {
      return res.status(400).json({ error: `누락된 항목: ${missing.join(', ')}` });
    }

    const {
      gender, age, height, weight,
      waist, sbp, dbp, bs, tg, hdl,
      smoke, drink,
    } = req.body;

    // 2-2. age_code 변환
    const ageCode = getAgeCode(Number(age));
    if (ageCode === null) {
      return res.status(400).json({
        error: `서비스 대상 아님 (나이: ${age}세, 25~59세만 가능)`,
      });
    }

    // 2-3. FastAPI 예측
    const apiData = {
      gender:   Number(gender),
      age_code: ageCode,
      height:   Number(height),
      weight:   Number(weight),
      waist:    Number(waist),
      sbp:      Number(sbp),
      dbp:      Number(dbp),
      bs:       Number(bs),
      tg:       Number(tg),
      hdl:      Number(hdl),
      smoke:    Number(smoke),
      drink:    Number(drink),
    };
    const result = await callPredictAll(apiData);

    // 2-4. ocrResult 형태로 맞추기 (buildFinalOutput 재사용)
    const ocrResult = {
      gender: apiData.gender,
      age:    Number(age),
      height: apiData.height,
      weight: apiData.weight,
      waist:  apiData.waist,
      sbp:    apiData.sbp,
      dbp:    apiData.dbp,
      bs:     apiData.bs,
      tg:     apiData.tg,
      hdl:    apiData.hdl,
    };

    // 2-5. Gemini 조언 + 최종 JSON
    const userInput   = { smoke: apiData.smoke, drink: apiData.drink };
    const finalOutput = await buildFinalOutput(ocrResult, userInput, apiData, result);

    return res.json(finalOutput);

  } catch (error) {
    console.error('❌ 수기입력 경로 오류:', error.message);
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'FastAPI 서버에 연결할 수 없습니다.' });
    }
    return res.status(500).json({ error: error.message });
  }
});


// ── 서버 시작 ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 SlimHealth Node.js 서버 실행 중: http://localhost:${PORT}`);
  console.log(`   OCR 경로:    POST /analyze/ocr`);
  console.log(`   수기입력:    POST /analyze/manual`);
  console.log(`   FastAPI URL: ${FASTAPI_URL}\n`);
});
