const mongoose = require("mongoose")
mongoose.connect("")
//mongoose Schema and model object

const UserSchema =new mongoose.Schema({
    userName:String,
    password:String
})

const TodoSchema = new mongoose.Schema({
    title: String,
    description:String,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    }
})

const userModel = mongoose.model("users", UserSchema);
const todoModel = mongoose.model("todos", TodoSchema);


module.exports ={
    userModel: userModel,
    todoModel:todoModel
}