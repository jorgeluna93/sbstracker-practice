import mongoose from "mongoose";
import {DB_URI,NODE_ENV} from "../config/env.js";

/*Here we connect to our MongoDB database */

if(!DB_URI){
    //If the env var is wrong or not pointing to any db, throw error
    throw new Error('(X) - Define the MONGODB_URI env. variable inside the .env file');
}

const connectToDB = async () => {
    try {
        //Try to connect to our MongoDb databse
        await mongoose.connect(DB_URI);
        console.log(`(i) - Connected to database in ${NODE_ENV} mode`);
    } catch (error) {
        //Throw error if something goes wrong... review error.middleware.js if needed.
        console.error("(x) - Error while trying to connect to database: ",error);
        process.exit(1);
    }
};

export default connectToDB;