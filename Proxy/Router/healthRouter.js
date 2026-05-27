// 여기에 2, 3테이블 기능 생성

/*

[2] 2, 3 테이블 라우터 파일에... 여러개의 라우터함수 ... 총 N개

[2] - 1) 2테이블 생성
   ㄴ 생성 즉시 파이선에 예측결과 질의/응답
       ㄴ 예측결과 3테이블에 저장
           ㄴ 저장후 리액트에 전송(응답)


[2] - 2) 2테이블 조회 기능
	ㄴ 조회페이지에 목록 쭉 기록
	ㄴ 목록중 하나를 눌러 연관된 예측페이지로 연결
		ㄴ 예측페이지에 해당 2테이블정보와 3테이블 정보를 조회로 출력

[2] - 3) 조회기능에서 생성된 페이지에서,
ㄴ 2테이블 수정 기능 
   ㄴ 생성하고 파이선에 예측결과 질의/응답
   	ㄴ이때 3테이블이 있으면 삭제하고 인서트 (IF 분기)
	ㄴ이때 3테이블이 없으면 그냥 인서트

[2] - 4) 조회기능에서 생성된 페이지에서,
ㄴ 2테이블 삭제
    ㄴ 이때 즉시 3테이블의 종속데이터 삭제

-> 1234가 2테이블 CRUD

    3테이블 C는 1), 3)에 포함
    3테이블 R 은 2)에 포함
    3테이블 U 는 필요없음
    3테이블 D 은 5)

[2] - 5) ㄴ 3테이블 삭제
    ㄴ 연관된 2테이블의 데이터로 파이선에 질의
       ㄴ 예측결과 3테이블에 저장
           ㄴ 저장후 리액트에 전송(응답)
*/

const express =  require("express");
const router = express.Router();
const conn = require("../config/database")
const axios = require("axios");
const multer = require("multer");
const path = require("path");

const pythonFastAPI = require("../config/pythonFastAPI");
const healthAdviceModulePromise = import("../Api/healthAdvice.mjs");



// 로그인 유저 체크
function getLoginUserIdx(req) {
    if (!req.user || !req.user.user_idx) {
        return null;
    }

    return Number(req.user.user_idx);
}



