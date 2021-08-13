const exp = require("express");
const router = exp.Router();
const app = exp();
const bodyParser = require("body-parser");
const path = require('path');

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
    //secret: process.env.SESSION_SECRET,
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
//

app.use(bodyParser.urlencoded({extended:false}));
app.use(exp.static(__dirname + "/public"));
app.use(bodyParser.json());

app.use(exp.static("../views"));

router.get("/", (req,res) => {
    if(req.session.logInStatus){
        res.render("shopping",{
            layout: "req_shopping",
            logInStatus: req.session.logInStatus,
            loginAdmin: req.session.loginAdmin,
            cart: req.session.cart,
            id: req.session.cart["_id"],
            user: req.session.user
        });
    }else{
        res.redirect('/login');
    }
});

module.exports = router;