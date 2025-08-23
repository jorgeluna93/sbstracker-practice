import {Router} from 'express';
import { createSubscription, getSubscriptionsDetails, getUserSubscriptions, updateSubscription } from '../controllers/subscription.controller.js';
import authorize from '../middlewares/auth.middleware.js';
const subscriptionRouter = Router();

subscriptionRouter.get('/',(req,res) => res.send({title:'Get all subscriptions'}));

subscriptionRouter.get('/:id',authorize,getSubscriptionsDetails);

subscriptionRouter.post('/',authorize,createSubscription);

subscriptionRouter.put('/:id',authorize,updateSubscription);

subscriptionRouter.delete('/:id',(req,res) => res.send({title:'Delete subscription'}));

subscriptionRouter.get('/user/:id',authorize,getUserSubscriptions);

subscriptionRouter.put('/:id/cancel',(req,res) => res.send({title:'Cancel subscription'}));

subscriptionRouter.get('/upcoming-renewals',(req,res) => res.send({title:'Get upcoming-renewals'}));

export default subscriptionRouter;