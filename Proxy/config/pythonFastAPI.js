// Python 와 연결되어진 통로정보를 가지고있는 파일입니다.


// 📄 path: src/config/pythonFastAPI.js

const PYTHON_SERVER_BASE = "http://localhost:8081";

const pythonConfig = {
    // 1. 기본 주소
    baseUrl: PYTHON_SERVER_BASE,
    
    // 2. 기능별 최종 전체 주소 목록
    predictAllUrl: `${PYTHON_SERVER_BASE}/predict-all`
};

// 밖에서 require()로 가져다 쓸 수 있도록 내보내기
module.exports = pythonConfig;