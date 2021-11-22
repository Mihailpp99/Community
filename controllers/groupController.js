
exports.checkId = (req,res,next,val)=>{

    if(val >10){
        res.status(200).json({
            status: "fail",
            data: `There is no group with this id ${val}`
        }
        )
    }
    next()
}

exports.createGroup = (req,res)=>{
    res.status(200).json({
        status: "success",
        data: `Post with with: ${req.body.name} was created`
    }
    )
}

exports.getAllGroups =(req,res)=>{
    res.status(200).json({
        status: "success",
        data: "all groups"
    }
    )
}

exports.getGroup = (req,res)=>{
    res.status(200).json({
        status: "success",
        data: `Post with id: ${req.params.id}`
    }
    )
}

exports.updateGroup = (req,res)=>{
    res.status(200).json({
        status: "success",
        data: `Post with id was updated: ${req.params.id}`,
        changed: `the new name is: ${req.body.name}`
    }
    )
};

exports.deleteGroup =(req,res)=>{
    res.status(200).json({
        status: "success",
        data: `Post with id: ${req.params.id} was deleted`
    }
    )
};