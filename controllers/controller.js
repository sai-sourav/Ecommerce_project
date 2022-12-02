const Product = require('../models/product');
const Cart = require('../models/cart');
const Items_Per_page = 2;

exports.getproducts = async (req, res, next) => {
    try{
        const page = parseInt(req.query.page);
        let count = await Product.count();
        let products = await Product.findAll({ offset: (page - 1) * Items_Per_page, limit: Items_Per_page });
        res.status(200).json(
            {
                products : products,
                currentpage : page,
                hasnextpage : Items_Per_page*page < count,
                haspreviouspage : page > 1,
                nextpage : page + 1,
                previouspage : page - 1,
                lastpage : Math.ceil(count / Items_Per_page)
            }
        );
    } catch(err) {
        if(err){
            res.status(500).json({error : err});
        }
    }
}

exports.getcartproducts = async (req, res, next) => {
    try{
        const page = parseInt(req.query.page);
        const count = await Cart.count();
        let cartproducts = await Cart.findAll({ offset: (page - 1) * Items_Per_page, limit: Items_Per_page });
        res.status(200).json({
            products : cartproducts,
            currentpage : page,
            hasnextpage : Items_Per_page*page < count,
            haspreviouspage : page > 1,
            nextpage : page + 1,
            previouspage : page - 1,
            lastpage : Math.ceil(count / Items_Per_page)
        });
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

// exports.productscount = async (req,res,next) => {
//     try{
//         const count = await Product.count();
//         const pages = Math.ceil(count/Items_Per_page);
//         res.status(200).json({count : pages});
//     } catch(err) {
//         if(err){
//             res.status(500).json({error : err});
//         }
//     }
     
// }

// exports.cartproductscount = async (req,res,next) => {

//     try{
//         const count = await Cart.count();
//         const pages = Math.ceil(count/Items_Per_page);
//         res.status(200).json({count : pages});
//     } catch(err) {
//         if(err){
//             res.status(500).json({error : err});
//         }
//     }
     
// }