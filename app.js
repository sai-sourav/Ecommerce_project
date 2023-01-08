const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

const adminroute = require('./routes/adminroute');
const cartroute = require('./routes/cart');
const orderroute = require('./routes/orders');
const sequelize = require('./util/database');

const Product = require('./models/product');
const Cart = require('./models/cart');
const Cartitem = require('./models/cartitem');
const User = require('./models/user');
const Order = require('./models/order');
const Orderitem = require('./models/orderitem');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
})
app.use(orderroute);
app.use(cartroute);
app.use(adminroute);

app.use((req, res, next) => {
    if(req.url === '/'){
        req.url = "index.html";
    }
    res.sendFile(path.join(__dirname,`public/html/${req.url}`));
})

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasMany(Product);
User.hasMany(Order);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: Cartitem});
Product.belongsToMany(Cart, { through: Cartitem});

Order.belongsToMany(Product, { through: Orderitem});
Product.belongsToMany(Order, { through: Orderitem});

sequelize
.sync()
// .sync({force : true})
.then(result => {
    return User.findByPk(1);
})
.then(user => {
    if(!user) {
        return User.create({
            name: "sai sourav",
            emailid: "saisourav123@gmail.com",
            usertype: "admin"
        });
    }
    return user;
})
.then(async user => {
    const cart = await Cart.findByPk(1);
    if(!cart){
       return user.createCart();
    }
    return cart;
}).then( cart => {
    return Product.count();
}).then( count => {
    if (count === 0){
        Product.bulkCreate([
            {
                title: "Album 1",
                price: 20,
                imageUrl: "https://images.unsplash.com/photo-1669024995663-2bf01abdb38c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                userId: 1
            },
            {
                title: "Album 2",
                price: 50,
                imageUrl: "https://plus.unsplash.com/premium_photo-1669047392991-8e821a4d50fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=775&q=80",
                userId: 1
            },
            {
                title: "Album 3",
                price: 25,
                imageUrl: "https://images.unsplash.com/photo-1668850177027-b13821929543?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                userId: 1
            },
            {
                title: "Album 4",
                price: 52,
                imageUrl: "https://images.unsplash.com/photo-1668913261998-254e4280ef06?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                userId: 1
            },
            {
                title: "T-Shirt",
                price: 19.99,
                imageUrl: "https://pbx2-pbww-prod-pbww-cdn.getprintbox.com/media/productimage/fe050866-8169-4645-ad76-10437425291c/Blank%20T-Shirt_thumb_900x900",
                userId: 1
            },
            {
                title: "Coffee Cup",
                price: 6.99,
                imageUrl: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1184&q=80",
                userId: 1
            }
        ]);
    }
    return count;   
})
.then(count => {
    app.listen(4000);
})
.catch(err => {
    console.log("error at sync:",err)
})