// 건데 생성과 예데 생성(완료) 23C
router.post("/create", async (req, res) =>{
        // [2] - 1) 2테이블 생성
        //    ㄴ 생성 즉시 파이선에 예측결과 질의/응답
        //        ㄴ 예측결과 3테이블에 저장
        //            ㄴ 저장후 리액트에 전송(응답)
    try{
            //로그인 구현
            const userIdx = getLoginUserIdx(req);
            if (!userIdx) {
                return res.status(401).json({
                    success: false,
                    message: "로그인이 필요합니다."
                });
            }


        // 리액트에서 받은 데이터 분석
                // 2테이블에 인서트할 인수정의
                // 2테이블에 인서트
                    // 파이선에 질의
                    // 파이선응답 분해
            // 3테이블에 인서트
        // 리액트에 전송

        const { userHeight: inputHeight,
                userWeight: inputWeight,
                systolicBp: inputSbp,
                diastolicBp: inputDbp,
                bloodGlucose: inputBs,
                triglyceride: inputTg,
                cholesterol: inputHdl, // 프론트의 cholesterol 수치를 기존 inputHdl 변수에 매핑
                waistLine: inputWaist,
                isSmoke: inputSmoke,
                isDrink: inputDrink, 
                checkupDate : inputCheckup
            } = req.body;



        const sqlCreatePhysical = ` 
            INSERT INTO tbl_physical ( user_idx, height, weight, sbp, dbp, bs, tg, hdl, waist, smoke, drink, checkup_date ) 
            VALUES                   ( ?,        ?,      ?,      ?,   ?,   ?,  ?,  ?,   ?,     ?,     ?,     ?            )
        `;

        const [result] = await conn.query(sqlCreatePhysical, [ 
                userIdx, inputHeight, inputWeight, inputSbp, inputDbp, 
                inputBs, inputTg, inputHdl, inputWaist, inputSmoke, inputDrink,
                inputCheckup
        ]); // 2tb 인서트



        // 파이선 비동기ddd

            // 파이선을 위해 나이계산 : 검진년월일 - 생년 = 나이age
            const sqlReadUser = `
                SELECT birth_date, gender
                FROM tbl_user
                WHERE user_idx = ?
            `;

            const [userRows] = await conn.query(sqlReadUser, [userIdx]);

            if (userRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "사용자 정보를 찾을 수 없습니다."
                });
            }

            const userBirthDate = userRows[0].birth_date;
            const userGender = userRows[0].gender;

            const tempbirth = userBirthDate instanceof Date
                ? userBirthDate.getFullYear()
                : Number(String(userBirthDate).substring(0, 4));

            const tempGender = userGender === "M" ? 1 : 2;

            const checkupYear = parseInt(String(inputCheckup).substring(0, 4));
            const age = checkupYear - tempbirth;


        let ageCode = 10; // 범위 밖을 대비한 기본 디폴트값
        if (age >= 25 && age <= 34) {
            ageCode = 7;   // 25~29세, 30~34세 둘 다 7
            } else if (age >= 35 && age <= 39) {
                ageCode = 8;
            } else if (age >= 40 && age <= 44) {
                ageCode = 9;
            } else if (age >= 45 && age <= 49) {
                ageCode = 10;  // 현재 46세인 유저분은 여기에 걸려 정상적으로 10이 됩니다!
            } else if (age >= 50 && age <= 54) {
                ageCode = 11;
            } else if (age >= 55 && age <= 59) {
                ageCode = 12;
            } else if (age > 59) {
                ageCode = 13;  // 60세 이상 예외 방어막 (필요시 조절)
            } else {
                ageCode = 6;   // 24세 이하 예외 방어막 (필요시 조절)
            }
        const calBMI = inputWeight / ((inputHeight / 100) * (inputHeight / 100));;



        // 프론트의 변수를 파이선용으로 파싱
        const pyPayload = { 
            height: Number(inputHeight),
            weight: Number(inputWeight),
            sbp:    Number(inputSbp),
            dbp:    Number(inputDbp),
            bs:     Number(inputBs),
            tg:     Number(inputTg),
            hdl:    Number(inputHdl),     
            waist:  Number(inputWaist),   
            smoke:  Number(inputSmoke),   
            drink:  Number(inputDrink),
            age:    Number(age),
            gender: Number(tempGender),
            age_code: Number(ageCode),
            bmi :   Number(calBMI)
        };

        const pyRes = await axios.post(pythonFastAPI.predictAllUrl, pyPayload) ;
        // 파이선에 받은의료정보(req.body)를 ~주소로 보냅니다.
        const analysisData = pyRes.data; 


        // 3tb 비동기, 인서트 (kg당 하나씩 DB입력) 

                for (const kgKey in analysisData.predictions) {
                    const targetData = analysisData.predictions[kgKey]; 
                    const lossKg = parseInt(kgKey); 

                    const predictHeight = inputHeight;
                    const predictWeight = parseFloat((inputWeight - lossKg).toFixed(1));

                    const predictWaist = targetData.waist.predicted;
                    const predictSbp   = targetData.sbp.predicted;
                    const predictDbp   = targetData.dbp.predicted;
                    const predictBs    = targetData.bs.predicted;
                    const predictTg    = targetData.tg.predicted;
                    const predictHdl   = targetData.hdl.predicted;


                    const sql_create_predictdata = `
                        INSERT INTO tbl_analysis ( physical_idx, height, weight, weight_loss, sbp, dbp, bs, tg, hdl, waist ) 
                        VALUES                   ( ?,            ?,      ?,      ?,           ?,   ?,   ?,  ?,  ?,   ?     )  
                    `;

                    // 🎯 바인딩 배열에서도 더 이상 필요 없는 currentTimestamp 변수를 쏙 빼줍니다!
                    await conn.query(sql_create_predictdata, [
                        result.insertId,
                        predictHeight, 
                        predictWeight, 
                        lossKg,
                        predictSbp, 
                        predictDbp,
                        predictBs, 
                        predictTg, 
                        predictHdl, 
                        predictWaist
                    ]);
                }
        // 리액트 전송
        return res.status(201).json(analysisData);
    }
    catch(err) {
        // 대충 에러메시지
        console.error("🚨 분석 데이터 생성 중 백엔드 에러 발생:", err);

        if (err.isAxiosError && err.response) {
        console.log("❌ 파이선 오류코드:", JSON.stringify(err.response.data, null, 2));
    }
        return res.status(500).json({ 
            success: false, 
            message: "백엔드에서 데이터를 처리하는 중 오류가 발생했습니다." 
        });
    }
})


