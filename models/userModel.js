const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Pleace tell us your email"]
    },
    email:{
        type:String,
        required:[true, "Pleace provide your email"],
        unique:true,
        lowercase: true,
        validator: [validator.isEmail, "Invalid Email"]
    },
    photo: String,
    password:{
        type: String,
        required:[true, "Please provide a password"],
        minlength: 8
    },
    passwordConfirm:{
        type:String,
        required:[true, "Please provide a password"],
        validate: {
            validator: function(el) {
                return el === this.password
                // "this" works here only on save()
            }, 
            message: "Passwords are not the same"
        }
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User;


