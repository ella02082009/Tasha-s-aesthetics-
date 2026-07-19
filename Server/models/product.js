const mongoose = require('mongoose');
const reviewSchema = mongoose.Schema({
    name:{ type:String, required:true},
    rating:{ type:Number,required:true},
    comment:{ type:String, required:true},
    user:{ type: mongoose.Schema.Types.ObjectId, ref:'User', required:false}
},{ timestamps: true});
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: [{
        type: String,
        required: true,
        default: 'uploads/default.jpg'
    }],// Url from cloudinary
    category: {
        type: String,
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0
    },
    reviews:[reviewSchema],
    numReviews:{ type:Number,default:0},
    rating:{type:Number,default:0},
}, {
    timestamps: true
});
module.exports = mongoose.model('Product', productSchema);
