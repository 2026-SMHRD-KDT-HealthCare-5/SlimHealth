// 여기에 1테이블 (ERD 테이블 구조 반영 및 변수명 통일 완료 🛠️)

const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const jwt = require("jsonwebtoken");
const authRequired = require("../middleware/authRequired");
const argon2 = require("argon2");

// 💡 ERD에 명시된 테이블명 그대로 반영
let table_name = "tbl_user"; 



// =======================================================
// 1. Create - 생성하기 = 회원가입
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

// 가입시에는 토큰 안씀 -> 해시코드 그대로 사용

// =======================================================
// 2. Read - 조회하기 = 로그인 + JWT 토큰 발급 
// =======================================================
// router.post("/read", async (req, res) => {
//     try {
//         const { account, password } = req.body;

//         if (!account || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "아이디와 비밀번호를 입력해주세요."
//             });
//         }

//         const sql_read_userdata = `SELECT * FROM tbl_user WHERE id = ?`;

//         const [readResult] = await conn.query(sql_read_userdata, [
//             account   ]);
//         console.log(readResult);

//         if (readResult.length === 0) {
//             console.log("로그인을 실패하였습니다. 아이디나 비밀번호를 확인하세요.");
//             return res.status(401).json({
//                 success: false,
//                 message: "아이디 또는 비밀번호가 일치하지 않습니다."
//             });
//         }



//         const isValid = await argon2.verify(readResult[0].password_hash, password);
//         if (!isValid) {
//             console.log("로그인을 실패하였습니다. 아이디나 비밀번호를 확인하세요.");
//             return res.status(401).json({
//                 success: false,
//                 message: "아이디 또는 비밀번호가 일치하지 않습니다."
//             });
//         }

//         const loginUser = readResult[0];
//         const token = jwt.sign(
//             {
//                 user_idx: loginUser.user_idx,
//                 account: loginUser.id,
//                 name: loginUser.name
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: process.env.JWT_EXPIRES_IN || "2h"
//             }
//         );

//         console.log("성공적으로 로그인되었습니다.");
//         return res.status(200).json({
//             success: true,
//             message: "성공적으로 로그인되었습니다.",
//             token: token,
//             user: {
//                 user_idx: loginUser.user_idx,
//                 account: loginUser.id,
//                 name: loginUser.name,
//                 email: loginUser.email,
//                 phone: loginUser.phone
//             }
//         });
//     } catch (err) {
//         console.error("🚨 로그인 중 DB 에러 발생:", err);
//         return res.status(500).json({
//             success: false,
//             message: "로그인 처리 중 서버 오류가 발생했습니다."
//         });
//     }
// });


// =======================================================
// 3. Update - 수정하기 = 회원정보 수정
// JWT 방식 + Argon2id 비밀번호 해시 적용
// =======================================================
router.post("/update", authRequired, async (req, res) => {
    try {
        // JWT 토큰 검증은 authRequired가 먼저 수행함
        // 검증 성공 시 req.user에 토큰 내용이 들어 있음
        const userIdx = req.user.user_idx;

        const { password, email, phoneNumber } = req.body;

        if (!password || !email || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "password, email, phoneNumber를 모두 입력해주세요."
            });
        }

        const passwordHash = await argon2.hash(password, {
            type: argon2.argon2id
        });

        const sql_update_userdata = `
            UPDATE tbl_user
            SET password_hash = ?, email = ?, phone = ?
            WHERE user_idx = ?
        `;

        const [updateResult] = await conn.query(sql_update_userdata, [
            passwordHash,
            email,
            phoneNumber,
            userIdx
        ]);

        if (updateResult.affectedRows === 1) {
            return res.status(200).json({
                success: true,
                message: "성공적으로 정보가 수정되었습니다."
            });
        }

        return res.status(404).json({
            success: false,
            message: "회원 정보를 찾을 수 없습니다."
        });

    } catch (err) {
        console.error("🚨 회원정보 수정 중 DB 에러 발생:", err);

        return res.status(500).json({
            success: false,
            message: "정보 수정 중 서버 오류가 발생했습니다."
        });
    }
});


// =======================================================
// 4. Delete - 삭제하기 = 회원탈퇴
// =======================================================
router.post("/delete", authRequired, async (req, res) => {
    try {
        const userIdx = req.user.user_idx;

        const sql_delete_userdata = `
            DELETE FROM tbl_user
            WHERE user_idx = ?
        `;

        const [deleteResult] = await conn.query(sql_delete_userdata, [userIdx]);

        if (deleteResult.affectedRows === 1) {
            return res.status(200).json({
                success: true,
                message: "성공적으로 탈퇴되었습니다."
            });
        }

        return res.status(404).json({
            success: false,
            message: "존재하지 않는 사용자입니다."
        });

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
