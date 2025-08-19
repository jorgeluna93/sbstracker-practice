import { config } from "dotenv";
/*Here we read our env vars*/

config({path:`.env.${process.env.NODE_ENV || 'development' }.local`});

/*
    PORT = Port for our api,
    NODE_ENV = Enviroment of the api,
    DB_URI = Location of our MongoDB,
    JWT_SECRET = Our token for keep track of user sessions,
    JWT_EXPIRES_IN = When the token expires,
    ARCJET_KEY = ARCJET api key,
    ARCJET_ENV = ARCJET environment
*/

export const { 
    PORT,
    NODE_ENV,
    DB_URI,
    JWT_SECRET,JWT_EXPIRES_IN,
    ARCJET_KEY,ARCJET_ENV,
    QSTASH_URL,QSTASH_TOKEN,
    QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY
} = process.env;
