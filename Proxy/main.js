


const express = require("express")
const app = express()

app.use(express.urlencoded({extended: true}));
app.use( express.json() );


const healthRouter = require("./Router/healthRouter")
const userRouter   = require("./Router/userRouter")


app.use("/api/health",  healthRouter);
app.use("/api/user", userRouter);



app.listen(8000, ()=>{
    console.log("8000 포트에서 서버 사용중")
})