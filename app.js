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



app.post("/signup", async (req, res) => {
    try {
        const userdata = req.body
        const dataInDb = await prisma.user.findFirst({ where: { username: userdata.username } })
        if (dataInDb) {
            return res.status(409).send({ err: "username exists" })
        }
        else {

            const newUser = await prisma.user.create({
                data: {
                    username: userdata.username,
                    password: hashPass(userdata.password)

                }


            })

            newUser.password == null;
            const token = getjwt(newUser)
            console.log(token)
            return res.status(201).send({ token: token });




        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send();

    }



})


app.post("/signin",async(req,res)=>{
    const user=req.body
    const userInDb=await prisma.user.findFirst({where:{username:user.username}})
    if(userInDb){
        if (userInDb.password==hashPass(user.password)){
            delete userInDb.password;
            token=getjwt(userInDb)
            return res.send({token:token})
            //return res.status(201).send("signed in")
        }


    }
    return res.status(401).send("username or password not found")
})



app.get('/to-do', (req, res) => {
    var data = [
        {title: 'Bring Milk', marked: true},
        {title: 'Homework finished', marked: false}
    ]
    res.send(data)
})

app.get('/page', (req, res) => {
    res.send("<h1>hye there from page</h1>")
})

app.listen(port, () => {
    console.log(`app listening on port ${port}!`)
})


function hashPass(password) {
    const hash = crypto.createHmac('md5', secret) // Using HMAC with MD5 and a secret key
        .update(password) // Update with the data to hash
        .digest('hex'); // Output in hexadecimal format
    return hash;
}


function getjwt(user) {
    var token = jwt.sign({

        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        data: user
    }, secret);
    return token;
}