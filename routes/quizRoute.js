const e = require('express');
const express = require('express')
const Quiz= require('../models/quizdetails')
const Question=require('../models/questions');
// const questions = require('../models/questions');
const Submit = require('../models/submission');
const router= express.Router();

router.use(express.json())

const validateQuizID= async (id)=>{
    try{
        const response=await Quiz.findById(id)
        if(response != null)
            return true
        return false
    }
    catch(err)
    {
        console.log(err);
    }   
}
router.get('/',(req,res)=>{
    res.send("This is api page")
})
router.post('/create',async (req,res)=>{
    console.log(req.body)
    const quizdet=new Quiz({
        name: req.body.name,
        author:req.body.author,
        authorEmail: req.body.authorEmail,
        dot : new Date(),
        attempts: req.body.attempts 
    })
    try{
        const newQuiz=await quizdet.save()
        res.json({'status' : true, 'data' : newQuiz})
    }
    catch(err){
        res.json({"status" : false , 'error': err, 'code' : 10}) 
    }
})
router.post('/create/:id', async (req,res)=>{
    var status={}
    var response= await validateQuizID(req.params.id)
    if(response==false)
    {
        status.status=false
        status.code=12
    }
    else
    {
        status.status=true
        const newQuestion= new Question({
            quizId: req.params.id,
            ques: req.body.ques,
            options: req.body.options,
            answer:req.body.answer,
            marks: req.body.marks,
            isNegative: req.body.isNegative,
            negative: req.body.negative
        })
        try{
            const quesSubmit= await newQuestion.save();
            status.data=quesSubmit;
        }
        catch(err){
            status.status=false;
            status.code=12;
        }
    }
    res.json(status)
})

router.get("/assessment", async (req, res) => {
    q={}
    try{
        const QueryResponse=await Question.find(q)
        res.json(QueryResponse)
    }
    catch(err)
    {
        res.json({'status': false, 'error' : err, 'code': 103})
    }
})
router.get("/getData", async (req, res) => {
    q={}
    try{
        const QueryResponse=await Quiz.find(q)
        res.json(QueryResponse)
    }
    catch(err)
    {
        res.json({'status': false, 'error' : err, 'code': 103})
    }
})
router.get("/getsubmission", async (req, res) => {
    q={}
    try{
        const QueryResponse=await Submit.find(q)
        res.json(QueryResponse)
    }
    catch(err)
    {
        res.json({'status': false, 'error' : err, 'code': 103})
    }
})

router.post('/assessment/:quizid',async (req,res)=>{
    var status={}
    var response= await validateQuizID(req.params.quizid)
    if(response==false)
    {
        status.status=false
        status.code=12
    }
    else
    {
        status.status=true
        const newsubmit = new Submit({
            quizId: req.params.quizid,
            candidate: req.body.candidate,
            Email: req.body.Email,
            Answers : req.body.Answers,
            submittedTime : req.body.submittedTime
        })
        try{
            const ansSubmit = await newsubmit.save();
            status.data=ansSubmit;
        }
        catch(err){
            status.status=false;
            status.code=14;
        }
    }
    res.json(status)
    
})
/*
    POST /evaluate/:quizid
        - search from submits collection where quizId = quizid (submitted)
        - search from questions collection where quizId= quizid (answers are stored)
        - submission.map((item)=>{
            var totalMarks
            item.Answer.quesId = find from questions colection
                - compare(item.Answer.submittedAnswer , questions-answer)
                    - if(item.Answer.submittedAnswer == null ) no negative 
                    - if( not a match and not null) totalMarks-=negative
                    - if(match) totalMarks+=marks

            update 
        }) 
 */
router.post('/evaluate/:quizid', async (req, res) => {
    try {
        const submits = await Submit.find({ quizId: req.params.quizid })
        const questions = await Question.find({ quizId: req.params.quizid })
        console.log(submits)
        for (let i = 0; i < questions.length; i++) {
            console.log(questions[i]._id)
        }
        var statusData=[]
        submits.map(async (item) => {
            var totalMarks = 0
            item.Answers.map((data) => {
                for (let i = 0; i < questions.length; i++) {
                    if ((questions[i]._id) == data.quesId) {
                        console.log(questions[i].answer)
                        console.log(data.submittedAnswer)
                        if ((questions[i].answer) == data.submittedAnswer) {
                            totalMarks += questions[i].marks
                        }
                        else if ((questions[i].answer) != data.submittedAnswer && data.submittedAnswer != null) {
                            totalMarks -= questions[i].negative
                        }
                        else if (data.submittedAnswer == null) {
                        }
                    }
                }

            })
            console.log(totalMarks)
            try {
                const updateQuery = await Submit.updateOne({ "_id": `${item._id}` }, { $set: { "totalMarks": `${totalMarks}`} })
                var temp={}
                temp.status=true
                temp.submissionId=item._id
                temp.data=updateQuery
                statusData.push(temp)
            }
            catch (err) {
                console.log(err)
                var temp={}
                temp.status=false
                temp.submissionId=item._id
                temp.error=err
                statusData.push(temp)
            }
        })
        console.log(statusData)
        res.json({status : statusData})
    }
    catch (err) {
        res.json({ "status": false, "error" : err })
    }
})

module.exports=router

