import { config } from "dotenv";
/*Here we read our env vars*/

config({path:`.env.${process.env.NODE_ENV || 'development' }.local`});

/*
    PORT = Port for our api,
    NODE_ENV = Enviroment of the api,
    DB_URI = Location of our MongoDB,
    JWT_SECRET = Our token for keep track of user sessions,
    JWT_EXPIRES_IN = When the token expires
*/

export const { PORT,NODE_ENV,DB_URI,JWT_SECRET,JWT_EXPIRES_IN } = process.env;
