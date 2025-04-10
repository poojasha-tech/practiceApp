const express = require('express');
const { verifyJwt } = require('../utils');
const router = express.Router()
router.get('/to-do/test', (req, res) => res.send("returned from inside the todo router"))
router.get('/to-do', async (req, res) => {
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

router.post('/to-do', async (req, res) => {
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


router.delete('/to-do/:todoId', async (req, res) => {
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

router.put('/to-do/mark/:id', async (req, res) => {
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
module.exports = router