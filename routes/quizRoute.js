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
    GET /evaluate/:quizid
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
router.get('/evaluate/:quizid', async (req, res) => {
    try {
        const submits = await Submit.find({ quizId: req.params.quizid })
        const questions = await Question.find({ quizId: req.params.quizid })
        submits.map(async (item) => {
            if (!item.isEvaluated) {
                var totalMarks = 0
                item.Answers.map(async (data) => {
                    for (let i = 0; i < questions.length; i++) {
                        if ((questions[i]._id) == data.quesId) {
                            if ((questions[i].answer) == data.submittedAnswer) {
                                totalMarks += questions[i].marks
                                data.marksObtained = questions[i].marks
                            }
                            else if ((questions[i].answer) != data.submittedAnswer && data.submittedAnswer != null) {
                                totalMarks -= questions[i].negative
                                data.marksObtained = -questions[i].negative
                            }
                            else if (data.submittedAnswer == null) {
                                data.marksObtained = 0
                            }
                        }
                    }
                })
                var temp = {}
                temp.submissionId = item._id
                try {
                    const updateQuery = await Submit.updateOne({ "_id": `${item._id}` }, { "totalMarks": `${totalMarks}`, "isEvaluated": true, "$set": { "Answers": item.Answers } })
                    temp.status= true
                    temp.data = updateQuery
                    
                }
                catch (err) {
                    console.log(err)
                    temp.status = false
                    temp.error = err
                }
            }
            
        })
        res.json({status : true})
    }
    catch (err) {
        res.json({ "status": false, "error" : err })
    }
})

router.get('/evaluate/submission/:submitid', async (req,res) => {
    try {
        const submits = await Submit.find({ _id: req.params.submitid })
        console.log(submits)
        submits.map(async (item)=>{
            console.log(item)
            if (!item.isEvaluated) {
                var totalMarks = 0
                const questions = await Question.find({ quizId: item.quizId })
                console.log(questions)
                for (let i = 0; i < questions.length; i++) {
                    
                    item.Answers.map(async (data) => {
                        
                    if ((questions[i]._id) == data.quesId) {
                        if ((questions[i].answer) == data.submittedAnswer) {
                            totalMarks += questions[i].marks
                            data.marksObtained = questions[i].marks
                        }
                        else if ((questions[i].answer) != data.submittedAnswer && data.submittedAnswer != null) {
                            totalMarks -= questions[i].negative
                            data.marksObtained = -questions[i].negative
                        }
                        else if (data.submittedAnswer == null) {
                            data.marksObtained = 0
                        }
                
                
            }
        
    })
                    
    }
}
    console.log(totalMarks)
    var temp = {}
    temp.submissionId = item._id
    try {
        const updateQuery = await Submit.updateOne({ "_id": `${item._id}` }, { "totalMarks": `${totalMarks}`, "isEvaluated": true, "$set": { "Answers": item.Answers } })
        temp.status= true
        temp.data = updateQuery
        
    }
    catch (err) {
        console.log(err)
        temp.status = false
        temp.error = err
    }

        })
        res.json({status : true})
    }
    
    catch (err){
        console.log(err)
    }
})

module.exports=router

