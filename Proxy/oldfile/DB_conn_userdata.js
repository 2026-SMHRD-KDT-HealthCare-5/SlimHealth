                                            // 중계서버가 유저 데이터 DB에 질의하고 응답받는 코드


const express =  require("express");
const conn = require("../config/database")
    // 데이터 베이스 연결시 접속자료등을 config에서 가져옵니다.


const router = express.Router();
    // 2. 라우터 객체 생성
    // router를 익스프레스 모듈이라고 알림


    // CRUD
    // Create   생성하기
    // Read     조회하기
    // Update   수정하기
    // Delete   삭제하기 의 4개 기능




// 큰 형태. 
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

// 유저테이블(tbl_user) 컬럼정리

  // 유저번호  AUTO_INCREMENT 이므로 null 입력
  // 아이디
  // 비밀번호
  // 이름

  // 이메일
   // 핸드폰
  // 역할
 // 가입일자


let table_name = "USER_DATA" // 테이블명 정의
// let table_name = "USER_HEALTH"
// let table_name = "USER_PHYSIC"
    // const sql_create_userdata = `INSERT INTO ${table_name} values (? ? ? ?)`;   // 아이디 이름 PW 유저번호
    // const sql_read_userdata   = `SELECT * FROM ${table_name} WHERE ID= ? AND PW= ? `; // 아이디 PW  
    // const sql_update_userdata = `UPDATE ${table_name} SET PW= ? WHERE ID= ? `;  // PW ID
    // const sql_delete_userdata = `DELETE FROM ${table_name} WHERE ID = ? `;

// CRUD
    // Create   생성하기 = 회원가입
    router.post("/create", ( req, res )=>{
        // req는 (생성)요청 : id, pw, name
        const {inputId, inputPw, inputName, inputEmail, inputPhone} = req.body;
        const sql_create_userdata = `INSERT INTO ${table_name} values ( NULL, ?, ?, ?, ?, ?, '유저', NULL )`;   //번호(널) 아이디 PW  이름   이메일 핸드폰 역할 생성일자널

        conn.query(sql_create_userdata , [ inputId, inputPw, inputName, inputEmail, inputPhone ] , (err, rows ) =>{  // 변수순서중요 - 실제 테이블의 컬럼순서와 맞게
            if(!err){
                console.log(rows);
                console.log( " 성공적으로 새 유저 저장. 회원가입을 환영합니다. " )
            }
            else { console.error(err) }
        })
    })


    // Read     조회하기 = 로그인 ( 요청 idpw == 응답 idpw ...이면 성공)
    router.post("/read", ( req, res )=>{
        // req는 (생성)요청 : id, pw, name
        const {inputId, inputPw,} = req.body;
        const sql_read_userdata = `SELECT * FROM ${table_name} WHERE id = ? AND pw = ?`;   //번호(널) 아이디 PW  이름   이메일 핸드폰 역할 생성일자널

        conn.query(sql_read_userdata , [ inputId, inputPw] , (err, rows ) =>{  // 변수순서중요 - 실제 테이블의 컬럼순서와 맞게
            if(!err){
                if( rows.length >0 ){
                    console.log(rows);
                    console.log( " 성공적으로 로그인되었습니다. " )
                }
                else{console.log( " 로그인을 실패하였습니다. " )}

            }
            else { console.error(err) 
                console.error("DB 오류가 발생하였습니다.....") }
        })
    })


    // Update   수정하기 = 회원정보 수정 : 비밀번호, 이메일, 전화번호 등등..
                                        // 이미 로그인 성공 상황 가정
    router.post("/update", ( req, res )=>{
        // req는 (생성)요청 : id, pw, name
        const {inputId, inputPw, inputEmail, inputPhone} = req.body;
        const sql_update_userdata = `UPDATE ${table_name} SET pw=?, email=?, phone=?     WHERE id = ? `;   //번호(널) 아이디 PW  이름   이메일 핸드폰 역할 생성일자널

        conn.query(sql_update_userdata , [ inputPw, inputEmail, inputPhone, inputId] , (err, rows ) =>{  // 변수순서중요 - 실제 테이블의 컬럼순서와 맞게
            if(!err){
                if( rows.affectedRows == 1 ){ // 영향받은 행이 1개이면 성공!
                    console.log(rows);
                    console.log( " 성공적으로 정보가 수정되었습니다. " )
                }
                else{console.log( " 정보수정을 실패하였습니다. " )}
            }
            else { console.error(err) 
                console.error("DB 오류가 발생하였습니다.....") }
        })
    })


    // Delete   삭제하기 =- 회원탈퇴
                            // 역시 이미 로그인한 상황 가정

    router.post("/delete", ( req, res )=>{
        // req는 (생성)요청 : id, pw, name
        const {inputId} = req.body;
        const sql_delete_userdata = `DELETE FROM ${table_name} WHERE id=? `;   //번호(널) 아이디 PW  이름   이메일 핸드폰 역할 생성일자널

        conn.query(sql_delete_userdata , [ inputId ] , (err, rows ) =>{  // 변수순서중요 - 실제 테이블의 컬럼순서와 맞게
            if(!err){
                if( rows.affectedRows ==1 ){ // 영향받은 행이 1개이면 성공!
                    console.log(rows);
                    console.log( " 성공적으로 탈퇴 되었습니다. " )
                }
                else{console.log( " 요청이 거부되었습니다. " )}
            }
            else { console.error(err) 
                console.error("DB 오류가 발생하였습니다.....") }
        })
    })



module.exports = router;
