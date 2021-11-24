const mongoose = require("mongoose");
const dotenv = require("dotenv")  // with this you can use global variables
dotenv.config({path: "./config.env"})
const app = require("./app")

process.on("uncaughtException", err =>{
    console.log(err.name, err.message);
    console.log("Uncaught Exception: shutting down")
    process.exit(1)

})

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
    useUnifiedTopology: true,
    autoIndex: true
}).then(con=>{
    console.log("DB connected")
})



const port = process.env.PORT;
const server = app.listen(port, ()=>{
    console.log("The App is running")
})
// mongodb+srv://mihailpp99:mihailpp99pass@cluster0.hwinv.mongodb.net/test    connect with mongo atlas



// you shouldn't rely on this for handling 
process.on("unhandledRejection", err =>{
    console.log(err.name, err.message);
    console.log("Unhandled rejections: shutting down")
    server.close(()=>{
        process.exit(1)

    })
})



