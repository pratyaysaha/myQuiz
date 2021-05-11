const express=require('express')
const QuizDetails= require('../models/quizdetails')
const Questions=require('../models/questions')
const nodemailer = require('nodemailer')
const Submit = require('../models/submission');
const fetch = require('node-fetch');
require('dotenv/config')
const router= express.Router()

var transport = nodemailer.createTransport({
    host : 'smtp.yandex.com',
    port: 465,
    secure : true,
    auth: {
       user: `${process.env.EMAIL}`,
       pass: `${process.env.EMAIL_PASS}`
    }
})

router.get('/:quizid',async (req,res)=>{
    try{
        const quizDetails=await QuizDetails.findById(req.params.quizid)
        const questions=await Questions.find({quizId: req.params.quizid},{answer : 0})
        console.log(quizDetails)
      
        sendQuestion=[]
        questions.map((item)=>{
            var data={}
            data._id=item._id
            data.ques=item.ques
            data.options=item.options
            sendQuestion.push(data); 
        })
        
        
        if(Date.now()>=quizDetails.stime&&Date.now()<=quizDetails.etime){
           
        res.render("quizpage",{data : {quizDetails, questions: sendQuestion}})
    }
  
    else{
        res.send("Quiz not available")
    }
}
    catch(err)
    {
        console.log("err");
    }
})
router.get('/:quizname',async(req, res)=>{
    //quizname route to be added
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


    
    const message = {
        from: `${process.env.EMAIL}`, 
        to: submits[0].Email,         
        subject: 'Submission Succesfull', 
        text: `Total Score: ${submits[0].totalMarks}`
    }

    transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    })
}
catch(err){
    console.log(err)
}

})


module.exports=router