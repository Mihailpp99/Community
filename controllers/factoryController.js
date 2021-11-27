const catchAsync = require("../utils/catchAsync")
const AppError = require("./../utils/appError")


exports.deleteOne = Model => catchAsync (async (req,res,next)=>{
    try{
        const model = await Model.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
            data: null
        } )
    }catch(err){
        return next(new AppError(`No result found with that ID`, 404))
    }
    // const model = await Model.findByIdAndDelete(req.params.id)

    // res.status(204).json({
    //     status: "success",
    //     data: null
    // } )

});