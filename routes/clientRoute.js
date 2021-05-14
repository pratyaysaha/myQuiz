const express=require('express')
const QuizDetails= require('../models/quizdetails')
const Questions=require('../models/questions')
const nodemailer = require('nodemailer')
const Submit = require('../models/submission');
const fetch = require('node-fetch');
const quizdetails = require('../models/quizdetails');
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
        
        console.log(new Date())
        console.log(new Date(quizDetails.stime))
        console.log(new Date(quizDetails.etime))
        if(Date.now()>=new Date(quizDetails.stime)&&Date.now()<=new Date(quizDetails.etime))
        {
           
            res.render("quizpage",{data : {quizDetails, questions: sendQuestion},timelimit: true})
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

router.get('/admin/:quizid',async (req,res)=>{
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
        res.render("quizpage",{data : {quizDetails, questions: sendQuestion},timelimit : false})
}
    catch(err)
    {
        console.log("err");
    }
})



router.get('/:submissionId/success' ,async(req, res)=>{
    const url= `${req.protocol}://${req.get('host')}/api/evaluate/submission/${req.params.submissionId}`
    var receivedData={}
     try{
       await fetch(url)    
        .then(res => res.json())
        .then(back => {
            if(!back.status)
                res.send("404 Error")
            receivedData=back.data
        })
        const quiz=await QuizDetails.findOne({_id: receivedData.submittedAnswer.quizId})
        receivedData.quizDetails=quiz
        res.render('aftereval',{quizDetails : receivedData.quizDetails, 
                                submittedAnswer : receivedData.submittedAnswer, 
                                fullmarks : receivedData.fullmarks,
                                questions : receivedData.questions
                            })
        const obj=receivedData.submittedAnswer
        const link=`${req.protocol}://${req.get('host')}/quiz/${req.params.submissionId}/admin/success`
      const message = {
        from: process.env.EMAIL, 
        to: obj.Email,         
        subject: 'Submission Sucessfull', 
        html: `
        <div style="width: 100%;
        height: 65px;
        background-color: aquamarine;
        display: flex;
        align-items: center;
        background-color: royalblue;">
                <div style="font-size: 25px;
                font-family: 'Raleway', sans-serif;
                font-weight:bold; padding-top:15px; color:salmon;">
                    My Quiz
                </div>
            </div>
        </div>
        <h1>${quiz.name}</h1>
        <h1>Total score: ${obj.totalMarks}/${receivedData.fullmarks}</h1>
        <a href="${link}"><h3>Link to your result</h3></a>       
        <div style="background-color: royalblue;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 50px;
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
router.get('/:submissionId/admin/success' ,async(req, res)=>{
    const url= `${req.protocol}://${req.get('host')}/api/evaluate/submission/${req.params.submissionId}`
    var receivedData={}
     try{
       await fetch(url)    
        .then(res => res.json())
        .then(back => {
            if(!back.status)
                res.send("404 Error")
            receivedData=back.data
        })
        const quiz=await QuizDetails.findOne({_id: receivedData.submittedAnswer.quizId})
        receivedData.quizDetails=quiz
        res.render('aftereval',{quizDetails : receivedData.quizDetails, 
                                submittedAnswer : receivedData.submittedAnswer, 
                                fullmarks : receivedData.fullmarks,
                                questions : receivedData.questions
                            })
        }
        catch(err)
        {
            console.log(err)
        }
    })
router.get('/edit/:quizid', async (req,res)=>{
    try{
        const quizDetails=await QuizDetails.findById(req.params.quizid)
        const questions=await Questions.find({quizId: req.params.quizid})
        res.render('editquiz',{quizDetails,questions})
    }
    catch(err)
    {
        console.log(err)
    }
})

module.exports=router