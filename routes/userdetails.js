const express = require('express')
const Quiz= require('../models/quizdetails')
const Loginuser=require('../models/login')
const bcrypt=require('bcrypt')
const nodemailer = require('nodemailer')
const validateUser=require('../functions/validateuser')
const router= express.Router();
require('dotenv/config')
router.use(express.json())


var transport = nodemailer.createTransport({
    host : 'smtp.yandex.com',
    port: 465,
    secure : true,
    auth: {
       user: process.env.EMAIL,
       pass: process.env.EMAIL_PASS
    }
})
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
    res.send("This is user page")
    
})

router.post('/signup', async (req,res)=>{
    console.log(req.body)
    var status={}
    try
    {
        try{
            var hashedPassword= await bcrypt.hash(req.body.password,10)
        }
        catch(err){
            res.json({'status' : false, 'error' : err, 'code' : 21}) 
        }
        status.status=true
        const newUser= new Loginuser({
            username: req.body.username,
            Name: req.body.Name,
            password: hashedPassword,
            mail:req.body.mail
        })
        try{
            const newuser= await newUser.save();
            status.data=newuser;
        }
        catch(err){
            status.status=false;
            if(err.code)
                status.code=err.code;
            else    
                status.code=12
            status.error=err.message
            console.log(err)
        }
        const message = {
            from: process.env.EMAIL, 
            to: newUser.mail,         
            subject: 'Email Confirmation', 
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
            <h2>Hello, ${newUser.Name}</h2>
            <h3>Thank you for signing up with MyQuiz2021!!</h3>
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
    res.json(status)
})
router.post('/login', async (req,res)=>{
    if(req.body.username===undefined) {return res.json({"status": false, "error" : "no username and password"})}
    
    try{
        
        const {status, error, code}=await validateUser(req.body.username, req.body.password)
        if(status==false)
            res.json({'status' : status, error, code})
        else{
            const searchUser= await Loginuser.find({'username': req.body.username})
            res.json({"status": true, "data" : searchUser})
        
         }
        }
        catch(err){
            console.log(err)
        }
    
})


router.patch('/signin/forgetpassword/:userName', async (req,res)=>{
    var status={}
    try
    {
        try{
            var hashedPass= await bcrypt.hash(req.body.password,10)
        }
        catch(err){
            res.json({'status' : false, 'error' : err, 'code' : 21}) 
        }
        status.status=true
        try{
            const Updatepass= await Loginuser.updateOne({"username":req.params.userName}, {$set:{"password":hashedPass}});
            status.data=Updatepass;
          
        console.log(Updatepass)
        }
        catch(err){
            status.status=false;
            status.code=15;
        }
    }
    catch(err){
        console.log(err)
    }
    res.json(status)
    
})


router.get('/getuser', async (req,res)=>{
    
    q={}
    try{
        const searchUser=await Loginuser.find(q)
        res.json(searchUser)
    }
    catch(err)
    {
        res.json({'status': false, 'error' : err, 'code': 103})
    }
})

module.exports=router
