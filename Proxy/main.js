


const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const healthRouter = require("./Router/healthRouter");
const userRouter = require("./Router/userRouter");
const ocrRouter = require("./Router/ocrRouter");

app.use("/api/health", healthRouter);
app.use("/api/user", userRouter);
app.use("/api/ocr", ocrRouter);

app.listen(8000, () => {
    console.log("node 중계서버, 8000 포트에서 사용중");
});
