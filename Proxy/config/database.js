// DB와 연결되어진 통로정보를 가지고있는 파일입니다.

// mysql 설치 : npm install mysql2


// 01. mysql2 모듈 가져오기
const mysql = require("mysql2");



// 02. 사용할 DB의 정보를 정의
const db_info = {  
    host : "project-db-campus.smhrd.com",
    user : "cd_25K_HI5_p2_4",
    password : "smhrd4",
    port : "3312",
    database : "cd_25K_HI5_p2_4",
    dateStrings: true,
}

// 03. DB 연결할수있는 객체 생성

module.exports = mysql.createConnection( db_info ).promise();


// 김재부
// URL : project-db-campus.smhrd.com
// PORT : 3312
// USER : cd_25K_HI5_p2_4
// PW : smhrd4
// DataBase : cd_25K_HI5_p2_4