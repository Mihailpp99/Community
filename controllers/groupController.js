const Group = require("../models/groupModel")
const User = require("../models/userModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("./../utils/appError")
const factory = require("./factoryController")

exports.checkId = (req,res,next,val)=>{

    // if(val){
    //     res.status(200).json({
    //         status: "fail",
    //         data: `There is no group with this id ${val}`
    //     }
    //     )
    // }
    next()
}

exports.createGroup = catchAsync (async (req,res,next)=>{
    
    const newGroup = await Group.create(req.body);
    const addGroup = await User.findByIdAndUpdate(req.body.members,{$push: { groups: newGroup._id}},{
        new: true,   // returns the new updated group
        runValidators: true,
        useFindAndModify: false 
    })


    res.status(200).json({
        status: "success",
        data: {
            tour:newGroup,
            user: addGroup
        }
    })
})

exports.getAllGroups = catchAsync(async (req,res,next)=>{
    const groups = await Group.find()

    res.status(200).json({
        status: "success",
        results: groups.length,
        data: {groups}
    })   
})

exports.getGroup = catchAsync (async (req,res,next)=>{
    try{
        const group = await Group.findById(req.params.id);
    }catch(err){
        return next(new AppError(`No group found with that ID`, 404))
    }

    const group = await Group.findById(req.params.id).populate({path: "members", select: "-__v"});
    

    // this if doesn't work because the await const is catched from catchAsync and the code execution for this function stops at const group
    // if(!group){
    //     return next(new AppError(`No group found with that ID`, 404))
    // }
    
    res.status(200).json({
        status: "success",
        data: {group}
    })
})

exports.updateGroup = catchAsync (async (req,res,next)=>{
    try{
        const group = await Group.findByIdAndUpdate(req.params.id, req.body,{
            new: true,   // returns the new updated group
            runValidators: true 
        })
    }catch(err){
        return next(new AppError(`No group found with that ID`, 404))
    }

    const group = await Group.findByIdAndUpdate(req.params.id, req.body,{
        new: true,   // returns the new updated group
        runValidators: true 
    })

    res.status(200).json({
        status: "success",
        data: {group}
    })
});

exports.addUser = catchAsync (async (req,res,next)=>{
    // try{
    //     const group = await Group.findByIdAndUpdate(req.params.id, {$push: { members: req.body.user }},{
    //         new: true,   // returns the new updated group
    //         runValidators: true,
    //         useFindAndModify: false 
    //     })
    // }catch(err){
    //     return next(new AppError(`No group found with that ID`, 404))
    // }

    const group = await Group.findByIdAndUpdate(req.params.id, {$push: { members: req.body.user }},{
        new: true,   // returns the new updated group
        runValidators: true,
        useFindAndModify: false 
    })
    const addGroup = await User.findByIdAndUpdate(req.body.user,{$push: { groups: req.params.id}},{
        new: true,   // returns the new updated group
        runValidators: true,
        useFindAndModify: false 
    })

    res.status(200).json({
        status: "success",
        data: {group,addGroup}
    })
});

exports.deleteGroup = factory.deleteOne(Group)