import User from '../models/user.model.js';

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