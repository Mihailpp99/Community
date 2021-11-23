const sendErrorDev = (err,res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

const sendErrorProd = (err,res)=>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })

    }
    else{
        console.log("Programming error")
        res.status(500).json({
            status: "error",
            message: "Something went very wrong"
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
        sendErrorProd(err,res);

    }



}