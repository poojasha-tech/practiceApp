const express=require("express");
const prisma=require('../prisma/db');
const {hashPass,getjwt}=require('../utilitis/utilitis')
const router=express.Router();


router.post("/signup", async (req, res) => {
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


router.post("/signin", async (req, res) => {
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

module.exports=router;
