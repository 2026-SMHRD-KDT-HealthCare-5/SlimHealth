const express = require("express");
const multer = require("multer");

const router = express.Router();

// uploads 폴더에 파일 저장
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// ES Module인 OCR 모듈 불러오기
const ocrModulePromise = import("../Api/ocr.mjs");

// POST /api/ocr
router.post("/", upload.array("files", 5), async (req, res) => {
    try {
        const { runOCR, validateOCR, getAgeCode } = await ocrModulePromise;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "업로드된 파일이 없습니다."
            });
        }

        const fileNames = req.files.map(file => file.path);

        const ocrResult = await runOCR(fileNames);

        const isValid = validateOCR(ocrResult);
        const ageCode = getAgeCode(ocrResult.age);

        return res.status(200).json({
            success: true,
            ocr: ocrResult,
            isValid,
            age_code: ageCode
        });

    } catch (err) {
        console.error("🚨 OCR 처리 중 에러:", err);

        return res.status(500).json({
            success: false,
            message: "OCR 처리 중 오류가 발생했습니다."
        });
    }
});

module.exports = router;