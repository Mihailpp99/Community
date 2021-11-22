const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "The group must have a name"]
    },
    description:{
        type:String,
        required:[true, "The group must have a description"]
    },
    image:String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
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