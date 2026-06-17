const express = require("express");
const jwt = require('jsonwebtoken')
const {authMiddleware} = require('./middleware')
const app = express()
app.use(express.json())


let USERS = [];
let TODOS = [];
let TODO_USER_ID=1;
let TODO_TODO_ID=1;

app.post("/signup",(req,res)=>{
    const userName = req.body.userName
    const password = req.body.password

    const userExist = USERS.find(u=>u.userName===userName)

    if(userExist){
        res.status(411).json({
            message:"User with this userName already exist"
        })
        return;
    }
    
    USERS.push({
        id: TODO_USER_ID++,
        userName:userName,
        password:password
    })
    res.status(200).json({
        message: "User created successfully"
    })
})

app.post('/signin',(req,res)=>{
       const userName = req.body.userName;
       const password = req.body.password;

       const userExist = USERS.find(u=>u.userName===userName && u.password===password)

       if(!userExist){
        res.status(411).json({
            message:"Either user name or password is incorrect."
        })
        return;
       }

       const token = jwt.sign({
        userId: userExist.id
       },'secret1234567')

       res.status(200).json({
        token
       })
})

app.post('/todo',authMiddleware,(req,res)=>{
       const title = req.body.title;
       const description= req.body.description;
       const userId = req.userId

       if(userId){
       TODOS.push({
        id: TODO_TODO_ID++,
        title,
        description,
        userId
       })
       res.status(200).json({
        message:"Todo has been created"
       })
       }

})

app.get("/todos",authMiddleware,(req,res)=>{
       const userId = req.userId

       const todos = TODOS.filter(u =>u.userId === userId)

       if(userId){
       res.status(200).json({
        todo:todos
       })
       }


})

app.delete("/delete_todo",(req,res)=>{
    const todoId= parseInt(req.params.todoId)
    const userId = req.userId

    const doesUserownTodo = TODOS.find(t=> t.userId===userid && t.id === userId)

    if(doesUserownTodo){
        TODOS= TODOS.filter(t=> t.id === todoid)
        res.status(200).json({
            message:"Todo deleted successfully"
        })
    }else{
        res.status(411).json({
            message:"Either todo does not exist or this is not your todo"
        })
    }

})











app.listen(3000)