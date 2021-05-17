const express=require('express')
const mongoose=require('mongoose')
const quizRoute= require('./routes/quizRoute')
const clientRoute=require('./routes/clientRoute')
const QuizDetails= require('./models/quizdetails')
const userDetails=require('./models/login')
const app=express()
require('dotenv/config')

app.use('/api',quizRoute)
app.use('/quiz',clientRoute)

app.use(express.static(__dirname+'/css'))
app.set('view engine', 'ejs')

app.get('/',async (req,res)=>{
    try{
        res.render('login')
    }
    catch(err)
    {
        console.log("err");
    }
 
})
app.get('/:userid/newquiz',async (req,res)=>{
    try
    {
        const user= await userDetails.findOne({_id : req.params.userid},{password : 0});
        console.log(user)
        res.render('newquiz',{user : user})
    }
    catch(err)
    {
        res.send('no data')
    }
})
app.get('/:userid/evaluation',async (req,res)=>{
    try{
        const user= await userDetails.findOne({_id : req.params.userid},{password : 0});
        const quizDetails=await QuizDetails.find({authorEmail: user.mail})
        res.render('evaluation',{quizDetails,user})
    }
    catch(err)
    {
        console.log(err)
    }
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/signup',(req,res)=>{
    res.render('signup')
})
app.get('/:userid',async (req,res)=>{
    try
    {
        const user= await userDetails.findOne({_id : req.params.userid},{password : 0});
        console.log(user)
        res.render('quizall',{user : user})
    }
    catch(err)
    {
        res.send('no data')
    }
})
app.get('/forgetpassword/resetme',(req,res)=>{
    res.render('forgetpass')
})


mongoose.connect(process.env.DB_CONNECTION,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

app.listen(process.env.PORT || 3000 )