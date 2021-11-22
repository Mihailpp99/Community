let mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Полето име е задължателно"],
        maxlength:[20, "Името не трябва да е повече от 20 символа"]
    },
    type:{
        type:String,
        required: [true, "Полето фамилия е задължателно"],
        maxlength:[20, "Фамилията не трябва да е повече от 20 символа"],
        enum:{
            values: ["Class", "Club","Community"],
            message: ""
        }
    },
    participants:{
        
    },
    password: {
        type:String,
        required:true
    },
    image:{
        type:String
    },

})