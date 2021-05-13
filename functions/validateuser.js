const UserLogin=require('../models/login')
const bcrypt=require('bcrypt')
const validateUser = async (credString) =>{
    var error={'status': false}
    try{
        if(credString == undefined)
            throw new Error(0)
        var cred=credString.split(' ')
        console.log(cred[0])
        console.log(cred[1])
        console.log(cred.length)
        if(cred.length< 2 || cred.length > 2)
            throw new Error(cred.length)
    }
    catch(err){
        console.log(err)
        if(err > 2)
        {
            error.error="Enter Username<space>Password"
            error.code=23
        }
        else
        {
            error.error="Enter Username<space>Password"
            error.code=24
        }
        return error 
    }
    try{
        var userSearch={}
        userSearch= await UserLogin.findOne({'username' : cred[0]})
        console.log(userSearch)
        console.log(userSearch.password)
        const isTrue= await bcrypt.compare(cred[1],userSearch.password)
        if(isTrue == false)
            throw new Error("Password incorrect")
        else    
            var user=userSearch
            user.password="It is secret"
            console.log(user.password)
            return {'status' : true, 'error' : "No error", "data": user}
            
    }
    catch(err){ 
        error.error=err.message
        error.code=25
    }  
    console.log(error)  
    return error
}

module.exports=validateUser