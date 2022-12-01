const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminroute = require('./routes/adminroute');
const cartroute = require('./routes/cart');
const sequelize = require('./util/database');

const Product = require('./models/product');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(cartroute);
app.use(adminroute);

sequelize
.sync()
// .sync({force : true})
.then(result => {
    return Product.findAll();
})
.then(products => {
    if(products.length < 6){
        return Product.bulkCreate([
            {
                title: "Album 1",
                price: 20,
                imageUrl: "https://images.unsplash.com/photo-1669024995663-2bf01abdb38c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                title: "Album 2",
                price: 50,
                imageUrl: "https://plus.unsplash.com/premium_photo-1669047392991-8e821a4d50fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=775&q=80"
            },
            {
                title: "Album 3",
                price: 25,
                imageUrl: "https://images.unsplash.com/photo-1668850177027-b13821929543?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                title: "Album 4",
                price: 52,
                imageUrl: "https://images.unsplash.com/photo-1668913261998-254e4280ef06?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            },
            {
                title: "T-Shirt",
                price: 19.99,
                imageUrl: "https://pbx2-pbww-prod-pbww-cdn.getprintbox.com/media/productimage/fe050866-8169-4645-ad76-10437425291c/Blank%20T-Shirt_thumb_900x900"
            },
            {
                title: "Coffee Cup",
                price: 6.99,
                imageUrl: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1184&q=80"
            }
        ]);
    }
    return products;
})
.then(products => {
    app.listen(4000);
})
.catch(err => {
    console.log("error at sync:",err)
})
