require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const requestIp = require("request-ip")


const app = express();
const PORT = process.env.PORT || 8080;
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'https://vliv.app', 'https://vliv.app/', 'https://hrms.vliv.app', 'http://localhost:6003', 'http://localhost:6004', 'http://localhost:6005', 'https://hrms.vliv.app', 'https://klms.vliv.app', 'https://dms.vliv.app', 'https://pms.vliv.app', 'https://vliv.app', 'https://mercury-uat.phonepe.com', 'https://mercury-t2.phonepe.com', 'https://www.vliv.app']

app.use(cors({
    origin: function (origin, callback) {
        // Allow mobile app requests (no origin on mobile) and website requests
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
}));

app.options('*', cors());

const db = require("./model");
const userRoutes = require("./router/userRoute/user.routes");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const TryCatch = require("./utils/TryCatch");
const AppError = require("./utils/appError");
const { isAuthenticated } = require("./middleware/isAuthenticated");

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(requestIp.mw())


//routes endpoint
app.use('/api/user', userRoutes);

app.use('*', TryCatch(async (req, res, next) => {
    return next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404))
}));


//global error handler
app.use(globalErrorHandler);

//authtication function
app.use(isAuthenticated)

db.sequelize
    .sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log("Database connected successfully");
        })
    })
    .catch((err) => {
        console.error("Error syncing database:", err);
    });