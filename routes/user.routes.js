import {Router} from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { getUser, getUsers, updateUser } from '../controllers/user.controller.js';

const userRouter = Router();

//Path: /api/v1/users/ (GET)
userRouter.get('/',getUsers);

//Path: /api/v1/users/:id (GET)
//You can chain stuff in your request... in this case we call authorize before getUsers just to see if user is authorized to get the info.
userRouter.get('/:id',authorize,getUser);

userRouter.post('/',(req,res)=>res.send({title:'Create new user'}));

userRouter.put('/:id',authorize,updateUser);

userRouter.delete('/:id',(req,res)=>res.send({title:'Update  user'}));

export default userRouter;
