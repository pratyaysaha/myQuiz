const express = require('express')
const Quiz= require('../models/quizdetails')
const Loginuser=require('../models/login')
const bcrypt=require('bcrypt')
const validateUser=require('../functions/validateuser')
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
            status.code=12;
        }
    }
    catch(err){
        console.log(err)
    }
    res.json(status)
})

// router.get('/signin', async (req,res)=>{
//     console.log(req.query.UserName)
//     const {status, error, code}=await validateUser(req.query.UserName)
//     if(status==false)
//         res.json({'status' : status, error, code})
//     try{
//         var cred=req.query.UserName.split(' ')
//             const searchUser= await Loginuser.find({'username': cred[0]})
//             console.log(searchUser)
//             res.json(searchUser)
//         }
//         catch(err){
//             res.json({'status' : false, 'error' : err, 'code' : 26}) 
//         }
    
// })


router.get('/signin', async (req,res)=>{
    console.log(req.query.UserName)
    const {status, error, code}=await validateUser(req.query.UserName)
    if(status==false)
        res.json({'status' : status, error, code})
    try{
        var cred=req.query.UserName.split(' ')
        const searchUser= await Loginuser.find({'username': cred[0]})
            console.log(searchUser[0]._id)
            const searchQuiz= await Quiz.find({'authorEmail': searchUser[0].mail})
            res.json(searchQuiz)
        }
        catch(err){
            res.json({'status' : false, 'error' : err, 'code' : 26}) 
        }
    
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
