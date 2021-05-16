const express = require('express')
const Quiz= require('../models/quizdetails')
const Loginuser=require('../models/login')
const bcrypt=require('bcrypt')
const nodemailer = require('nodemailer')
const validateUser=require('../functions/validateuser')
const router= express.Router();

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
            console.log(newuser.mail)
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
