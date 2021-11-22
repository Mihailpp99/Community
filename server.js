const mongoose = require("mongoose");
const dotenv = require("dotenv")  // with this you can use global variables
dotenv.config({path: "./config.env"})
const app = require("./app")

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
    useUnifiedTopology: true
}).then(con=>{
    console.log("DB connected")
})



const port = process.env.PORT;
app.listen(port, ()=>{
    console.log("The App is running")
})

