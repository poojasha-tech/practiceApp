const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());
const verifyUserToken = require("./middleware/verifyUserToken");


app.use(express.json())

app.get("/helloworld", (req, res) => {
    return res.send("hello world!")
})
app.get('/helloworld', (req, res) => {
    res.send("<h1>hye there from page</h1>")
})
// this is pipeline
app.use(require('./controllers/auth'))
//    |
//    |
app.use(verifyUserToken)
//    |
//    |
app.use('/to-do', require('./controllers/todo'))



app.listen(port, () => {
    console.log(`app listening on port ${port}!`)
})
