const mongoose=require('mongoose')
const validator=require('validator')
const QuizDetails= mongoose.Schema({
    name:{
        type :String,
        required: true,
        unique: true
    },
    author :{
        type: String,
        required: true
    },
    authorEmail : {
        type: String,
        required:true,
        validate :{
            validator : (value) =>{
                return validator.isEmail(value)
            },
            message : "Provide a valid email"
        }
    },
    dot : {
        type: Date,
        required: true,
    },
    attempts:{
        type: Number,
        required: true
    }
})
module.exports=mongoose.model('Quiz',QuizDetails)