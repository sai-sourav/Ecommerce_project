const Product = require('../models/product');
const Cart = require('../models/cart');
const Cartitem = require('../models/cartitem');
const User = require('../models/user');
const Items_Per_page = 2;

exports.getproducts = async (req, res, next) => {
    try{
        const page = parseInt(req.query.page);
        let allproducts = await req.user.getProducts();
        let count = allproducts.length;
        let products = await req.user.getProducts({ offset: (page - 1) * Items_Per_page, limit: Items_Per_page });
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
        let cart = await req.user.getCart();
        let allcartproducts = await cart.getProducts();
        const count = await allcartproducts.length;
        let cartproducts = await cart.getProducts({ offset: (page - 1) * Items_Per_page, limit: Items_Per_page });
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
    const productid = parseInt(req.body.productid);
    let newquantity = 1;
    try{
        const fetchedcart = await req.user.getCart();
        const cartproducts = await fetchedcart.getProducts({ where: { id : productid } });
        let cartproduct;
        if (cartproducts.length > 0){
        cartproduct = cartproducts[0];
        }
        if(cartproduct){
            const oldquantity = cartproduct.cartitem.quantity;
            newquantity = oldquantity + 1;
        }
        else{
            cartproduct = await Product.findByPk(productid);
        }
        const response = await fetchedcart.addProduct(cartproduct, { through: { quantity : newquantity}});
        res.status(201).json({created : response});
    } catch(err){
        if(err){
            res.status(500).json({error : err});
        }
    }  

}

exports.cartproductdelete = async (req, res, next) => {
    const productid = parseInt(req.body.productid);
    console.log("ondelete",productid);
    try{
        const fetchedcart = await req.user.getCart();
        const cartproducts = await fetchedcart.getProducts({ where: { id : productid } });
        const cartproduct = cartproducts[0];
        console.log("delete",cartproducts);
        const response = await cartproduct.cartitem.destroy();
        res.status(201).json({deleted : response});
    }catch(err){
        if(err){
            res.status(500).json({error : err});
        }
    } 
}

exports.carttoorder = async (req,res, next) => {
    try{
        const fetchedcart = await req.user.getCart();
        const cartproducts = await fetchedcart.getProducts();
        // console.log(cartproducts);
        if (cartproducts.length !== 0){
            const createdorder = await req.user.createOrder();
            for(i=0; i<cartproducts.length; i++){
                const quantity = cartproducts[i].cartitem.quantity;
                const response = await createdorder.addProduct(cartproducts[i], { through: { quantity : quantity}});
            }
            await Cartitem.destroy({where: {cartId : fetchedcart.id}});
            res.status(200).json({ orderid: createdorder.id , success : true});
        }
    }catch(err){
        if(err){
            res.status(500).json({error : err});
        }
    }
}

exports.getorders = async (req, res, next) => {
     try{
        const fetchedorders = await req.user.getOrders();
        res.status(200).json(fetchedorders);
     }
     catch(err){
        if(err){
            res.status(500).json({error : err});
        }
    }
}

exports.getorderdetails = async (req, res, next) => {
    const orderid = req.params.orderid;
    const page = parseInt(req.query.page);
    try{
        const orders = await req.user.getOrders({where: {id : orderid}});
        let order = orders[0];
        let allproducts = await order.getProducts();
        const count = await allproducts.length;
        const products = await order.getProducts({ offset: (page - 1) * Items_Per_page, limit: Items_Per_page });
        res.status(200).json({
            products : products,
            currentpage : page,
            hasnextpage : Items_Per_page*page < count,
            haspreviouspage : page > 1,
            nextpage : page + 1,
            previouspage : page - 1,
            lastpage : Math.ceil(count / Items_Per_page)
        });
    }catch(err){
        if(err){
            res.status(500).json({error : err});
        }
    }
}

exports.deleteorder = async (req, res, next) => {
    const orderid = req.params.orderid;
    try{
        const orders = await req.user.getOrders({where: {id : orderid}});
        let order = orders[0];
        const response = await order.destroy();
        res.status(200).json({deleted : response});
    }catch(err){
        if(err){
            res.status(500).json({error : err});
        }
    } 
}