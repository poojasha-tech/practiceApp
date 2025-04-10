const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

const prisma = require("./prisma/db")


const crypto = require("crypto");
const secret = "mysecret";


const jwt = require("jsonwebtoken");


app.use(express.json())

app.get("/helloworld", (req, res) => {
    return res.send("hello world!")
})

const authRouter = require('./controllers/auth')
app.use(authRouter)
const todoRouter = require('./controllers/todo')
app.use(todoRouter)
app.get('/page', (req, res) => {
    res.send("<h1>hye there from page</h1>")
})

app.listen(port, () => {
    console.log(`app listening on port ${port}!`)
})
