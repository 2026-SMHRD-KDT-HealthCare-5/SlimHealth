                        // 중계서버가 tbl_physical DB에 질의하고 응답받는 코드 (의료정보)


const express =  require("express");
const conn = require("../config/database")
    // 데이터 베이스 연결시 접속자료등을 config에서 가져옵니다.


const router = express.Router();
    // 2. 라우터 객체 생성
    // router를 익스프레스 모듈이라고 알림


    // CRUD
    // Create   생성하기 = 건강검사지 데이터 입력
    // Read     조회하기 = 이전 건강검사 데이터 조회
    // Update   수정하기 = 이전 건강검사 데이터 수정
    // Delete   삭제하기 = 이전 건강검사 데이터 삭제

//  tbl_physical
    // `physical_idx`  INT             NOT NULL    AUTO_INCREMENT COMMENT '헬스데이터. 데이터 식별자',  PRIMARY KEY, 자동생성
    // `user_idx`      INT             NOT NULL    COMMENT '유저번호. 사용자 식별자',       외래키
    // `height`        DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '키. 신장', 
    // `weight`        DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '몸무게. 체중', 
    // `bmi`           DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT 'BMI. 체질량지수', 
    // `sbp`           DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '혈압(수축). 혈압(수축)', 
    // `dbp`           DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '혈압(이완). 혈압(이완)', 
    // `bs`            DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '혈당. 공복혈당', 
    // `tg`            DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '중성지방. 중성지방', 
    // `hdl`           DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '콜레스테롤. 콜레스테롤', 
    // `waist`         DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '허리둘레. 허리둘레', 
    // `SMOKE`         INT             NOT NULL    DEFAULT 0 COMMENT '흡연여부', 
    // `DRINK`         INT             NOT NULL    DEFAULT 0 COMMENT '음주여부', 
    // `created_at`    DATETIME        NOT NULL    COMMENT '생성일자. 데이터업로드일자', 
    //  






let table_name = "tbl_physical" // 테이블명 정의
                                // 건강데이터 모음 - 피지컬 테이블

// let table_name = "USER_HEALTH"
// let table_name = "USER_PHYSIC"
    // const sql_create_userdata = `INSERT INTO ${table_name} values (? ? ? ?)`;   // 아이디 이름 PW 유저번호
    // const sql_read_userdata   = `SELECT * FROM ${table_name} WHERE ID= ? AND PW= ? `; // 아이디 PW  
    // const sql_update_userdata = `UPDATE ${table_name} SET PW= ? WHERE ID= ? `;  // PW ID
    // const sql_delete_userdata = `DELETE FROM ${table_name} WHERE ID = ? `;


// CRUD
    // Create   생성하기 = 건강데이터 새로 입력

    // 어라
    // 이거 테이블 입력값이 유저넘버 건강데이터넘버 건강데이터-생성일자 인데
        // 건데넘버는 시퀀스하고
        // 생성일자도 NOW(3)하고
        // 건데는 직접입력하는데  req
            // 외래키인 유저넘버는 어떻게 가져오지....?
                //..... 일단 유저한테 직접 입력해달라고 하자
                // 맞는 방법은 아닌것같지만 일단은 회피해두자



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
