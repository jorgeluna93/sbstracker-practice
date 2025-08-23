import mongoose from 'mongoose';
/*
Model of the user using mongoose ORM
*/
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true,'User Name IS MANDATORY'],
        trim:true,
        minLength: 2,
        maxLength:50,
    },
    email: {
        type:String,
        required: [true,'Email Address IS MANDATORY'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/,'Enter a valid Email Address'],
    },
    password:{
        type:String,
        required: [true,'Password is a must. I mean, you dont have your house\'s door open all the time, innit?'],
        minLength: 6 
    },
    isAdmin:{
        type:Boolean,
        default: false
    }
},{timestamps:true});  

const User = mongoose.model('User',userSchema);

export default User;