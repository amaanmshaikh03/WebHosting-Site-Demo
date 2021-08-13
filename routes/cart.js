const exp = require("express");
const router = exp.Router();
const app = exp();
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const MemoryStore = require('memorystore')(session);
const methodOverride = require('method-override');
const initializePassport = require('../config/passport-config');

initializePassport(
    passport,
    firstName => User.find(user => user.firstName === firstName),
    email => User.find(user => user.email === email),
    id => User.find(user => user.id === id)
);

app.use(bodyParser.urlencoded({extended:false}));
app.use(flash());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    cookie:{maxAge: 86400000}
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(exp.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(exp.static("../views"));

const Product = require('../models/admin');
const Cart = require('../models/addCart');

router.get("/", (req,res) => {
    if(req.session.logInStatus){
        if(!req.session.cart){
            return res.render('cart', {
                layout: 'req_cart',
                products: null,
                logInStatus: req.session.logInStatus,
                loginAdmin: req.session.loginAdmin,
                user: req.session.user
            });
        }
        var cart = new Cart(req.session.cart);
        return res.render('cart', {
            layout: 'req_cart',
            products: cart.generateArray(),
            title: req.session.cart['enterprise'],
            description: req.session.cart['description'],
            price: req.session.cart['price'],
            id: req.session.cart['_id'],
            logInStatus: req.session.logInStatus,
            loginAdmin: req.session.loginAdmin,
            user: req.session.user,
            cart: req.session.cart
        });
    }else{
        res.redirect("/login");
    }   
});

router.get('/:id', (req,res) => {
    if(req.session.logInStatus){
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product){
        if(err){
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = product;
        res.redirect('/cart');
    });
    }else{
        res.redirect("/login");
    }
});

router.get('/delete-cart/:id',(req,res) => {
    if(req.session.logInStatus){
        const productId = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.removeItem(productId);
        req.session.cart = cart;
        res.redirect('/cart');
    }else{
        res.redirect("/login");
    }      
}); 

module.exports = router;