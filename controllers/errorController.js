const AppError = require("./../utils/appError")

const handleUniqueGroupName = err =>{
    const message = `This name already exists`;
    return new AppError(message,400);
}

const handleValidationErrorDB = err =>{
    //console.log(err)
   //const errors = Object.entries(err.errors).map(el => el.message);
    console.log(err.errors.description)
    let error = JSON.stringify(err.errors.description.message)
    const message = `Invalid input data: ${error}`;
    return new AppError(message,400);
}

const handleJWTError = () =>new AppError("Invalid token, please log in again", 401)
const handleJWTExpireError = () =>new AppError("Your session expired, please log in again", 401)




const sendErrorDev = (err,res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

const sendErrorProd = (err,res)=>{
    //console.log(err.isOperational)
    if(err.isOperational){
        console.log("send Prod:  isOperational is true")
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })

    }
    else{
        //console.log(err)
        res.status(500).json({
            status: "error",
            message: err
        })
    }
}

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";


    if(process.env.NODE_ENV === "dev"){
        sendErrorDev(err,res)
    }
    else if(process.env.NODE_ENV === "prod"){
        let error = {...err};
        //console.log(err.name)
       
        if(error.name === "MongoError" && error.code === 11000) error = handleUniqueGroupName(error);
        if(err.name === "ValidationError") error = handleValidationErrorDB(error);

        if(err.name === "JsonWebTokenError") error = handleJWTError();
        if(error.name ==="TokenExpiredError") error = handleJWTExpireError();

        sendErrorProd(error,res);

    }
}