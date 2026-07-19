const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    customerName: {type: String, required:true},
    customerEmail:{ type: String, required:true},
    orderItems:[
        {
            name:{type:String, required:true },
            price:{type:String, required:true},
            product:{type:mongoose.Schema.Types.ObjectId, ref:'product',required:true }
        }
    ],
    totalPrice:{ type: Number, required:true},
    isReady:{ type:Boolean,default:false},
    createdAt: { type: Date, default: Date.now }
},{timestamps:true});

module.exports=mongoose.model('Order',orderSchema);