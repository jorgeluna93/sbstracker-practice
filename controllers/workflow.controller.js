/*upstash wrote this using commonjs... so that's why import doesnt work directly... */
import {createRequire} from 'module';
import Subscription from '../models/subscription.model.js';
import dayjs from 'dayjs';
const require = createRequire(import.meta.url);
const {serve} = require('@upstash/workflow/express');

const REMINDERS = [7,5,2,1];

export const sendReminders = serve(async (context)=>{
    //Look for the subscription on mongodb
    const {subscriptionId} = context.requestPayload;
    const subscription = await fetchSubscription(context,subscriptionId);

    //Verify the subscription
    if(!subscription || subscription.status != 'active'){
        return;
    }

    //Get the renewalDate and format it in a simpler way using dayjs...
    const renewalDate = dayjs(subscription.renewalDate);
    
    //dayjs() returns the current date
    //Verify that the renewal date is valid
    if(renewalDate.isBefore(dayjs())){
        console.log("(!) - Renewal date has passed for subscription " + subscriptionId + ". stopping the workflow. Nothing to do here!");
        return;
    }

    for(const daysBefore of REMINDERS){
        const reminderDate = renewalDate.subtract(daysBefore,'day');
        let label = "Reminder " +  daysBefore + " days before";

        if(reminderDate.isAfter(dayjs())){
            //wait for the right date to trigger the notification
            await sleepUntilReminder(context,label,reminderDate);
        }
        //trigger the notification 
        await triggerReminder(context,label);
    }


});

const fetchSubscription = async (context,subscriptionId) =>{
    return await context.run('get subscription',()=>{
       return Subscription.findById(subscriptionId).populate('user','name email');
    });
};

const triggerReminder = async (context,label) => {
    return await context.run(label,()=>{
        console.log("(i) - Triggering " + label + " reminder");
        //send stuff
    });
};

const sleepUntilReminder = async (context,label,date) => {
    console.log("(i) - Sleeping until " + label + " reminder at " + date);
    await context.sleepUntil(label,date.toDate());
}