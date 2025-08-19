import express from 'express';
import { PORT } from './config/env.js';
import userRouter  from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import authRouter from './routes/auth.routes.js';
import connectToDB from './database/mongodb.js'
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import ajMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';

/*Needed middleware */
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(ajMiddleware);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/subscriptions',subscriptionRouter);
app.use('/api/v1/workflows',workflowRouter);
app.use(errorMiddleware);

/* we start up our api */
app.listen(PORT,async () => {
    /* Log that informs that it's all good man */
    console.log(`(i) - API is running on http://localhost:${PORT}`);

    /*Here we connect to our MongoDB database */
    await connectToDB();
});

export default app;
