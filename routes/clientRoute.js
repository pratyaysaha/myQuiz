const express=require('express')
const QuizDetails= require('../models/quizdetails')
const Questions=require('../models/questions')
const nodemailer = require('nodemailer')
const Submit = require('../models/submission');
const fetch = require('node-fetch');
require('dotenv/config')
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



router.get('/:submissionId/success' ,async(req, res)=>{
    res.render('success')
    try{
       
        
       await fetch(`http://localhost:3000/api/evaluate/submission/${req.params.submissionId}`)
            
        .then(res => res.json())
        .then(json => console.log(json))
    
        const submits = await Submit.find({ _id: req.params.submissionId })
        console.log(submits)
        console.log(submits[0].Email)


    var transport = nodemailer.createTransport({
        host : 'smtp.gmail.com',
        port: 465,
        secure : true,
        auth: {
           user: 'startechchannel@gmail.com',
           pass: `${process.env.EMAIL_PASS}`
        }
    });
    const message = {
        from: 'startechchannel@gmail.com', 
        to: submits[0].Email,         
        subject: 'Submission Succesfull', 
        text: `Total Score: ${submits[0].totalMarks}`
    };
    transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });
}
catch(err){
    console.log(err)
}

})


module.exports=router