/* 
    https://stackoverflow.com/questions/39596625/nested-objects-in-mongoose-schemas
    quizId, name, email, answers={[ {qid: , submittedAnswer: }]}, submittedTime : new Date()
 */
    const mongoose=require('mongoose')
    const validator=require('validator')
    const answers = mongoose.Schema([{
        quesId : {
            type: String,
            required: true
        },
        submittedAnswer : {
            type: String,
        },
        marksObtained: {
            type: Number,
            default : 0
        }
    }])
    

    const submit = mongoose.Schema({
        quizId : {
            type: String,
            required: true
        },
        candidate : {
            type: String,
<<<<<<< HEAD
            required: true
=======
            required: true,
>>>>>>> 9dfe873a902969457017de91fa0d9f6ed9525bc7
        },
        Email : {
            type: String,
            required:true,
            validate :{
                validator : (value) =>{
                    return validator.isEmail(value)
                },
                message : "Provide a valid email"
            }
        },
        Answers : {
            type: [answers],
            required: true
        },
        submittedTime : {
            type: Date,
            default: new Date(),
            required: true
        },
        totalMarks:{
            type : Number,
            default : 0
        }
    })
    module.exports=mongoose.model('Submit',submit)