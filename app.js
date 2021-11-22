const express = require("express");
const morgan = require("morgan")

const app = express();

app.use(morgan("dev"))  // consoles the info about the request
app.use(express.json()); // the data from the body is added to the req; that is middleware

const groupRouter = require("./routes/groupRoutes")
const userRouter = require("./routes/userRoutes")


app.use((req,res,next) =>{

    next();
})
 

module.exports = app;


app.use("/api/groups", groupRouter);
app.use("/api/users", userRouter);


