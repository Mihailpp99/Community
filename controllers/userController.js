const AppError = require("./../utils/appError")
const catchAsync = require("../utils/catchAsync")
const User = require("./../models/userModel");


const filterObj = (obj, ...allowedFields) =>{
   const newObj = {};
   
    Object.keys(obj).forEach(el =>{
        if(allowedFields.includes(el)) newObj[el]= obj[el]
    })
    return newObj;
}

exports.deleteMe = catchAsync(async (req,res,next) =>{
    await User.findByIdAndUpdate(req.user.id, {active:false})

    res.status(204).json({
        status: "success",
        data: null
        
    })
})


exports.updateMe = catchAsync(async (req,res,next) =>{
    // create error if user POSTs password Data
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError("This route is not for updating password",400))
    }

    // update user document
    const filteredBody = filterObj(req.body, "name", "email")
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })


    res.status(200).json({
        status: "sucess",
        data:{
            user: updateUser
        }
    })

})


exports.createUser = (req,res)=>{
    res.status(200).json({
        status: "success",
        data: `User with with: ${req.body.name} was created`
    }
    )
}

exports.getAllUsers =(req,res)=>{
    res.status(200).json({
        status: "success",
        data: "all users"
    }
    )
}

exports.getUser= (req,res)=>{
    res.status(200).json({
        status: "success",
        data: `User with id: ${req.params.id}`
    }
    )
}

exports.updateUser = (req,res)=>{
    res.status(200).json({
        status: "success",
        data: `User with id was updated: ${req.params.id}`,
        changed: `the new name is: ${req.body.name}`
    }
    )
};

exports.deleteUser =(req,res)=>{
    res.status(200).json({
        status: "success",
        data: `User with id: ${req.params.id} was deleted`
    }
    )
};