// ── Gemini API 키 로테이션 공통 모듈 ─────────────────────────
// 모든 파일에서 import해서 사용
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const API_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
].filter(Boolean);

if (API_KEYS.length === 0) {
  console.error("❌ GEMINI_API_KEY_1~4 중 하나 이상 설정 필요");
  process.exit(1);
}

let currentKeyIndex = 0;

export function getAI() {
  return new GoogleGenAI({ apiKey: API_KEYS[currentKeyIndex] });
}

export function rotateKey(errorMsg) {
  if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') ||
      errorMsg.includes('503') || errorMsg.includes('UNAVAILABLE')) {
    const nextIndex = (currentKeyIndex + 1) % API_KEYS.length;
    if (nextIndex !== currentKeyIndex) {
      console.log(`🔄 API 키 교체: 키${currentKeyIndex + 1} → 키${nextIndex + 1}`);
      currentKeyIndex = nextIndex;
      return true;
    }
  }
  return false;
}

export async function retryOnError(fn, label = '') {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await fn();
    } catch (e) {
      const isRetryable =
        e.message.includes('503') || e.message.includes('UNAVAILABLE') ||
        e.message.includes('429') || e.message.includes('RESOURCE_EXHAUSTED');
      if (isRetryable && attempt < 3) {
        const keyRotated = rotateKey(e.message);
        const wait = keyRotated ? 1000 : (e.message.includes('429') ? 10000 : 5000);
        console.log(`⚠️  ${label} 오류 (${attempt}/3), ${wait/1000}초 후 재시도...`);
        await new Promise(r => setTimeout(r, wait));
      } else throw e;
    }
  }
}
