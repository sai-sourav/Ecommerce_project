const Product = require('../models/product');
const Cart = require('../models/cart');

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

exports.getcartproducts = async (req, res, next) => {
    try{
        let response = await Cart.findAll();
        res.status(200).json(response);
    } catch(err) {
        if(err){
            res.status(500).json({error : err});
        }
    }
}

exports.postcartproducts = async (req, res, next) => {
    try{
        console.log(req.body);
        const productid = req.body.productid;
        const productname = req.body.productname;
        const productimg = req.body.productimg;
        const productprice = req.body.productprice;
        let response = await Cart.create({
            productid : productid,
            productname: productname,
            productimg: productimg,
            productprice: productprice
        })
        res.status(201).json({created : response});
    } catch(err) {
        if(err){
            res.status(500).json({error : err});
        }
    }
}