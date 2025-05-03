const express = require("express");
const verifyUserToken=require("./utilitis/middleware/verifyUserToken")
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

// const prisma = require("./prisma/db")


// const crypto = require("crypto");
// const secret = "mysecret";


// const jwt = require("jsonwebtoken");


app.use(express.json())

app.get("/helloworld", (req, res) => {
    return res.send("hello world!")
})

//const authRouter=require('./controllers/auth');
// below code works as PIPELINE

app.use(require('./controllers/auth'));

app.use(verifyUserToken)

//const todoRouter=require('./controllers/todo');
app.use('/todo',require('./controllers/todo'));



app.get('/page', (req, res) => {
    res.send("<h1>hye there from page</h1>")
})

app.listen(port, () => {
    console.log(`app listening on port ${port}!`)
})

