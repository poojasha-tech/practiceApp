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


app.post("/signin", async (req, res) => {
    const user = req.body
    const userInDb = await prisma.user.findFirst({ where: { username: user.username } })
    if (userInDb) {
        if (userInDb.password == hashPass(user.password)) {
            delete userInDb.password;
            token = getjwt(userInDb)
            return res.send({ token: token })
            //return res.status(201).send("signed in")
        }
    }
    return res.status(401).send("username or password not found")
})



app.get('/to-do', async (req, res) => {
    //res.send("welcome to to-do page")
    const token = req.headers.authorization?.replace("Bearer ", "");
    const user = verifyJwt(token);
    if (!user)
        return res.status(401).send("unauthorised!");

    console.log(user)

    /*var data=[
        {title:'bring Milk',marked:true},
        {title:'Homework finished',marked:false}
    ]
    res.send(data)*/

    const todos = await prisma.todo.findMany({ where: { username: user.username } })
    console.log(todos)
    res.send(todos)

})

app.post('/to-do', async (req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const user = verifyJwt(token);

        if (!user)
            return res.status(401).send("unauthorised!")

        const todoFromFrontend = req.body;
        if (!todoFromFrontend.title)
            return res.status(400).send("title not present");

        await prisma.todo.create({
            data: {
                username: user.username,
                title: todoFromFrontend.title,
                marked: false
            }
        })

        return res.status(201).send(todoFromFrontend.title)
    }
    catch (error) {
        console.error("couldnot save todo item", error)
        return res.status(500).send("could not save todo item")

    }
})


app.delete('/to-do/:todoId', async (req, res) => {
    try {

        const token = req.headers.authorization.replace("Bearer ", "");
        const user = verifyJwt(token);
        if (!user)
            return res.status(401).send("unauthorised!")

        const id = req.params.todoId;
        const deletedItem = await prisma.todo.delete({
            where: {
                id: Number(id),
                username: user.username
            }
        });
        return res.status(200).send("item deleted");

    } catch (error) {
        console.error(error);
        return res.status(500).send();
    }

})

app.put('/to-do/mark/:id', async (req, res) => {
    try {

        const token = req.headers.authorization.replace("Bearer ", "");
        const user = verifyJwt(token);
        if (!user)
            return res.status(401).send("unauthorised!")
        const id = req.params.id;
        const markTodo = await prisma.todo.findUnique({
            where: {
                id: Number(id),
                username: user.username
            }
        });

        const updatedItem = await prisma.todo.update({
            where: {
                id: Number(id),
                username: user.username
            },

            data: {
                marked: markTodo.marked?false:true

            }
        });
        return res.status(201).send("todo is " + updatedItem.marked);

    }
    catch (error) {
        console.error(error);
        return res.status(500).send("internal error!");

    }




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

function verifyJwt(token) {
    try {
        var decoded = jwt.verify(token, secret);
        return decoded.data;
    } catch(err) {
        return null
    }
}

function getjwt(user) {
    var token = jwt.sign({

        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        data: user
    }, secret);
    return token;
}

function verifyJwt(token) {
    try {
        var decoded = jwt.verify(token, secret);
        return decoded.data;

    } catch (error) {
        return null
    }
}
