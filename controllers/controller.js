const Product = require('../models/product');

exports.getproducts = async (req, res, next) => {
    try{
        let response = await Product.findAll();
        res.status(200).json(response);
    } catch(err) {
        if(err){
            res.status(500).json({error : err});
        }
    }
}