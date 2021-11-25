const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync")
const jwt = require("jsonwebtoken")
const AppError = require("./../utils/appError")
const {promisify} = require("util")

const signToken = id =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync(async (req,res,next)=>{
    const newUser = await User.create({
        name:req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    console.log(process.env.JWT_SECRET)
    console.log(process.env.JWT_EXPIRES_IN)

    const token = signToken(newUser._id)
    
    

    res.status(201).json({
        status: "success",
        token,
        data:{
            user: newUser
        }
    })
})

exports.signin = catchAsync(async (req,res,next) =>{
    const {email, password} = req.body;

    // Check if email and pass exist
    if(!email || !password){
        return next(new AppError("Please provide email and password"))

    }

    // Check if user exists and pass is correct
    const user = await User.findOne({email}).select("+password")
    //const correct = await user.correctPasswrod(password, user.password);

    if(!user || !( await user.correctPassword(password, user.password))){
        return next(new AppError("Incorrect email or password", 401))
    }

    const token = signToken(user._id);
    res.status(200).json({
        status: "success",
        token
    })
})

exports.protect = catchAsync(async(req,res,next)=>{
    // Getting token and check if it's there
    let token =""
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }
    if(!token){
        return next(new AppError("Please log in you account",401))
    }

    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log("stop")


    // Check if  user still exists
    const freshUser = await User.findById(decoded.id);
    if(!freshUser){
        return next(new AppError("The user belongig to this token no longer exists"))
    }

    // Check if user changed password after token was issued
    if(freshUser.changedPasswordAfter(decoded.iat)){
        //check if it's work. If there is problem it might be with the format of the date
        return next(new AppError("You changed you pass recently. Please log in again",401))
    }

    req.user = freshUser;
    next()
})


