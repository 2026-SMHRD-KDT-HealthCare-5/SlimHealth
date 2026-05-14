-- 테이블 순서는 관계를 고려하여 한 번에 실행해도 에러가 발생하지 않게 정렬되었습니다.

-- tbl_user Table Create SQL
-- 테이블 생성 SQL - tbl_user
CREATE TABLE tbl_user
(
    `user_idx`       INT             NOT NULL    AUTO_INCREMENT COMMENT '유저번호. 사용자 식별자', 
    `id`             VARCHAR(30)     NOT NULL    COMMENT '아이디. 아이디', 
    `password_hash`  VARCHAR(255)    NOT NULL    COMMENT '비밀번호. 비밀번호', 
    `name`           VARCHAR(10)     NOT NULL    COMMENT '이름. 회원이름', 
    `email`          VARCHAR(50)     NOT NULL    COMMENT '이메일. 이메일', 
    `phone`          VARCHAR(20)     NOT NULL    COMMENT '핸드폰. 연락처', 
    `role`           VARCHAR(10)     NOT NULL    COMMENT '역할. 회원 구분', 
    `joined_at`      DATETIME(3)     NOT NULL    DEFAULT NOW(3) COMMENT '가입일자. 가입 일자', 
     PRIMARY KEY (user_idx)
);

-- 테이블 Comment 설정 SQL - tbl_user
ALTER TABLE tbl_user COMMENT '사용자 정보';

-- Index 설정 SQL - tbl_user(joined_at)
CREATE INDEX IX_tbl_user_1
    ON tbl_user(joined_at);

-- Unique Index 설정 SQL - tbl_user(email, phone)
CREATE UNIQUE INDEX UQ_tbl_user_1
    ON tbl_user(email, phone);

-- Unique Index 설정 SQL - tbl_user(id)
CREATE UNIQUE INDEX UQ_tbl_user_2
    ON tbl_user(id);


-- tbl_physical Table Create SQL
-- 테이블 생성 SQL - tbl_physical
CREATE TABLE tbl_physical
(
    `physical_idx`  INT             NOT NULL    AUTO_INCREMENT COMMENT '헬스데이터. 데이터 식별자', 
    `user_idx`      INT             NOT NULL    COMMENT '유저번호. 사용자 식별자', 
    `height`        DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '키. 신장', 
    `weight`        DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '몸무게. 체중', 
    `bmi`           DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT 'BMI. 체질량지수', 
    `sbp`           DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '혈압(수축). 혈압(수축)', 
    `dbp`           DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '혈압(이완). 혈압(이완)', 
    `bs`            DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '혈당. 공복혈당', 
    `tg`            DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '중성지방. 중성지방', 
    `hdl`           DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '콜레스테롤. 콜레스테롤', 
    `waist`         DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '허리둘레. 허리둘레', 
    `SMOKE`         INT             NOT NULL    DEFAULT 0 COMMENT '흡연여부', 
    `DRINK`         INT             NOT NULL    DEFAULT 0 COMMENT '음주여부', 
    `created_at`    DATETIME        NOT NULL    COMMENT '생성일자. 데이터업로드일자', 
     PRIMARY KEY (physical_idx)
);

-- 테이블 Comment 설정 SQL - tbl_physical
ALTER TABLE tbl_physical COMMENT '사용자 헬스케어 데이터';

-- Foreign Key 설정 SQL - tbl_physical(user_idx) -> tbl_user(user_idx)
ALTER TABLE tbl_physical
    ADD CONSTRAINT FK_tbl_physical_user_idx_tbl_user_user_idx FOREIGN KEY (user_idx)
        REFERENCES tbl_user (user_idx) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Foreign Key 삭제 SQL - tbl_physical(user_idx)
-- ALTER TABLE tbl_physical
-- DROP FOREIGN KEY FK_tbl_physical_user_idx_tbl_user_user_idx;


-- tbl_analysis Table Create SQL
-- 테이블 생성 SQL - tbl_analysis
CREATE TABLE tbl_analysis
(
    `analysis_idx`  INT             NOT NULL    AUTO_INCREMENT COMMENT '분석 인덱스. 분석 식별자', 
    `physical_idx`  INT             NOT NULL    COMMENT '헬스데이터. 데이터 식별자', 
    `model_name`    VARCHAR(100)    NOT NULL    COMMENT '모델명. 분석 모델명', 
    `height`        DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '키. 신장', 
    `weight`        DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '몸무게. 체중', 
    `bmi`           DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT 'BMI. 체질량', 
    `sbp`           DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '혈압(수축). 수축시혈압', 
    `dbp`           DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '혈압(이완). 이완시혈압', 
    `bs`            DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '혈당. 공복혈당', 
    `tg`            DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '중성지방. 중성지방', 
    `hdl`           DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '콜레스테롤. 콜레스테롤', 
    `waist`         DECIMAL(4,1)    NOT NULL    DEFAULT 0.0 COMMENT '허리둘레. 허리둘레', 
    `SMOKE`         INT             NOT NULL    DEFAULT 0.0 COMMENT '흡연여부. 흡연=1', 
    `DRINK`         INT             NOT NULL    DEFAULT 0.0 COMMENT '음주여부. 음주=1', 
    `analyzed_at`   DATETIME        NOT NULL    COMMENT '분석일자. 분석시행일자', 
     PRIMARY KEY (analysis_idx)
);

-- 테이블 Comment 설정 SQL - tbl_analysis
ALTER TABLE tbl_analysis COMMENT 'ML/DL분석';

-- Foreign Key 설정 SQL - tbl_analysis(physical_idx) -> tbl_physical(physical_idx)
ALTER TABLE tbl_analysis
    ADD CONSTRAINT FK_tbl_analysis_physical_idx_tbl_physical_physical_idx FOREIGN KEY (physical_idx)
        REFERENCES tbl_physical (physical_idx) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Foreign Key 삭제 SQL - tbl_analysis(physical_idx)
-- ALTER TABLE tbl_analysis
-- DROP FOREIGN KEY FK_tbl_analysis_physical_idx_tbl_physical_physical_idx;


