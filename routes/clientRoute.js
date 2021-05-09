const express=require('express')
const QuizDetails= require('../models/quizdetails')
const Questions=require('../models/questions')
const router= express.Router()



router.get('/:quizid',async (req,res)=>{
    try{
        const quizDetails=await QuizDetails.findById(req.params.quizid)
        const questions=await Questions.find({quizId: req.params.quizid},{answer : 0})
        sendQuestion=[]
        questions.map((item)=>{
            var data={}
            data._id=item._id
            data.ques=item.ques
            data.options=item.options
            sendQuestion.push(data); 
        })
        res.render("quizpage",{data : {quizDetails, questions: sendQuestion}})
    }
    catch(err)
    {
        console.log("err");
    }
})
router.get('/:quizname',async(req, res)=>{

})

module.exports=router