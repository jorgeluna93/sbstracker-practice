import User from '../models/user.model.js';
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

//Get all the users
export const getUsers = async (req,res,next)=>{
    try {
        //Look up for all the users in the mongodb stuff using the User model
        const users = await User.find();

        //Return the requested info in a form of json response
        res.status(200).json({
            success:true,
            data:users
        });

    } catch (error) {
        //throw error if something went wrong
        next(error);
    }

};

//Get a specific user using id as param in the url (/api/v1/users/:id)
export const getUser = async (req,res,next)=>{
    try {
        //Get the id from a url param using req.params.[nameOfParam]
        const user = await User.findById(req.params.id).select('-password');
        
        //If user doesnt exist, just throw a 404 error Not Found
        if(!user){
            const error = new Error("User not found!");
            error.statusCode = 404;
            throw error;
        }

        //If its all good, just call it a day with a 200 Code with the request info!
        res.status(200).json({
            success:true,
            data:user
        });

    } catch (error) {
        //throw error if something went wrong
        next(error);
    }

};

export const updateUser = async (req,res,next) =>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //First we need to see if the user in fact, exists
        const user = await User.findById(req.params.id);

        if(!user){
            const error = new Error("User not found!");
            error.statusCode = 404;
            throw error;
        }
        
        //We need to determine if that user is updating his own profile
        if(user._id != req.user.id){
            const error = new Error("UNAUTHORIZED!");
            error.statusCode = 401;
            throw error
        }

        //Determine the kind of modification we are doing:
        let update;

        if(req.body.type === "password"){
            const oldPassword = req.body.oldPassword;

            //Compare password to see if it's correct
            const isValidPassword = await bcrypt.compare(oldPassword,user.password);
            
            //If password is bad, return a 401 Not Authorized
            if(!isValidPassword){
                const error = new Error("The entered password is not valid!");
                error.statusCode = 401;
                throw error;
            }

            //Hash password and pass it
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password,salt);
            update = {password:hashedPassword};
            
        }else{
            //pass the data
            update = {...req.body.data};
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id,update,{new:true});

        await session.commitTransaction();
        session.endSession();

        //Send the OK Result!
        res.status(200).json({
            sucess:true,
            message: 'User updated succesfully !',
            data:updateUser
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};