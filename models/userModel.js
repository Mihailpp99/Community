const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

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
    role:{
        type:String,
        enum: ["user", "admin"],
        default: "user"
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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active:{
        type:Boolean,
        default: true,
        select: false
    }
})

userSchema.pre("save", async function (next){
    // only run this if pass was modified
    if(!this.isModified("password")) return next();

    this.passwordConfirm = undefined;
   
    this.password =  await bcrypt.hash(this.password, 12)
    
    next()
})

userSchema.pre("save", function(next){
    if(!this.isModified("password") || this.isNew) return next()
    this.passwordChangedAt = Date.now() - 1000; // because somethimes the token is faster created
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000,10)
        console.log(this.passwordChangedAt, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}


userSchema.methods.createPasswordResetToken = function (){
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 10 *60*1000;

    return resetToken;
}

userSchema.pre(/^find/, function(next){
    // this points to the ccurrent query
    this.find({active:{$ne:false}});  // $ne not equal
    next()
})

const User = mongoose.model("User", userSchema)

module.exports = User;


