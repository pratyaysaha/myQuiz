const mongoose=require('mongoose')
const validator=require('validator')
const QuizDetails= mongoose.Schema({
    // userId:{
    //     type: String,
    //     required : true,
    //     unique: true
    // },
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
    stime : {
        type : Date,
        required : true
    },
    etime : {
        type : Date,
        required : true
    }
})
module.exports=mongoose.model('Quiz',QuizDetails)