import mongoose from "mongoose"

const UseerSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true
    },
    email : {
        type : String , 
        required : true,
        uniqe : true
    },
    passwordHash : {
        type : String ,
        required : true
    },
    secretWord : {
        type : String ,
        required : true
    },
    avatarUrl : String
}, 
{
    timestamps : true , 
})
export default mongoose.model('User' , UseerSchema)