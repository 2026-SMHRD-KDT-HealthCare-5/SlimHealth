// Router/authRouter.js
const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

router.post("/login", async (req, res) => {
    try {
        const { account, password } = req.body;

        if (!account || !password) {
            return res.status(400).json({
                success: false,
                message: "아이디와 비밀번호를 입력해주세요."
            });
        }

        const sql = `
            SELECT user_idx, id, password_hash, name, email, phone
            FROM tbl_user
            WHERE id = ?
            LIMIT 1
        `;

        const [rows] = await conn.query(sql, [account]);

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "아이디 또는 비밀번호가 일치하지 않습니다."
            });
        }

        const loginUser = rows[0];

        const isValid = await argon2.verify(loginUser.password_hash, password);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "아이디 또는 비밀번호가 일치하지 않습니다."
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "서버 인증 설정 오류가 발생했습니다."
            });
        }

        const token = jwt.sign(
            {
                user_idx: loginUser.user_idx,
                account: loginUser.id,
                name: loginUser.name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "2h"
            }
        );

        return res.status(200).json({
            success: true,
            message: "성공적으로 로그인되었습니다.",
            token,
            user: {
                user_idx: loginUser.user_idx,
                account: loginUser.id,
                name: loginUser.name,
                email: loginUser.email,
                phone: loginUser.phone
            }
        });

    } catch (err) {
        console.error("🚨 로그인 중 DB 에러 발생:", err);

        return res.status(500).json({
            success: false,
            message: "로그인 처리 중 서버 오류가 발생했습니다."
        });
    }
});

module.exports = router;