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
       user: process.env.EMAIL,
       pass: process.env.EMAIL_PASS
    }
});

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



router.get('/name/:quizname',async(req, res)=>{
  console.log(req.params.quizname)
  try{
    const quizDetails=await QuizDetails.find({name:req.params.quizname})
    const questions=await Questions.find({quizId: quizDetails[0]._id},{answer : 0})
    console.log(quizDetails[0]._id)
    console.log(questions)
  
    sendQuestion=[]
    questions.map((item)=>{
        var data={}
        data._id=item._id
        data.ques=item.ques
        data.options=item.options
        sendQuestion.push(data); 
    })
    

    if(Date.now()>=quizDetails[0].stime&&Date.now()<=quizDetails[0].etime){
       
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



router.get('/:submissionId/success' ,async(req, res)=>{
    res.render('success')
    try{
       
        
       await fetch(`http://localhost:3000/api/evaluate/submission/${req.params.submissionId}`)
            
        .then(res => res.json())
        .then(json => console.log(json))
    
        const submits = await Submit.find({ _id: req.params.submissionId })
        console.log(submits)
        console.log(submits[0].Email)
        var add = 0
        const quizName = await QuizDetails.findOne({_id:submits[0].quizId})
        console.log(quizName.name)
        for(let i=0;i<submits[0].Answers.length;i++){
            const marking = await Questions.findOne({_id : submits[0].Answers[i].quesId})
            add+=marking.marks
        
        }
        console.log(add)
        
    const message = {
        from: process.env.EMAIL, 
        to: submits[0].Email,         
        subject: 'Submission Sucessfull', 
        html: `
        <div style="width: 100%;
        height: 65px;
        background-color: aquamarine;
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: royalblue;">
            <div style="padding-left: 20px;">
                <div style="font-size: 30px;
                color :salmon;">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <div style="font-size: 25px;
                font-family: 'Raleway', sans-serif;
                font-weight:bold; padding-top:15px; color:salmon;">
                    My Quiz
                </div>
            </div>
        </div>
        <h1>${quizName.name}</h1>
        <h1>Total score: ${submits[0].totalMarks}/${add}</h1>
        <div style="background-color: royalblue;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 40px;
        font-size: 18px;
        font-family: 'Raleway', sans-serif; padding-bottom:5px;">
    <div style="padding:10px; color:white;">
        Made with <span style="color : red;">❤</span> by MyQuiz@2021
    </div>
</div>`
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