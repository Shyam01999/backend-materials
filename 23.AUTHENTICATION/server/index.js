import dotenv from 'dotenv';
dotenv.config({quiet: true});
import express from 'express';
import db from "./models/index.js";
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import {createClient} from 'redis';



const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 8080;

const backendDomain = isProduction ? process.env.BACKEND_URL : `http://localhost:${PORT}`;

const redisUrl = process.env.REDIS_URL;

if(!redisUrl){
    console.log('Missing redis url');
    process.exit(1);
}

export const redisClient = createClient({
    url:redisUrl,
})

redisClient
    .connect()
    .then(() => console.log('Connected to redis'))
    .catch((error) => console.log(error))

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});


//middleware
app.use(cors());
app.use(express.json())



//routes
app.use('/api/v1', authRoutes)



//db



//server 

const startServer = async () => {
    try {
        await db.sequelize.sync({ force: false });

        app.listen(PORT, () => {
            console.log(`Server is running on ${backendDomain}`);
            console.log(`${isProduction ? 'Production' : 'Development'} database connected successfully !`)

        })
    } catch (error) {
        console.error("Error syncing database:", error.message);
        process.exit(1); // Why: Don't run server without DB
    }
};

startServer();



