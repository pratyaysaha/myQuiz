const e = require('express');
const express = require('express')
const Quiz= require('../models/quizdetails')
const Question=require('../models/questions');


// const questions = require('../models/questions');
const Submit = require('../models/submission');
const questions = require('../models/questions');
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
        stime : req.body.stime,
        etime : req.body.etime
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


router.patch('/create/:id', async (req,res)=>{
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
     
        var setQuery={}
        setQuery.name=req.body.name
        setQuery.author=req.body.author
        setQuery.authorEmail=req.body.authorEmail
        setQuery.stime=req.body.stime
        setQuery.etime=req.body.etime
            
    console.log(setQuery)
        try{
            const quizSubmit= await Quiz.updateOne({_id:req.params.id}, setQuery);
            status.data=quizSubmit;
          
        console.log(quizSubmit)
        }
        catch(err){
            status.status=false;
            status.code=15;
        }
    }
    res.json(status)
})
router.delete('/create/:id', async(req,res)=>{
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
        try{
            const deleteQuiz = await Quiz.deleteOne({'_id':req.params.id})
            const deleteQuestions=await Question.deleteMany({'quizId' : req.params.id})
            const deletesubs=await Submit.deleteMany({'quizId' : req.params.id})
            res.json({'status' : true , 'ok' : deleteQuiz.ok})
        }
        catch(err){
            res.json({'status' : false, 'error' : err, 'code': 200 })
        } 
    }
})
router.delete('/question/:quesId', async(req,res)=>{
    var status={}
    try
    {
        status.status=true
        try{
            const deleteQues = await Question.deleteOne({'_id':req.params.quesId})
            res.json({'status' : true , 'ok' : deleteQues.ok})
        }
        catch(err){
            res.json({'status' : false, 'error' : err, 'code': 200 })
        } 
    }
    catch(err){
        console.log(err)
    }
})
router.patch('/question/:quesId', async (req,res)=>{
    var status={}
    try{
        status.status=true
     
        var setQuery={}
    
        setQuery.ques=req.body.ques
        setQuery.options=req.body.options
        setQuery.answer=req.body.answer
        setQuery.marks=req.body.marks
        setQuery.isNegative=req.body.isNegative
        setQuery.negative=req.body.negative
            
    console.log(setQuery)
        try{
            const quesSubmit= await Question.updateOne({_id:req.params.quesId}, setQuery);
            status.data=quesSubmit;
          
        console.log(quesSubmit)
        }
        catch(err){
            status.status=false;
            status.code=15;
        }
    }
    catch(err){
        console.log("error")
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
router.get("/quizes", async (req, res) => {
    try{
        const QueryResponse=await Quiz.find({})
        res.json({'status' : true, 'data' : QueryResponse})
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
router.get('/submissions/:quizid',async(req,res)=>{
    try{
        const submissions=await Submit.find({quizId: req.params.quizid},{Answers:0})
        res.json({'status': true, 'data': submissions})
    }
    catch(err){
        res.json({'status': false, 'error' : err, code: 104})
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
    try 
    {
            const submits = await Submit.find({ _id: req.params.submitid })
            const item = submits[0]
            var totalMarks = 0
            var fullMarks=0
            const questions = await Question.find({ quizId: item.quizId })
            for(let i=0;i<questions.length;i++)
            {
                fullMarks+=questions[i].marks
            }
            if(item.isEvaluated){return res.json({"status":true, "data" : {"submittedAnswer" : submits[0], "questions" : questions,"fullmarks" : fullMarks}})}
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
        var temp = {}
        temp.submissionId = item._id
        try {
            const updateQuery = await Submit.updateOne({ "_id": `${item._id}` }, { "totalMarks": `${totalMarks}`, "isEvaluated": true, "$set": { "Answers": item.Answers } })
            const submission=await Submit.find({ _id: req.params.submitid })
            temp.status= true
            temp.data = {"submittedAnswer" : submission[0], "questions" : questions,"fullmarks" : fullMarks}
        }
        catch (err) {
            console.log(err)
            temp.status = false
            temp.error = err
        }   
        res.json(temp)
    }
    
    catch (err){
        console.log(err)
    }
})

module.exports=router

