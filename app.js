const express=require('express')
const mongoose=require('mongoose')
const quizRoute= require('./routes/quizRoute')
const clientRoute=require('./routes/clientRoute')
const app=express()
require('dotenv/config')

app.use('/api',quizRoute)
app.use('/quiz',clientRoute)
app.use(express.static(__dirname+'/css'))
app.set('view engine', 'ejs')

app.get('/',(req,res)=>{
    res.send("hello world")
})

mongoose.connect(process.env.DB_CONNECTION,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

app.listen(process.env.PORT || 3000 )