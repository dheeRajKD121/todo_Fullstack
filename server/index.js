const express = require("express");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const {authMiddleware} = require('./middleware')
const {todoModel,userModel} = require('./models')
const app = express()
app.use(express.json())


let USERS = [];
let TODOS = [];
let TODO_USER_ID=1;
let TODO_TODO_ID=1;

app.post("/signup",async(req,res)=>{
    const userName = req.body.userName
    const password = req.body.password

    const userExist = await userModel.findOne({
        userName:userName
    })

    if(userExist){
        res.status(411).json({
            message:"User with this userName already exist"
        })
        return;
    }
    const newUser = await userModel.create({
        userName:userName,
        password:password
    })
    res.status(200).json({
        message: "User created successfully",
        id:newUser._id
    })
})

app.post('/signin', async(req,res)=>{
       const userName = req.body.userName;
       const password = req.body.password;

       const userExist = await userModel.findOne({
        userName:userName,
        password:password
       })

       if(!userExist){
        res.status(411).json({
            message:"Either user name or password is incorrect."
        })
        return;
       }

       const token = jwt.sign({
        userId: userExist._id.toString()
       },'secret1234567')

       res.status(200).json({
        token
       })
})

app.post('/todo',authMiddleware, async(req,res)=>{
       const title = req.body.title;
       const description= req.body.description;
       const userId = req.userId


       const newTodo = await todoModel.create({
        title,
        description,
        userId
       })
       res.status(200).json({
        message:"Todo has been created"
       })

})

app.get("/todos",authMiddleware, async (req,res)=>{
    try {
        const userId = req.userId;

        const todos = await todoModel.find({ userId });

        res.status(200).json({
            todos
        })
    } catch (err) {
        res.status(500).json({ message: "Error fetching todos" })
    }
})

app.delete("/delete_todo/:todoId",authMiddleware,async(req,res)=>{

    try{
        const todoId= req.params.todoId
        const userId = req.userId

        const existTodo = await todoModel.findById({_id:todoId})
        console.log(existTodo,"111111")
        const existTodo2 = await todoModel.findById(todoId)
        console.log(existTodo2,"333333333")
        
        if(!existTodo){
           return res.status(411).json({
                message:"Todo does not exist"
            })
        }

        if(existTodo && existTodo.userId.toString() !== userId){
            return res.status(411).json({
                message:"This is not your Todo"
            })
        }

        // ✅ Delete using deleteOne() or findByIdAndDelete()

        await todoModel.deleteOne({_id:todoId})
        return res.status(200).json({
            message:"Todo deleted successfully."
        })
    }catch(err){
        console.error(err)
       return res.status(500).json({
            message:"Error deleting Todo"
        })
    }
})

// Add this temporary route to clear DB
app.get("/clear-db", async (req, res) => {
    await userModel.deleteMany({});
    await todoModel.deleteMany({});
    res.json({ message: "Database cleared" })
})
app.listen(3000)