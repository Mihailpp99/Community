const express = require("express");
const morgan = require("morgan")
const AppError = require("./utils/appError")
const app = express();
const globalErrorHanlder = require("./controllers/errorController")

app.use(morgan("dev"))  // consoles the info about the request
app.use(express.json()); // the data from the body is added to the req; that is middleware

const groupRouter = require("./routes/groupRoutes")
const userRouter = require("./routes/userRoutes")

app.use("/api/groups", groupRouter);
app.use("/api/users", userRouter);

app.all("*",(req,res,next) =>{
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
    // if next(recieves parameter it will know automatically that it's an error)
    // then it will skip all other error middlewares and go to the middleware below
})


// by defining 4 parameters node express knows that this is an error middleware
app.use(globalErrorHanlder)


module.exports = app;