            // 중계서버가 예측 데이터 TABLE에 질의하고 응답받는 코드
                // 여기도 기능상주소니 주소 재설정필요 

const express =  require("express");
const conn = require("../config/database")
    // 데이터 베이스 연결시 접속자료등을 config에서 가져옵니다.


const router = express.Router();
    // 2. 라우터 객체 생성
    // router를 익스프레스 모듈이라고 알림
/* 데이터 흐름
    // 필요한 정보를 DB에 요청한다
        // 필요한 정보를 정의한다.
            // 의료정보, 유저정보, 예측데이터
        // DB에 쿼리문으로 질의한다.
            // 쿼리문을 작성한다
            // 쿼리문에 변수형태의 정보를 기입한다.

    // DB가 응답한다
        // 쿼리문에 따른 동작을 실행한다
            // C R U D 중 하나의 동작.
                //
        // 얻은 정보를 XP에 응답한다.
            // 얻은 정보는 오류코드, NULL 혹은 딕셔너리형이다.
                // 오류코드 : 오류코드를 그대로 출력한다.
                // NULL     : "결과없음"을 출력한다
                // 딕셔너리 : 키와 밸류로 쪼개어 재가공한다.
*/

const table_name = "tbl_analysis" // 테이블명 정의한다
    // -> ML 예측후 예측데이터 저장TABLE

    // Data는 .json형태로 받아올것
    // 해서, 건데 A기준으로 예측값 체중 [(X-30)kg ~ X kg]으로
    // 건데 하나당 약 10~50여개 예측값 생성 
    // -> 건강할수록 예측할 감량체중 범위가 적으니까
    // -> 저체중을 예측할 필요는 없으니까.

    /* 예측데이터 예시.
[
  {
    "gender": 1,
    "age_code": 5,
    "height": 175.0,
    "smoke": 0,
    "drink": 1,
    "weight": 85.5,
    "target_weight": 75.0,
    "waist": 90.0,
    "sbp": 130.0,
    "dbp": 85.0,
    "bs": 105.0,
    "tg": 150.0,
    "hdl": 50.0
  },
  {
    "gender": 2,
    "age_code": 4,
    "height": 160.0,
    "smoke": 1,
    "drink": 0,
    "weight": 70.0,
    "target_weight": 60.0,
    "waist": 85.0,
    "sbp": 120.0,
    "dbp": 80.0,
    "bs": 95.0,
    "tg": 120.0,
    "hdl": 55.0
  }
] */

    /* CRUD 란?
    // Create   생성하기 - 응답받은 리스트 내 객체들을 분해하여 입력(반복)
    // Read     조회하기 - 단일조회 없음, 피지컬번호 단위로 조회
    // Update   수정하기 - X, 개발하지 않을것
    // Delete   삭제하기 - X, 상위테이블 삭제시 한번에 삭제 cascade
                        // 단일 정보를 삭제하지는 않을 것 -> physical에서 같이삭제
*/


// 생성은 파이선에게 json을 받았을때 실행
    // -> 파이선 응답을 받은 후 자동실행
        // 파이선 요청응답부분을 만들고 그쪽에 붙이기
    // C 칸만 만들어두고 주석 적어두기

// CRUD
    // Create   생성하기 = ML예측데이터 입력
    // 단, 건데 하나당 여러 예측을 위해 "반복문 필요"

    /* router.post("/create", ( req, res )=>{
        // req는 (생성)요청 : id, pw, name
        // const {inputId, inputPw, inputName, inputEmail, inputPhone} = req.body;



        const sql_create_userdata = `INSERT INTO ${table_name} values ( NULL, ?, ?, ?, ?, ?, '유저', NULL )`;  

        conn.query(sql_create_userdata , [ inputId, inputPw, inputName, inputEmail, inputPhone ] , (err, rows ) =>{  
            if(!err){
                console.log(rows);
                console.log( " 성공적으로 새 유저 저장. 회원가입을 환영합니다. " )
            }
            else { console.error(err) }
        })
    })
*/

    // Read     조회하기 = 불필요하므로 미개발
        // 단일조회 : 중계서버는 특정 예측데이터를 조회 할 필요가 없음
        // 전체조회 : 
    // Update   수정하기 = 불필요하므로 미개발
        // 단일수정 : ML의 예측데이터를 수정 할 필요가 없음

    // Delete   삭제하기 = 예측데이터를 삭제
        // 단일삭제 :   한개의 예측데이터를 삭제할 경우 - 불필요하므로 미개발
        // 전체삭제 1 : 예측데이터를 삭제하고 다시 예측요청 할 경우
                        // 하단 코드↓
        // 전체삭제 2 : 상위tbl_physical 삭제시 이로 파생된 예측데이터 삭제
                        // cascade -> DBconn피지컬에 코드작성필요


// 삭제는 유저에게 삭제요청을 받았을때 실행
    // 지금, db에서, 유저는,  피지컬인덱스를 파생되는 예측데이터를, 삭제하라고
    // 피지컬인덱스를 유저는 피지컬테이블 전체조회 기능으로 확인했음
    // 딜리트 웨어 피지컬인덱스=1

    router.post("/delete", ( req, res )=>{
        // req는 (생성)요청 : id, pw, name
        const { inputPhysical } = req.body;
        const sql_delete_physicaldata = `DELETE FROM ${table_name} WHERE physical_idx=? `;  

        conn.query(sql_delete_physicaldata , [ inputPhysical ] , (err, rows ) =>{  // 변수순서중요 - 실제 테이블의 컬럼순서와 맞게
            if(!err){
                console.log( " 성공적으로 삭제 되었습니다. " )
            }
            else { console.error(err) 
                console.error("DB 오류가 발생하였습니다.....") }
        })
    })



module.exports = router;
