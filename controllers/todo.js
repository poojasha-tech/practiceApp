const express = require('express');
const prisma = require('../prisma/db')
const router = express.Router()
router.get('/test', (req, res) => res.send("returned from inside the todo router"))
router.get('/', async (req, res) => {
    const user = req.user;

    /*var data=[
        {title:'bring Milk',marked:true},
        {title:'Homework finished',marked:false}
    ]
    res.send(data)*/

    const todos = await prisma.todo.findMany({ where: { username: user.username } })
    console.log(todos)
    res.send(todos)

})

router.post('/', async (req, res) => {
    try {
        const user = req.user

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


router.delete('/:todoId', async (req, res) => {
    try {
        const user = req.user

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

router.put('/mark/:id', async (req, res) => {
    try {
        
        const user = req.user
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