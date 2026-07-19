const express = require('express');
const multer = require('multer');
const Product = require('../models/product');
const router = express.Router();
const { createProduct, getProductById, createProductReview  } = require('../controllers/productControllers');
// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try{
        const products = await Product.find({});
        res.json(products);
    } catch(err){
        res.status(500).json({message:err.message});
    }
});
router.get('/:id', getProductById);
router.post('/add', upload.single('image'), createProduct);
router.post('/:id/reviews', createProductReview );

module.exports = router; 