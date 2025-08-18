
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../config/env.js';
import User from '../models/user.model.js';

/*This middleware makes sure that not all people that are using our api have access to everything... is an authorization middleware */
/*A dude makes a request to get an user details -> authorize middleware -> verify -> if good, then go ahead n' make the request (next) */
const authorize = async (req,res,next)=>{

    try {
        //Get the token
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        //if there's no token, get outta here!
        if(!token){
            return res.status(401).json({message:'UNAUTHORIZED!'});
        }

        //Verify the token
        const decoded = jwt.verify(token,JWT_SECRET);

        const user = await User.findById(decoded.userId);

        //If user doesn't exist, get outta here!
        if(!user){
            return res.status(401).json({message:'UNAUTHORIZED!'});
        }

        //Move to the request if all looks in order
        req.user = user;

        next();
    } catch (error) {
        //Anything that goes wrong redirects here.
        res.status(401).json({message:"Aren't you a bold one huh? - UNAUTHORIZED!",error: error.message });
    }
};

export default authorize;