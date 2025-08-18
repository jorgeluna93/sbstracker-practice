import mongoose from 'mongoose';
/*
Model of the SUBSCRIPTION using mongoose ORM
*/
const subscriptionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Subscription name is required'],
        trim:true,
        minLength:2,
        maxLength:100,
    },
    price:{
        type:Number,
        required:[true,'Subscription price is required'],
        min:[0,'Price must be greater than 0'],
        max:[1000,'Price must be less than 1000'],
    },
    currency:{
        type: String,
        enum:['USD','MXN','EUR'],
        default:'MXN',

    },
    frequency:{
        type:String,
        enum:['daily','weekly','monthly','yearly'],
        default:'monthnly'
    },
    category:{
        type:String,
        enum:['sports','news','entertainment','lifestyle','technology','finance','politics','videogames','anime','k-drama','others'],
        required:true
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        enum:['active','cancelled','expired'],
        default:'active',
    },
    startDate:{
        type:Date,
        required:true,
        validate: (value) => value <= new Date(),
        message: 'Start date must be in the past'
    },
    renewalDate:{
        type:Date,
        required:true,
        validate: function(value) {return value > this.startDate},
        message: 'Renewal date must be after the start date'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        
    }

}, {timestamps:true});

//Calc renewal date as soon as we create a subscription object... 
subscriptionSchema.pre('save',function(next){

    if(!this.renewalDate){
        const renawalPeriods = {
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renawalPeriods[this.frequency]);
    }

    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }

    next();
});

const Subscription =  mongoose.model('Subscription',subscriptionSchema);

export default Subscription;