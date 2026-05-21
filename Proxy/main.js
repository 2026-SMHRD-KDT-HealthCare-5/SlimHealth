


const express = require("express")
const app = express()

const cors = require("cors");

app.use(cors({
    origin: "http://localhost:5173", // 💡 리액트(Axios)가 출발하는 주소를 정확히 명시!
    credentials: true                
}));


app.use(express.urlencoded({extended: true}));
app.use( express.json() );


const healthRouter = require("./Router/healthRouter")
const userRouter   = require("./Router/userRouter")


app.use("/api/health",  healthRouter);
app.use("/api/user", userRouter);



app.listen(8000, ()=>{
    console.log("node 중계서버, 8000 포트에서 사용중")
})
