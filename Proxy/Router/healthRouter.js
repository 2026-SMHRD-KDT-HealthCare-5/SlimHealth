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
const pythonFastAPI = require("../config/pythonFastAPI");
const mockupUserIdx = "1"
// 세션대신 넣은 하드코딩 유저번호




// 건데 생성과 예데 생성(완료) 23C
router.post("/create", async (req, res) =>{
        // [2] - 1) 2테이블 생성
        //    ㄴ 생성 즉시 파이선에 예측결과 질의/응답
        //        ㄴ 예측결과 3테이블에 저장
        //            ㄴ 저장후 리액트에 전송(응답)
    try{




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
            mockupUserIdx, inputHeight, inputWeight, inputSbp, inputDbp, 
            inputBs, inputTg, inputHdl, inputWaist, inputSmoke, inputDrink,
            inputCheckup   ] ) // 2tb 인서트



        // 파이선 비동기ddd

            // 파이선을 위해 나이계산 : 검진년월일 - 생년 = 나이age
            // Todo : 임시유저 생년 = tempbirth
        const tempbirth = 1980
        const age = parseInt(String(inputCheckup).substring(0, 4)) - tempbirth;


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


        const tempGender = 1; // 1: 남성 / 2: 여성

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


        const mockupUseridx = req.headers['x-user-id'];
        if (!userIdx) return res.status(401).json({ success: false, message: "로그인이 필요합니다." });

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
        const [readListResult] = await conn.query(readListSQL, [mockupUseridx]);

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
router.get("/predict/:physical_idx", async (req, res) =>{
    // 우리 예측 페이지... 를 위한 예측데이터 보내기
    try{
        const physicalIdx = req.params.physical_idx;
        // 요청에서 파라미터 추출


        // phy_idx를 3테이블에 질의하여 모든 예측데이터를 가져오기
            // 질의문 : SELECT * FROM tbl_analysis WHERE physical_idx = ?
            // ? 는 파라미터 가져오기 physical_idx
        const readPredictSQL = 'SELECT * FROM  tbl_analysis  WHERE physical_idx = ?';
        const [ predictResult ] = await conn.query( readPredictSQL ,   [ physicalIdx ] );

         // 비동기로 받은 질의결과를 JSON화 하여 송신
        return res.status(200).json(predictResult);
    }
    catch (err) { 
        console.error("🚨 예측 데이터 조회 중 백엔드 에러 발생:", err);
        return res.status(500).json({ 
            success: false, 
            message: "예측 리포트 데이터를 불러오는 중 오류가 발생했습니다." 
        });
    }
})

// 건데 수정과 같이 예데 삭제 후 재예측 ( 완료 )
router.get("/update/:physical_idx", async (req, res) =>{

    try{
        const physicalIdx = req.params.physical_idx;

        // 1. 유저가 건강데이터를 수정함(수정하고 수정요청REQ을 보냄)
        // 2. 내가 받아서 변수 쪼개고 쿼리문에 넣음
        const { userHeight: inputHeight,
                userWeight: inputWeight,
                systolicBp: inputSbp,
                diastolicBp: inputDbp,
                bloodGlucose: inputBs,
                triglyceride: inputTg,
                cholesterol: inputHdl, 
                waistLine: inputWaist,
                isSmoke: inputSmoke,
                isDrink: inputDrink } = req.body;
        
        // 💡 누락되었던 수정 시 BMI 재계산 로직 추가
        const inputBMI = inputWeight / ((inputHeight / 100) * (inputHeight / 100));
        
        const updatePhysicalSQL  = `UPDATE tbl_physical SET 
            height=?, 
            weight=?, 
            bmi   =?, 
            sbp   =?, 
            dbp   =?, 
            bs    =?, 
            tg    =?, 
            hdl   =?, 
            waist =?, 
            smoke =?, 
            drink =? WHERE physical_idx = ?`; // 11개

        // 3. 쿼리문을 DB에 질의 응답 받음
            const [ updateResult ]   = await conn.query( updatePhysicalSQL, [
                inputHeight, inputWeight, inputBMI, inputSbp,
                inputDbp, inputBs, inputTg, inputHdl, inputWaist, // ◀ 여기 inputWaist를 소문자 i로 수정
                inputSmoke, inputDrink,  physicalIdx ]  ) ; // 행조건을 걸 파라미터(physicalIdx)
    
        // 4. 여기서 파생되었던 예측데이터 삭제
            // 딜리트 쿼리문 생성 -> 실행
        const update2DeleteSQL    =  'DELETE FROM tbl_analysis WHERE physical_idx = ? ' 
        const [update2DeleteResult] =  await conn.query( update2DeleteSQL , [   physicalIdx   ] )

        // 5. 파이선에 질의하여 새 데이터 생성
            // 파이선 비동기
        const pyRes = await axios.post(pythonFastAPI.predictAllUrl, req.body) 
            // 파이선에 받은의료정보(req.body)를 ~주소로 보냅니다.
        const analysisData = pyRes.data // 받은값을 변수에 저장


        // 6. 받은 새 데이터를 3tb에 입력
        for (const kgKey in analysisData.predictions) {
            const targetData = analysisData.predictions[kgKey]; 

            const predictHeight = analysisData.user.height;
            const predictWeight = targetData.target_weight;     // 현재 체중이 아닌 예측체중
            const predictBMI    = analysisData.meta.current_bmi;
            const predictSmoke  = analysisData.user.smoke;
            const predictDrink  = analysisData.user.drink;

            const predictwaist = targetData.waist;
            const predictSbp   = targetData.sbp;
            const predictDbp   = targetData.dbp;
            const predictBs    = targetData.bs;
            const predictTg    = targetData.tg;
            const predictHdl   = targetData.hdl;


            const sql_create_predictdata = `
                INSERT INTO tbl_analysis ( physical_idx, height, weight, bmi, sbp, dbp, bs, tg, hdl, waist, smoke, drink  ) 
                    VALUES ( ?, ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?, ?  ) `;

            await conn.query(sql_create_predictdata, [ physicalIdx,
                predictHeight, 
                predictWeight, 
                predictBMI, 
                predictSbp, 
                predictDbp,
                predictBs,
                predictTg, 
                predictHdl, 
                predictwaist, 
                predictSmoke, 
                predictDrink
            ]);
        } 









        // 7. 응답문을 JSON화 하여 유저에게 응답함
         // 비동기로 받은 질의결과를 JSON화 하여 송신
        return res.status(200).json({
            success: true,
            message: "건강 데이터 수정 및 예측 데이터 갱신이 완료되었습니다.",
            physical_idx: physicalIdx
        });
    }
    catch(err){ 
        console.error("🚨 수정 라우터 에러 발생:", err);
        return res.status(500).json({
            success: false, 
            message: "서버 내부 오류가 발생했습니다."
         });
    }
})


// 건데 삭제 및 연관 예데 삭제 ( 완료 )
router.get("/delete/:physical_idx", async (req, res) =>{
    try{
        const physicalIdx = req.params.physical_idx;


        // 1 건강데이터 삭제
            const deletePhysicalSQL =  ` DELETE FROM tbl_physical WHERE physical_idx = ?    `
            const [deletePhysicalResult] = await conn.query(  deletePhysicalSQL , [physicalIdx])
        // 2 건강데이터에 연관된 에측데이터 삭제
            const deleteAnalysisSQL =  ` DELETE FROM tbl_analysis WHERE physical_idx = ?    `
            const [deleteAnalysisResult] = await conn.query(  deleteAnalysisSQL , [physicalIdx])

        // 3. 🎯 [추가] 삭제 완료 후 리액트 유저에게 정상 대답 송신
        return res.status(200).json({
            success: true,
            message: "선택하신 건강 기록과 AI 예측 리포트가 안전하게 삭제되었습니다.",
            deleted_idx: physicalIdx
        });

    } catch(err){
        console.error("🚨 수정 라우터 에러 발생:", err);
        return res.status(500).json({
            success: false, 
            message: "서버 내부 오류가 발생했습니다."
         });
    }
})




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
