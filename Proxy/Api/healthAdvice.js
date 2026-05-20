// ── 건강 조언 모듈 ────────────────────────────────────────────
// 현재 수치 + 예측 수치 → Gemini 건강 조언 생성
import { getAI, retryOnError } from './geminiClient.js';

export async function getHealthAdvice(ocrResult, userInput, currentMetrics, allPredictions) {
  const genderLabel    = userInput.gender === 1 ? '남성' : '여성';
  const waistThreshold = userInput.gender === 1 ? 90 : 85;
  const hdlThreshold   = userInput.gender === 1 ? 40 : 50;

  // 대사증후군 위험 항목 수 계산
  let syndromeCount = 0;
  if (currentMetrics.waist >= waistThreshold)                  syndromeCount++;
  if (currentMetrics.tg    >= 150)                             syndromeCount++;
  if (currentMetrics.hdl   <  hdlThreshold)                    syndromeCount++;
  if (currentMetrics.sbp   >= 130 || currentMetrics.dbp >= 85) syndromeCount++;
  if (currentMetrics.bs    >= 100)                             syndromeCount++;

  // 전체 감량별 예측 수치 문자열 변환
  const predictionsText = Object.entries(allPredictions)
    .map(([kg, p]) => {
      const waist = p.waist?.predicted ?? p.waist;
      const sbp   = p.sbp?.predicted   ?? p.sbp;
      const dbp   = p.dbp?.predicted   ?? p.dbp;
      const bs    = p.bs?.predicted    ?? p.bs;
      const tg    = p.tg?.predicted    ?? p.tg;
      const hdl   = p.hdl?.predicted   ?? p.hdl;
      return `  ${kg}: 허리${waist}cm / 수축압${sbp}mmHg / 이완압${dbp}mmHg / 혈당${bs}mg/dL / 중성지방${tg}mg/dL / HDL${hdl}mg/dL`;
    }).join('\n');

  const prompt = `
당신은 건강 전문 AI 어시스턴트입니다.
아래 사용자의 건강검진 수치를 정밀 분석하고
실용적이고 구체적인 맞춤 건강 조언을 제공해주세요.
전문 의학 용어보다 일반인이 이해하기 쉬운 표현을 사용하세요.

[사용자 정보]
성별: ${genderLabel} / 나이: ${ocrResult.age}세
현재 체중: ${ocrResult.weight}kg
흡연: ${userInput.smoke === 1 ? '현재 흡연' : '비흡연/금연'}
음주: ${userInput.drink === 1 ? '음주' : '비음주'}

[현재 건강 수치]
허리둘레: ${currentMetrics.waist}cm  (${genderLabel} 위험 기준: ${waistThreshold}cm 이상)
수축기혈압: ${currentMetrics.sbp}mmHg  (위험 기준: 130mmHg 이상)
이완기혈압: ${currentMetrics.dbp}mmHg  (위험 기준: 85mmHg 이상)
공복혈당: ${currentMetrics.bs}mg/dL  (위험 기준: 100mg/dL 이상)
중성지방: ${currentMetrics.tg}mg/dL  (위험 기준: 150mg/dL 이상)
HDL 콜레스테롤: ${currentMetrics.hdl}mg/dL  (${genderLabel} 위험 기준: ${hdlThreshold}mg/dL 미만)

[감량량별 예측 수치 전체]
${predictionsText}

[대사증후군 진단 기준]
허리둘레: ${waistThreshold}cm 이상
수축기혈압 130mmHg 이상 또는 이완기혈압 85mmHg 이상 (혈압은 둘 중 하나만 해당해도 1개)
공복혈당: 100mg/dL 이상
중성지방: 150mg/dL 이상
HDL: ${hdlThreshold}mg/dL 미만
→ 5가지 중 3가지 이상이면 대사증후군

[현재 대사증후군 위험 항목 수: ${syndromeCount}/5]

다음 JSON 형식으로만 응답해주세요. 다른 텍스트 없이 순수 JSON만 반환하세요:
{
  "overall_summary": "현재 건강 상태 한 줄 요약 (30자 이내)",
  "risk_level": "정상 또는 주의 또는 위험 중 하나만",
  "syndrome_count": ${syndromeCount},
  "recommended_loss_kg": 감량량별 예측 수치를 분석해서 대사증후군 기준 항목들이 정상 범위로 들어오는 최소 감량량 숫자만 반환 (단위 없이 숫자만),
  "recommended_reason": "해당 감량량 추천 이유 (어떤 지표가 정상으로 개선되는지 30자 이내로 설명)",
  "advices": [
    {
      "indicator": "지표명",
      "status": "정상 또는 주의 또는 위험 중 하나",
      "current_value": "현재 수치와 단위",
      "standard": "정상 기준 설명",
      "message": "현재 상태 설명 (2문장 이내)"
    }
  ],
  "lifestyle_tips": {
    "diet":     "식단 조언 (2문장 이내)",
    "exercise": "운동 조언 (2문장 이내)",
    "habit":    "생활습관 조언 (2문장 이내)"
  },
  "total_advice": "구체적 행동조언 + 식단 + 운동 + 생활습관 통합 종합 조언 (1000자 이내, 흡연/음주 여부 반드시 반영, 줄바꿈 없이 하나의 문단으로) lifestyle_tips에서 언급한 내용을 길게 풀어서 설명하는것 포함.
    추천 감량량 달성 시 기대 효과와 격려메세지를 자연스럽게 포함 시킬것. 맨 마지막 문장은 반드시 본 내용은 AI 기반 건강 정보 제공으로 의학적 진단을 대체하지 않습니다. 정확한 진단과 치료는 반드시 전문의와 상담하세요. 로 끝낼것 (총 total_advice는 1000자 정도로)"
}
  `;

  return retryOnError(async () => {
    const response = await getAI().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [prompt],
      config: { responseMimeType: "application/json", temperature: 0.3 }
    });
    return JSON.parse(response.text);
  }, '건강 조언');
}
