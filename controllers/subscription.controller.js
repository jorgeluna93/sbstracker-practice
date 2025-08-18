import Subscription from '../models/subscription.model.js';
import mongoose from "mongoose";

export const createSubscription = async (req,res,next) => {

    const session = await mongoose.startSession();
    session.startTransaction();
        
    try{

        //Get body values
        const subscription = await Subscription.create({
            ... req.body,
            user:req.user._id
        });

        //If the information and creation was ok, send a 201 resource created successfully
        await session.abortTransaction();
        session.endSession();
        
        res.status(201).json({
            success:true,
            data: subscription
        });
        
    }
    catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }

};

export const getUserSubscriptions = async (req,res,next) => { 
    try {
        //Review if the logged user is the same as the param id user
        if(req.params.id !=  req.user.id){
            const error = new Error("UNAUTHORIZED!");
            error.statusCode = 401;
            throw error;
        }

        //Get the subscriptions
        const subscriptions = await Subscription.find({user:req.params.id}).exec();

        //Send the result as a response
        res.status(200).json({
            sucesss:true,
            data:subscriptions
        });

    } catch (error) {
        next(error);
    }
};