const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, "Must have title"]
    },
    content:{
        type:String,
        required:[true,"Must have content"]
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    group:{
        type: mongoose.Schema.ObjectId,
        ref: "Group", required: [true, "The post must have a group"]
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User", required: [true, "The post must have a user"]
    }
})

const Post = mongoose.model("Post", postSchema);

module.exports= Post;

