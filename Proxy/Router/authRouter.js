// Router/authRouter.js
const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

// accessToken 생성 함수
function createAccessToken(user) {
    return jwt.sign(
        {
            user_idx: user.user_idx,
            account: user.id,
            name: user.name
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "15m"
        }
    );
}

// refreshToken 생성 함수
function createRefreshToken(user) {
    return jwt.sign(
        {
            user_idx: user.user_idx
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
        }
    );
}

// =======================================================
// 로그인
// POST /api/auth/login
// =======================================================
router.post("/login", async (req, res) => {
    try {
        const { account, password } = req.body;

        if (!account || !password) {
            return res.status(400).json({
                success: false,
                message: "아이디와 비밀번호를 입력해주세요."
            });
        }

        if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
            return res.status(500).json({
                success: false,
                message: "서버 인증 설정 오류가 발생했습니다."
            });
        }

        const sql = `
            SELECT user_idx, id, password_hash, name, email, phone
            FROM tbl_user  WHERE id = ? LIMIT 1
        `;

        const [rows] = await conn.query(sql, [account]);

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "아이디 또는 비밀번호가 일치하지 않습니다."
            });
        }

        const loginUser = rows[0];

        const isValid = await argon2.verify(
            loginUser.password_hash,
            password
        );

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "아이디 또는 비밀번호가 일치하지 않습니다."
            });
        }

        const accessToken = createAccessToken(loginUser);
        const refreshToken = createRefreshToken(loginUser);

        return res.status(200).json({
            success: true,
            message: "성공적으로 로그인되었습니다.",

            // 새 구조
            accessToken,
            refreshToken,


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

// =======================================================
// accessToken 재발급
// POST /api/auth/refresh
// body: { refreshToken: "..." }
// =======================================================
router.post("/refresh", async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "리프레시 토큰이 없습니다."
            });
        }

        if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
            return res.status(500).json({
                success: false,
                message: "서버 인증 설정 오류가 발생했습니다."
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );
        } catch (err) {
            console.error("🚨 refreshToken 검증 실패:", err);

            return res.status(401).json({
                success: false,
                message: "유효하지 않거나 만료된 리프레시 토큰입니다."
            });
        }

        const [userRows] = await conn.query(
            `
            SELECT user_idx, id, name, email, phone
            FROM tbl_user
            WHERE user_idx = ?
            LIMIT 1
            `,
            [decoded.user_idx]
        );

        if (userRows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "사용자 정보를 찾을 수 없습니다."
            });
        }

        const user = userRows[0];

        const newAccessToken = createAccessToken(user);

        return res.status(200).json({
            success: true,
            message: "액세스 토큰이 재발급되었습니다.",
            accessToken: newAccessToken,

            // 기존 프론트 호환용
            token: newAccessToken
        });

    } catch (err) {
        console.error("🚨 토큰 재발급 중 에러:", err);

        return res.status(500).json({
            success: false,
            message: "토큰 재발급 중 서버 오류가 발생했습니다."
        });
    }
});

// =======================================================
// 로그아웃
// POST /api/auth/logout
// DB에 refreshToken을 저장하지 않는 방식이므로
// 서버에서는 실제 폐기할 토큰이 없음.
// 프론트에서 localStorage/sessionStorage 토큰 삭제하면 됨.
// =======================================================
router.post("/logout", async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "로그아웃되었습니다. 프론트에서 토큰을 삭제해주세요."
    });
});

module.exports = router;
