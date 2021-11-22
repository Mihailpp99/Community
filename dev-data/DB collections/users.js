let mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: [true, "Полето име е задължателно"],
        maxlength:[20, "Името не трябва да е повече от 20 символа"]
    },
    lastName:{
        type:String,
        required: [true, "Полето фамилия е задължателно"],
        maxlength:[20, "Фамилията не трябва да е повече от 20 символа"]
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    image:{
        type:String
    },

})



