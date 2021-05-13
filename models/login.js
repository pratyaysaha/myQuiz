const mongoose=require('mongoose')
const validator=require('validator')
const Login=mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    Name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    mail:{
        type: String,
            required:true,
            validate :{
                validator : (value) =>{
                    return validator.isEmail(value)
                },
                message : "Provide a valid email"
            }
    }
})
module.exports=mongoose.model('Login',Login)