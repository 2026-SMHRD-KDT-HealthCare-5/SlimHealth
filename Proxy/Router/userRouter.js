// 여기에 1테이블 (ERD 테이블 구조 반영 및 변수명 통일 완료 🛠️)

const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const argon2 = require("argon2");

// 💡 ERD에 명시된 테이블명 그대로 반영
let table_name = "tbl_user"; 


// =======================================================
// 1. Create - 생성하기 = 회원가입 (ERD 반영 👍)
// =======================================================
router.post("/create", async ( req, res )=>{
    try{
        // 프론트엔드가 보낸 요청 바디 데이터
        // 각각           ID PW 이름              이멜 폰번
        // DB엔 회원번호, ID PW 이름 성별 생년 이멜 폰번 가입일
        // 회번 가입일은 알아서됨
        
        
            const { account, password, name, gender, birthYear, email, phoneNumber } = req.body;
        // 단, db,py는 생년, 성별코드만 필요하므로 수정필요. 
            const genderCode = gender === "Male" ? "M" : gender === "Female" ? "F" : "M";
            // 삼항연산 : male이면m으로, female이면f로, 그외 M으로.
                // 이결과를 젠더코드에 저장.
                // 젠더코드는 DB, py가 사용.

            const birthDate = birthYear ? `${birthYear}-01-01` : null;
            // 생년을 생년월일로 저장해서 DB에 사용.



        
        const sql_create_userdata = `INSERT INTO tbl_user
                (id, password_hash, name, gender, birth_date, email, phone)
                VALUES (?, ?, ?, ?, ?, ?, ?)`; 
        const hashedPassword = await argon2.hash(password);
        const [createResult] = await conn.query(sql_create_userdata, [ account, hashedPassword, name, genderCode, birthDate, email, phoneNumber ]);
        
        // 기존 코드
        // const [createResult] = await conn.query(sql_create_userdata , [ account, password, name, genderCode, birthDate, email, phoneNumber ] );
        // // 빈칸 7개, 변수 7개

        console.log(createResult);
        console.log( " 성공적으로 새 유저 저장. 회원가입을 환영합니다. " );

        return res.status(201).json({
            success: true,
            message: "회원가입이 성공적으로 완료되었습니다.",
            user_idx: createResult.insertId 
        });
    }
    catch(err){
        console.error("🚨 회원가입 중 서버 에러 발생:", err);
        return res.status(500).json({
            success: false,
            message: "회원가입 처리 중 데이터베이스 오류가 발생했습니다."
        });
    }
});


// =======================================================
// 2. Read - 조회하기 = 로그인 (ERD 반영 🛠️)
// =======================================================
router.post("/read", async ( req, res )=>{
    try{
        const { account, password } = req.body;
        

        const sql_read_userdata = `SELECT * FROM tbl_user WHERE id = ?`;

        const [readResult] = await conn.query(sql_read_userdata , [ account ]);
        console.log(readResult);

        if (readResult.length === 0) {
            console.log( " 로그인을 실패하였습니다. 아이디나 비밀번호를 확인하세요. " );
            return res.status(401).json({
                success: false,
                message: "아이디 또는 비밀번호가 일치하지 않습니다."
            });
        }

        const isValid = await argon2.verify(readResult[0].password_hash, password);
        if (!isValid) {
            console.log( " 로그인을 실패하였습니다. 아이디나 비밀번호를 확인하세요. " );
            return res.status(401).json({
                success: false,
                message: "아이디 또는 비밀번호가 일치하지 않습니다."
            });
        }

        console.log( " 성공적으로 로그인되었습니다. " );
        return res.status(200).json({
            success: true,
            message: "성공적으로 로그인되었습니다.",
            user: {
                user_idx: readResult[0].user_idx,      // ERD 기준 PK
                account: readResult[0].id,             // ERD 기준 id
                name: readResult[0].name,              // ERD 기준 name
                email: readResult[0].email,            // ERD 기준 email
                phone: readResult[0].phone             // ERD 기준 phone
            }
        });
    }
    catch(err) {
        console.error("🚨 로그인 중 DB 에러 발생:", err);
        return res.status(500).json({
            success: false,
            message: "로그인 처리 중 서버 오류가 발생했습니다."
        });
    }
});


