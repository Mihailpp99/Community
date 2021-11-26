const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync")
const jwt = require("jsonwebtoken")
const AppError = require("./../utils/appError")
const {promisify} = require("util")
const sendEmail = require("./../utils/email")
const crypto = require("crypto");

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

exports.restrictTo = (...roles) =>{
    return (req,res,next) =>{
        //here i can use req.user, because the protect middleware created that 
        if(!roles.includes(req.user.role)) return next(new AppError("You don't have permission to do that",403))
        next();
    }
}

exports.forgotPassword = catchAsync(async(req,res,next)=>{
    //Get user based on POSTed email
    const user = await User.findOne({email:req.body.email});
    if(!user) return next(new AppArror("There is no user with this email",404))
    
    //Generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});
    
    //Send it to user's email
    
    const resetURL = `${req.protocol}://${req.get("host")}/api/users/resetPassword/${resetToken}`;
    const message = `Forgot you password? Submit a patch request with your new password and passwordConfirm to : ${resetURL}.\n If you didn't forget your password, please ignore this email!`;
    

    try{
        await sendEmail({
            email: user.email,
            subject: "Your password reset",
            message
        })

        res.status(200).json({
            status: "success",
            message:"Token sent to email"
        })
    }
    catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({validateBeforeSave:false})
        return next(new AppError("There was an error sending the email. Try again later",500))
    }

})


exports.resetPassword = catchAsync(async(req,res,next)=>{
    // get user based on token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires: {$gt:Date.now()}  // $gt is short for greater; checks if it's greater
    })

    // if token has not expired, and there is user, set the new pass
    if(!user){
        return next(new AppError("Token is invalid or expired",400))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //update cahngedPassAt property for the user


    // log the user in, send JWT
    const token = signToken(user.id);

    res.status(200).json({
        status: "success",
        token
    })


})