// 건데 페이지를 위한 조회 2R (완료)
router.post("/list", async (req, res) =>{
    try{
        // 2테이블에 현재 로그인된 유저의 모든 건강정보를 불러와서 전송
        // db 질의 결과를 (프론트에서 보내주는것과 같은 형식으로 json) 만들어서 프론트로 송신
        // 현재 로그인 유저는 목업데이터로 1번 유저로 가정
        // 세션에서 로그인유저 판별 (유저 인덱스 추출)
            // 단, 지금은 목업데이터로 1번 하드코딩
        // sql 생성 : 2테이블, 모든 셀렉, 기준은 유저인덱스
        // SELECT * FROM tbl_physical WHERE user_idx = 1;
                                            //  실제론 1을 ?로 


        // const mockupUseridx = req.headers['x-user-id'];
        // if (!userIdx) return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
        const userIdx = getLoginUserIdx(req);

        
        const readListSQL = `
            SELECT
                p.physical_idx AS id,
                p.checkup_date AS date,
                p.height, p.weight, p.waist, p.hdl, p.sbp, p.dbp, p.bs, p.tg,
                p.smoke, p.drink,
                YEAR(p.checkup_date) - YEAR(u.birth_date) AS age,
                u.gender
            FROM tbl_physical p
            JOIN tbl_user u ON p.user_idx = u.user_idx
            WHERE p.user_idx = ?
            ORDER BY p.physical_idx DESC
        `;
        const [readListResult] = await conn.query(readListSQL, [userIdx]);

        const formattedList = readListResult.map(row => ({
            ...row,
            isSmoke: row.smoke === 1,
            isDrink: row.drink === 1,
            gender: row.gender === 'M' ? '남' : '여',
        }));


        // 디비 질의 결과 DBResult를 JSON 화
        // res에 JSON을 담아서 전송
        // [4] 디비 질의 결과 DBResult를 JSON 화하여 res에 담아서 전송
        return res.status(200).json(formattedList);
        }
        catch (err) {
                // 예외 상황 방어 코드 추가
                console.error("🚨 건강 정보 목록 조회 중 백엔드 에러 발생:", err);
                return res.status(500).json({
                    success: false,
                    message: "건강 기록 목록을 불러오는 중 오류가 발생했습니다."
                });
        }
})

// 예측 페이지를 위한 조회 3R ( 완료 )
router.get("/predict/:physical_idx", async (req, res) => {
    try {
        const userIdx = getLoginUserIdx(req);

        if (!userIdx) {
            return res.status(401).json({
                success: false,
                message: "로그인이 필요합니다."
            });
        }

        const physicalIdx = req.params.physical_idx;

        const readPhysicalSQL = `
            SELECT *
            FROM tbl_physical
            WHERE physical_idx = ?
              AND user_idx = ?
        `;

        const [physicalResult] = await conn.query(readPhysicalSQL, [
            physicalIdx,
            userIdx
        ]);

        if (physicalResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "해당 검진 데이터를 찾을 수 없습니다."
            });
        }

        const readPredictSQL = `
            SELECT *
            FROM tbl_analysis
            WHERE physical_idx = ?
            ORDER BY weight_loss DESC
        `;

        const [predictResult] = await conn.query(readPredictSQL, [physicalIdx]);

        return res.status(200).json({
            success: true,
            physical: physicalResult[0],
            predictions: predictResult
        });

    } catch (err) {
        console.error("🚨 예측 데이터 조회 중 백엔드 에러 발생:", err);

        return res.status(500).json({
            success: false,
            message: "예측 리포트 데이터를 불러오는 중 오류가 발생했습니다."
        });
    }
});

