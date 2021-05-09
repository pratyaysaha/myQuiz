const mongoose=require('mongoose')
const validator=require('validator')
const Question=mongoose.Schema({
    quizId:{
        type: String,
        required: true
    },
    ques:{
        type: String,
        required : true
    },
    options:{
        type: [String],
        required: true,
    },
    answer:{
        type: String,
        required: true,
    },
    marks:{
        type: Number,
        required: true
    },
    isNegative:{
        type: Boolean,
        required: true
    },
    negative:{
        type: Number,
        required: true,
        default: 0
    }

})
module.exports=mongoose.model('Question',Question)
