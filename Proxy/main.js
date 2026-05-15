


const express = require("express")

const app = express()

app.use(express.urlencoded({extended: true}));
app.use( express.json() );

const userRouter = require("./routes/user")


app.use("/user", userRouter);



app.listen(3000, ()=>{
    console.log("3000 포트에서 서버 사용중")
})














