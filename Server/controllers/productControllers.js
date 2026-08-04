const Product = require('../models/product');
const mongoose = require('mongoose');



const createProduct = async (req, res) => {
    try{

        const {name, description, price, image, category, countInStock} = req.body;
        let imagePaths = [];

            if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => `/uploads/${file.filename}`);
            } 
            else if (req.file) {
            imagePaths.push(`/uploads/${req.file.filename}`);
            }
            else if (image) {
            imagePaths = Array.isArray(image) ? image : [image];
        }
    
        const newProduct = new Product ({
            name,
            description,
            price,
            image: imagePaths,
            category,
            countInStock
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({message:"Error creating Product",error:error.message});
    }
};

const getProductById = async (req, res) => {
    console.log("Being called with ID:", req.params.id); // Debugging log'
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message:"Invalid product ID format"});
        }
        const foundProduct = await Product.findById(id);
        if (foundProduct) {
            res.json(foundProduct);
        } else {
            res.status(404).json({message:"Product not found"});
        }
    } catch (error) {
        res.status(500).json({message:"Error fetching product",error:error.message});
    }
};

const createProductReview = async(req,res) =>{
    const{ rating,comment,name }= req.body; 
    const { id } = req.params;
    
    try {
    
    const product = await Product.findById(id);
    
    if (!product) {
        return res.status(404).json({message:'Product not found'});
    }
   // const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    //if (alreadyReviewed) {
    //    return res.status(400).json({message:'You have already reviewed this product'});
   // }
   if(!product.reviews|| !Array.isArray(product.reviews)){
        product.reviews = [];
    }

    if(product){
        const review ={
            name:name||"Anonymous Client",
            rating: Number(rating),
            comment: comment || "",
            createdAt: new Date(),
        };
    
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc,item)=> item.rating + acc,0)/product.reviews.length;

        await product.save();

        res.status(201).json({message:'Review added'});
    }else{
       return res.status(404).json({message:'Product not found'});
    }
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({message:"Error adding review",error:error.message});
    }

};
module.exports = { createProduct, getProductById, createProductReview };