const express = require("express");
const morgan = require("morgan")
const AppError = require("./utils/appError")
const app = express();
const globalErrorHanlder = require("./controllers/errorController")
const rateLimit = require("express-rate-limit") // prevents brute force attacks
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");


// Set security HTTP headers
app.use(helmet())

if(process.env.NODE_ENV === "dev"){
    app.use(morgan("dev"))  // consoles the info about the request
}

// Limit requrests from Same IP
const limiter = rateLimit({
    max:100,
    windowMs: 60*60*1000,
    message: "Too many requrests from this IP "
})
app.use("/api", limiter)


// Body parser, reading data from body into req.body
app.use(express.json({limit: "10kb"})); // the data from the body is added to the req; that is middleware

// Data sanitization agains noSQL query injection
app.use(mongoSanitize());

// Data sanitization agains XSS
app.use(xss());

// Prevent parameter polution
app.use(hpp({
    whitelist: ["duration"]
}))

const groupRouter = require("./routes/groupRoutes")
const userRouter = require("./routes/userRoutes")
const postRouter = require("./routes/postRoutes")

app.use("/api/groups", groupRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter)

app.all("*",(req,res,next) =>{
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
    // if next(recieves parameter it will know automatically that it's an error)
    // then it will skip all other error middlewares and go to the middleware below
})


// by defining 4 parameters node express knows that this is an error middleware
app.use(globalErrorHanlder)


module.exports = app;