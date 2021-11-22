let mongoose = require("mongoose")

const tourSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, "A tour must have a name"],
        unique:true,
        maxlength:[40, "A tour mus have max 40 char"]
    },
    duration:{
        type:Number,
        required:[true,"A tour must have a duration"]
    },
    maxGroupSize:{
        type:Number,
        required:[true,"A tour must have a size"]
    },
    difficulty:{
        type:String,
        required:[true, "A tour must have a difficluty"],
        enum: {values: ["easy", "hard", "medium", "difficult"], message: "Diff must be easy or hard"}
    },
    ratingAverage: {
        type:Number,
        default: 4.5,
        min: [1, "Rating must be min 1"]
    },
    ratingsQuantity :{
        type:Number,
        default: 0
    },
    price: {
        type:Number,
        required:true
    },
    priceDiscount: {
        type: Number,
        validate: { 
            validator: function(val){
                // "this" works only for creating new documents
                return val < this.price;
            },
            message: "Discount {{VALUE}} show be smaller"
        }
    },
    summary:{
        type:String,
        trim: true,
        required:[true, "A tour must have a summary"]
    },
    description:{
        type: String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true, "A tour must have a imageCover"]
    },
    images:[String],
    createdAt:{
        type:Date,
        default: Date.now()
        // select: false
    },
    startDates:[Date]
});

const Tour= mongoose.model("Tour", tourSchema);

module.exports= Tour;