// 건데 수정과 같이 예데 삭제 후 재예측
router.post("/update/:physical_idx", async (req, res) => {
    try {
        const userIdx = getLoginUserIdx(req);

        if (!userIdx) {
            return res.status(401).json({
                success: false,
                message: "로그인이 필요합니다."
            });
        }

        const physicalIdx = req.params.physical_idx;

        const {
            userHeight: inputHeight,
            userWeight: inputWeight,
            systolicBp: inputSbp,
            diastolicBp: inputDbp,
            bloodGlucose: inputBs,
            triglyceride: inputTg,
            cholesterol: inputHdl,
            waistLine: inputWaist,
            isSmoke: inputSmoke,
            isDrink: inputDrink,
            checkupDate: inputCheckup
        } = req.body;

        if (
            inputHeight === undefined ||
            inputWeight === undefined ||
            inputSbp === undefined ||
            inputDbp === undefined ||
            inputBs === undefined ||
            inputTg === undefined ||
            inputHdl === undefined ||
            inputWaist === undefined ||
            inputSmoke === undefined ||
            inputDrink === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "수정할 건강 데이터를 모두 입력해주세요."
            });
        }

        // 해당 검진 데이터가 현재 로그인 유저의 것인지 확인 + 유저 정보 가져오기
        const readPhysicalSQL = `
            SELECT 
                p.physical_idx,
                p.user_idx,
                p.checkup_date,
                u.birth_date,
                u.gender
            FROM tbl_physical p
            JOIN tbl_user u ON p.user_idx = u.user_idx
            WHERE p.physical_idx = ?
              AND p.user_idx = ?
        `;

        const [physicalRows] = await conn.query(readPhysicalSQL, [
            physicalIdx,
            userIdx
        ]);

        if (physicalRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "수정할 건강 데이터를 찾을 수 없습니다."
            });
        }

        const userBirthDate = physicalRows[0].birth_date;
        const userGender = physicalRows[0].gender;

        const tempbirth = userBirthDate instanceof Date
            ? userBirthDate.getFullYear()
            : Number(String(userBirthDate).substring(0, 4));

        const tempGender = userGender === "M" ? 1 : 2;

        const checkupDate = inputCheckup || physicalRows[0].checkup_date;

        const checkupYear = checkupDate instanceof Date
            ? checkupDate.getFullYear()
            : parseInt(String(checkupDate).substring(0, 4));

        const age = checkupYear - tempbirth;

        let ageCode = 10;

        if (age >= 25 && age <= 34) {
            ageCode = 7;
        } else if (age >= 35 && age <= 39) {
            ageCode = 8;
        } else if (age >= 40 && age <= 44) {
            ageCode = 9;
        } else if (age >= 45 && age <= 49) {
            ageCode = 10;
        } else if (age >= 50 && age <= 54) {
            ageCode = 11;
        } else if (age >= 55 && age <= 59) {
            ageCode = 12;
        } else if (age > 59) {
            ageCode = 13;
        } else {
            ageCode = 6;
        }

        const inputBMI = inputWeight / ((inputHeight / 100) * (inputHeight / 100));

        // 2테이블 건강 데이터 수정
        const updatePhysicalSQL = `
            UPDATE tbl_physical
            SET
                height = ?,
                weight = ?,
                sbp = ?,
                dbp = ?,
                bs = ?,
                tg = ?,
                hdl = ?,
                waist = ?,
                smoke = ?,
                drink = ?
            WHERE physical_idx = ?
              AND user_idx = ?
        `;

        const [updateResult] = await conn.query(updatePhysicalSQL, [
            inputHeight,
            inputWeight,
            inputSbp,
            inputDbp,
            inputBs,
            inputTg,
            inputHdl,
            inputWaist,
            inputSmoke,
            inputDrink,
            physicalIdx,
            userIdx
        ]);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "수정할 건강 데이터를 찾을 수 없습니다."
            });
        }

        // 기존 예측 데이터 삭제
        const update2DeleteSQL = `
            DELETE FROM tbl_analysis
            WHERE physical_idx = ?
        `;

        await conn.query(update2DeleteSQL, [physicalIdx]);

        // Python으로 보낼 데이터 생성
        const pyPayload = {
            height: Number(inputHeight),
            weight: Number(inputWeight),
            sbp: Number(inputSbp),
            dbp: Number(inputDbp),
            bs: Number(inputBs),
            tg: Number(inputTg),
            hdl: Number(inputHdl),
            waist: Number(inputWaist),
            smoke: Number(inputSmoke),
            drink: Number(inputDrink),
            age: Number(age),
            gender: Number(tempGender),
            age_code: Number(ageCode),
            bmi: Number(inputBMI)
        };

        console.log("수정 후 파이썬으로 보낼 데이터:", pyPayload);

        const pyRes = await axios.post(pythonFastAPI.predictAllUrl, pyPayload);
        const analysisData = pyRes.data;

        // 새 예측 데이터 저장
        for (const kgKey in analysisData.predictions) {
            const targetData = analysisData.predictions[kgKey];
            const lossKg = parseInt(kgKey);

            const predictHeight = inputHeight;
            const predictWeight = parseFloat((inputWeight - lossKg).toFixed(1));

            const predictWaist = targetData.waist.predicted;
            const predictSbp = targetData.sbp.predicted;
            const predictDbp = targetData.dbp.predicted;
            const predictBs = targetData.bs.predicted;
            const predictTg = targetData.tg.predicted;
            const predictHdl = targetData.hdl.predicted;

            const sqlCreatePredictData = `
                INSERT INTO tbl_analysis
                (physical_idx, height, weight, weight_loss, sbp, dbp, bs, tg, hdl, waist)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await conn.query(sqlCreatePredictData, [
                physicalIdx,
                predictHeight,
                predictWeight,
                lossKg,
                predictSbp,
                predictDbp,
                predictBs,
                predictTg,
                predictHdl,
                predictWaist
            ]);
        }

        return res.status(200).json({
            success: true,
            message: "건강 데이터 수정 및 예측 데이터 갱신이 완료되었습니다.",
            physical_idx: physicalIdx,
            predictions: analysisData
        });

    } catch (err) {
        console.error("🚨 수정 라우터 에러 발생:", err);

        if (err.isAxiosError && err.response) {
            console.log("❌ 파이선 오류코드:", JSON.stringify(err.response.data, null, 2));
        }

        return res.status(500).json({
            success: false,
            message: "서버 내부 오류가 발생했습니다."
        });
    }
});


// 건데 삭제 및 연관 예데 삭제 ( 완료 )
// =======================================================
// 건데 삭제 및 연관 예데 삭제
// CASCADE 적용 버전
// =======================================================
router.delete("/delete/:physical_idx", async (req, res) => {
    try {
        const userIdx = getLoginUserIdx(req);

        if (!userIdx) {
            return res.status(401).json({
                success: false,
                message: "로그인이 필요합니다."
            });
        }

        const physicalIdx = req.params.physical_idx;

        if (!physicalIdx) {
            return res.status(400).json({
                success: false,
                message: "삭제할 건강 기록 번호가 필요합니다."
            });
        }

        const deletePhysicalSQL = `
            DELETE FROM tbl_physical
            WHERE physical_idx = ?
              AND user_idx = ?
        `;

        const [deletePhysicalResult] = await conn.query(deletePhysicalSQL, [
            physicalIdx, userIdx    ]);

        console.log(deletePhysicalResult);

        if (deletePhysicalResult.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "삭제할 건강 기록을 찾을 수 없습니다."
            });
        }

        return res.status(200).json({
            success: true,
            message: "선택하신 건강 기록과 AI 예측 리포트가 삭제되었습니다.",
            deleted_idx: physicalIdx
        });

    } catch (err) {
        console.error("🚨 건강 기록 삭제 중 백엔드 에러 발생:", err);

        return res.status(500).json({
            success: false,
            message: "서버 내부 오류가 발생했습니다."
        });
    }
});



// Gemini 건강 조언 생성
router.get("/advice/:physical_idx", async (req, res) => {
    try {
        const physicalIdx = req.params.physical_idx;

        // tbl_physical + tbl_user JOIN
        const [physRows] = await conn.query(`
            SELECT p.*, u.gender, u.birth_date,
                   YEAR(NOW()) - YEAR(u.birth_date) AS age
            FROM tbl_physical p
            JOIN tbl_user u ON p.user_idx = u.user_idx
            WHERE p.physical_idx = ?
        `, [physicalIdx]);

        if (physRows.length === 0) {
            return res.status(404).json({ success: false, message: "데이터를 찾을 수 없습니다." });
        }
        const p = physRows[0];

        // tbl_analysis 에서 예측 데이터
        const [analysisRows] = await conn.query(
            "SELECT * FROM tbl_analysis WHERE physical_idx = ? ORDER BY weight_loss ASC",
            [physicalIdx]
        );

        // predictions 객체 빌드: { "1kg": { waist, sbp, dbp, bs, tg, hdl }, ... }
        const allPredictions = {};
        for (const row of analysisRows) {
            allPredictions[`${row.weight_loss}kg`] = {
                waist: row.waist,
                sbp:   row.sbp,
                dbp:   row.dbp,
                bs:    row.bs,
                tg:    row.tg,
                hdl:   row.hdl,
            };
        }
        
        const { getHealthAdvice } = await healthAdviceModulePromise;
        const ocrResult      = { age: p.age, weight: p.weight };
        const userInput      = { gender: p.gender === "M" ? 1 : 2, smoke: p.smoke, drink: p.drink };
        const currentMetrics = { waist: p.waist, sbp: p.sbp, dbp: p.dbp, bs: p.bs, tg: p.tg, hdl: p.hdl };

        const advice = await getHealthAdvice(ocrResult, userInput, currentMetrics, allPredictions);
        return res.status(200).json(advice);

    } catch (err) {
        console.error("🚨 건강 조언 생성 중 에러:", err.message);
        return res.status(500).json({ success: false, message: "건강 조언 생성 중 오류가 발생했습니다." });
    }
});



module.exports = router;
/*
건강기본주소(미사용) 
../api/health

	조회주소
	../api/  health/list

	상세예측주소
	../api/  health/predict/ : ( physical_idx )

	생성주소
	../api/ health/create

	수정주소
	../api/ health/update/ : ( physical_idx )

	삭제주소
	../api/ health/delete/ : ( physical_idx )
    */
