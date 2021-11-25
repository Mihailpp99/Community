const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt")

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
        minlength: 8,
        select: false
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

userSchema.pre("save", async function (next){
    // only run this if pass was modified
    if(!this.isModified("password")) return next();

    this.passwordConfirm = undefined;
   
    this.password =  await bcrypt.hash(this.password, 12)
    
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model("User", userSchema)

module.exports = User;


