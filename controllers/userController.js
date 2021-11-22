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