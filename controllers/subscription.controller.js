import Subscription from '../models/subscription.model.js';
import mongoose from "mongoose";
//import {workflowClient} from "../config/qstash.js";


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

        //Send notifications for reminders to renewal
        /*await workflowClient.trigger(
            url: SERVER_
        );*/

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

export const getSubscriptionsDetails = async (req,res,next) => { 
    try {

        //Get the id from the url, get id of user just to keep things private
        const subscriptionId = req.params.id;
        const userId = req.user.id;

        //Get subscription details
        const subscriptionDetails = await Subscription.findById(subscriptionId).exec();

        //If subscription doesnt exist throw error
        if(!subscriptionDetails){
            const error = new Error("Subscription not found!");
            error.statusCode = 404;
            throw error;
        }

        //Validate that the user has access that subscription
        if(subscriptionDetails.user != userId){
            const error = new Error("UNAUTHORIZED!");
            error.statusCode = 401;
            throw error;
        }

        //Send the result as a response
        res.status(200).json({
            sucesss:true,
            data:subscriptionDetails
        });

    } catch (error) {
        next(error);
    }
};

export const updateSubscription = async (req,res,next) => {
    //Session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //Get SubscriptionId from the /:id path
        const subscriptionId = await Subscription.findById(req.params.id);

        //If that subscription doesnt exist, exit
        if(!subscriptionId){
            const error = new Error("SUBSCRIPTION NOT FOUND!");
            error.statusCode = 404;
            throw error;
        }
        console.log(req.user.id);
        console.log("lol " + subscriptionId.user);
        //Verify that the user is authorize to modify that subscription
        if(subscriptionId.user != req.user.id){
            const error = new Error("UNAUTHORIZED!");
            error.statusCode = 401;
            throw error;
        }

        //
        const updatedSubscription = await Subscription.findByIdAndUpdate(req.params.id,{... req.body},{new:true});
        //

        //If everything is in order, we commit the transaction (create user), then we close the session
        await session.commitTransaction();
        session.endSession();

        //Send the OK Result!
        res.status(201).json({
            sucess:true,
            message: 'Subscription updated succesfully !',
            data:{subscription:updatedSubscription}
        });

    }
    catch(error){
        //Abort transaction if something goes wrong
        await session.abortTransaction();
        session.endSession();
        next(error);
    }

};