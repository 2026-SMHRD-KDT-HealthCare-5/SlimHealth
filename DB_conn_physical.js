                        // 중계서버가 tbl_physical DB에 질의하고 응답받는 코드 (의료정보)
                        // 주소 프론트와 협의해서 수정바람
                            // 현재 기능상주소이므로 중복되어,
                            //  회원-수정, 건데-삭제 등으로 고쳐야함

const express =  require("express");
    // 데이터 베이스 연결시 접속자료등을 config에서 가져옵니다.
const conn = require("../config/database")


// 2. 라우터 객체 생성
    // router를 익스프레스 모듈이라고 알림
const router = express.Router();



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


const table_name = "tbl_physical" // 테이블명 정의
                                // 건강데이터 모음 - 피지컬 테이블


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


    // C - 건강데이터 "입력" - [완료]
    router.post("/create", ( req, res )=>{
        // req는 건강데이터 목록
        const { inputHeight, inputWeight, inputBMI, inputSbp,
                inputDbp, inputBs, inputTg, inputHdl, inputWaist,
                inputSmoke, inputDrink} = req.body;
        const sql_create_physicaldata = `INSERT INTO ${table_name} values (
            NULL, NULL,   ?,?,?,?,?,  ?,?,?,?, ?,?,  NULL )`;  
        // 널은 각각 건강데이터번호, 사용자번호, 데이터생성일자 이다. 

        conn.query(sql_create_physicaldata , 
            [   inputHeight, inputWeight, inputBMI, inputSbp, inputDbp,     // 키,무게,BMI,수축혈압, 이완혈압,
                inputBs, inputTg, inputHdl, inputWaist,                     // 혈당 중성지방 콜레스테롤 허리둘레  
                inputSmoke, inputDrink ] ,                                  // 흡연 음주
            (err, rows ) =>{  // 변수순서중요 - 실제 테이블의 컬럼순서와 맞게
                if(!err){
                    console.log(rows);
                    console.log( " 성공적으로 건강데이터 저장. " )
                }
                else { console.error(err) }
            })
    })


    // Read     조회 - 내 전체 건강데이터 확인 
    router.post("/readall", ( req, res )=>{

    // R1-1.  회원테이블에서 ID에 맞는 회원 idx 조회
        // 로그인은 이미 된 상태니 ID만 물어보기
        const {inputId} = req.body;
        const sql_read_userIdx = `SELECT user_idx FROM tbl_userdata WHERE id = ?`;   
        conn.query( sql_read_userIdx, [inputId], (err, rows) =>{
            if(!err){
                const userIdx = rows;
            }else{console.error("DB 오류가 발생하였습니다.....") }
        })

    // R1-2. 피지컬테이블에서 회원idx에 해당하는 건데를 전부 조회
        const sql_read_AllPhysical = `SELECT * FROM tbl_physical WHERE user_idx = ?`;  
        conn.query( sql_read_userIdx, [userIdx], (err, rows) =>{
            if(!err){
                    console.log(rows);
            }else{console.error("DB 오류가 발생하였습니다.....") }
        })
    })


    // // 한개의 건강검진데이터 확인- > ...필요할까? 위에서 전부 확인했는데.
    // router.post("/readone", ( req, res )=>{
	// // R2-1. 	조회된 모든 건데 들에서 건데 PK를 추출
	// // R2-2. 	추출된 건데pk를 (WHERE id =? 처럼 써서 ) 조회 수정 삭제 운용
    // })



    // Update   수정하기 = 건강정보 수정 : 혈압 등등.. -[완료]
                                        // 이미 로그인 성공 상황 가정
                                        // 건데번호는 readall에서 확인했다고 가정
    router.post("/update", ( req, res )=>{
        // 건데번호와 수정내용을 모두 req로 받아야함
        // 건데번호는 readall에서 확인했다고 가정

        const { inputHeight, inputWeight, inputBMI, inputSbp,
                inputDbp, inputBs, inputTg, inputHdl, inputWaist,
                inputSmoke, inputDrink, inputPhysical } = req.body;
        const sql_update_physicaldata = `UPDATE ${table_name}
            SET height=?, weight=?, BMI=?, sbp=?, dbp=?, bs=?, tg=?, hdl=?, waist=?, smoke=?, drink=?
            WHERE physical_idx = ? `;
            //번호(널) 아이디 PW  이름   이메일 핸드폰 역할 생성일자널

        conn.query(sql_update_physicaldata, 
            [   inputHeight, inputWeight, inputBMI, inputSbp, inputDbp,     // 키,무게,BMI,수축혈압, 이완혈압,
                inputBs, inputTg, inputHdl, inputWaist,                     // 혈당 중성지방 콜레스테롤 허리둘레  
                inputSmoke, inputDrink, inputPhysical ] ,                                  // 흡연 음주
             ( err, rows ) =>{  // 변수순서중요 - 실제 테이블의 컬럼순서와 맞게
                if(!err){
                    if( rows.affectedRows == 1 ){ // 영향받은 행이 1개이면 성공!
                        console.log(rows);
                        console.log( " 성공적으로 건강정보가 수정되었습니다. " )
                    }
                    else{console.log( " 정보수정을 실패하였습니다. " )}
                }
                else { console.error(err) 
                    console.error("DB 오류가 발생하였습니다.....") }
            })
    })


    // Delete   삭제하기 = 건강검진 데이터 삭제 - [완료]
                            // 역시 이미 로그인한 상황 가정
                            // 건데번호는 readall에서 확인했다고 가정
    router.post("/delete", ( req, res )=>{
        // req는 (생성)요청 : id, pw, name
        const {inputPhysical} = req.body;
        const sql_delete_physicaldata = `DELETE FROM ${table_name} WHERE physical_idx=? `;  

        conn.query(sql_delete_physicaldata , [ inputPhysical ] , (err, rows ) =>{  // 변수순서중요 - 실제 테이블의 컬럼순서와 맞게
            if(!err){
                if( rows.affectedRows ==1 ){ // 영향받은 행이 1개이면 성공!
                    console.log(rows);
                    console.log( " 검진내역이 성공적으로 삭제되었습니다. " )
                }
                else{console.log( " 요청이 거부되었습니다. " )}
            }
            else { console.error(err) 
                console.error("DB 오류가 발생하였습니다.....") }
        })
    })



module.exports = router;
