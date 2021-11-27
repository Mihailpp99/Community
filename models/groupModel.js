const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "The group must have a name"],
        unique: [true, "This name already exists"]
    },
    description:{
        type:String,
        required:[true, "The group must have a description"],
        minlength:[5, "The minimum length of the desription is 5"]
    },
    image:String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    members:[
        {type: mongoose.Schema.ObjectId,
        ref: "User", required: [true, "The group must have a user"]}
    ]
    // }
    // {
    //     toJSON:{virtuals:true},
    //     toObject:{virtuals:true}
    // }
})

// tourScehma.virtual("virtualPro").get(function(){
//     return this.name / 8;
// })
const Group = mongoose.model("Group", groupSchema)

module.exports = Group;