// =======================================================
// 3. Update - 수정하기 = 회원정보 수정 (ERD 반영 🛠️)
// =======================================================
router.post("/update", async ( req, res )=>{
    try{
        const { account, password, email, phoneNumber } = req.body;
        
        // 💡 [교정] ERD 컬럼명 반영 (password_hash, email, phone)
        const sql_update_userdata = `UPDATE ${table_name} SET password_hash=?, email=?, phone=? WHERE id = ? `; 

        // SQL 바인딩 순서 매칭: password_hash(password) ➡️ email ➡️ phone(phoneNumber) ➡️ id(account)
        const [ updateResult ] = await conn.query(sql_update_userdata , [ password, email, phoneNumber, account ] );
        console.log(updateResult);
        
        if (updateResult.affectedRows === 1) {
            console.log( " 성공적으로 정보가 수정되었습니다. " );
            return res.status(200).json({
                success: true,
                message: "성공적으로 정보가 수정되었습니다."
            });
        } else {
            console.log( " 정보수정을 실패하였습니다. (존재하지 않는 사용자) " );
            return res.status(400).json({
                success: false,
                message: "회원 정보 수정에 실패했습니다."
            });
        }
    }
    catch(err){
        console.error("🚨 회원정보 수정 중 DB 에러 발생:", err); 
        return res.status(500).json({
            success: false,
            message: "정보 수정 중 서버 오류가 발생했습니다."
        });
    }
});


// =======================================================
// 4. Delete - 삭제하기 = 회원탈퇴 (ERD 반영 🛠️)
// =======================================================
router.post("/delete", async (req, res) => {
    try {
        const { account } = req.body;

        if (!account) {
            return res.status(400).json({
                success: false,
                message: "탈퇴할 계정 ID가 필요합니다."
            });
        }

        const sql_delete_userdata = `
            DELETE FROM tbl_user
            WHERE id = ?
        `;

        const [deleteResult] = await conn.query(sql_delete_userdata, [account]);

        console.log(deleteResult);

        if (deleteResult.affectedRows === 1) {
            console.log("성공적으로 탈퇴 되었습니다.");

            return res.status(200).json({
                success: true,
                message: "성공적으로 탈퇴되었습니다."
            });
        } else {
            console.log("탈퇴 요청 실패: 존재하지 않는 사용자");

            return res.status(404).json({
                success: false,
                message: "존재하지 않는 사용자입니다."
            });
        }

    } catch (err) {
        console.error("🚨 회원탈퇴 중 DB 에러 발생:", err);

        return res.status(500).json({
            success: false,
            message: "회원 탈퇴 처리 중 서버 내부 오류가 발생했습니다."
        });
    }
});

// =======================================================
// 5. 아이디 중복 확인
// =======================================================
router.post("/check", async (req, res) => {
    try {
        const { account } = req.body;

        if (!account) {
            return res.status(400).json({
                success: false,
                message: "아이디를 입력해주세요."
            });
        }

        const sql = `
            SELECT user_idx
            FROM tbl_user
            WHERE id = ?
        `;

        const [result] = await conn.query(sql, [account]);

        return res.status(200).json({
            success: true,
            isDuplicate: result.length > 0,
            message: result.length > 0
                ? "이미 사용 중인 아이디입니다."
                : "사용 가능한 아이디입니다."
        });

    } catch (err) {
        console.error("🚨 중복 확인 중 DB 에러:", err);

        return res.status(500).json({
            success: false,
            message: "서버 오류가 발생했습니다."
        });
    }
});




module.exports = router;

// 요청 주소 예시
// http://localhost:8000/api/user/read
// http://localhost:8000/api/user/update
