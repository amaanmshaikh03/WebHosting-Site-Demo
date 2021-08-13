const exp = require("express");
const app = exp();
const router = exp.Router();
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

router.get("/",(req,res, next) => {
    if(req.session.logInStatus){
        res.render("main", {
            logInStatus: req.session.logInStatus,
            loginAdmin: req.session.loginAdmin,
            user: req.session.user
        });
    }else{
        res.render("main");
    }
});
module.exports = router;