import mongoose from "mongoose";
import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

//Create new user 
export const signUp = async(req,res,next)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try{

        //Get body values from request
        const {name,email,password} = req.body;

        //review if the user already exists:
        const existingUser = await User.findOne({email});

        if(existingUser){
            const error =  new Error('This User... man... it already exists!');
            error.statusCode = 409;
            throw error;
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //add that dude to db
        const newUsers = await User.create([{name,email,password:hashedPassword}],{session});
        const token = jwt.sign({userId:newUsers[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});

        //If everything is in order, we commit the transaction (create user), then we close the session
        await session.commitTransaction();
        session.endSession();

        //Send the OK Result!
        res.status(201).json({
            sucess:true,
            message: 'User created succesfully !',
            data:{token,user:newUsers[0]}
        });

    } catch(error){
        /*If something goes wrong we just throw the error, in this case as we are
        trying to commit something into the db we abort the transaction and close the session*/
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

//Sign in process
export const signIn = async(req,res,next)=>{
    try {
        
        //Get the info from the body of the request
        const {email,password} = req.body;

        //Call to the db just to see if the email (user) exists
        const signInUser = await User.findOne({email});

        //If email (user) doesn't exist, return 404 Not Found
        if(!signInUser){
            const error = new Error("This user with that email address doesn't exist!");
            error.statusCode = 404;
            throw error;
        }

        //Compare password to see if it's correct
        const isValidPassword = await bcrypt.compare(password,signInUser.password);

        //If password is bad, return a 401 Not Authorized
        if(!isValidPassword){
            const error = new Error("The entered password is not valid!");
            error.statusCode = 401;
            throw error;
        }

        //Create the token
        const token = jwt.sign({userId:signInUser._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});

        //Send success status if everything went smooth
        res.status(200).json({
            sucess:true,
            message: 'Signed in sucessfully!',
            data:{token,signInUser}
        });

    } catch (error) {
        //if something goes bad, throw the error
        next(error);
    }
};

export const signOut = async(req,res,next)=>{
        res.status(200).json({
            sucess:true,
            message: 'Its all good man!',
            data:{}
        });
};