



process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';
if (process.env.NODE_ENV == 'production') {
    console.log("Production Mode");
  } else if (process.env.NODE_ENV == 'development') {
    console.log("Development Mode");
  }
const dotenv = require('dotenv').config();

const exp = require("express");
const handle = require("express-handlebars");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const MemoryStore = require('memorystore')(session);
const methodOverride = require('method-override');
//const MongoStore = require("connect-mongo")(session);

const path = require('path');

const routes = require('./routes');
const User = require("./models/user");

const initializePassport = require('./config/passport-config');
const { connection } = require('mongoose');
const mongoClient = require('mongodb').MongoClient;
const {mongoDbUrl} = require('./config/keys');

initializePassport(
    passport,
    firstName => User.find(user => user.firstName === firstName),
    email => User.find(user => user.email === email),
    id => User.find(user => user.id === id)
);


const app = exp();
const port = process.env.PORT || 8080;

app.use(exp.static(__dirname + "/public"));
app.use(exp.urlencoded({extended: false}));
app.use(flash());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
        checkPeriod: 86400000,
        mongoUrl: mongoDbUrl
    }),
    cookie:{maxAge: 86400000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.use('/', routes);

connectDB();

app.set("view engine", "hbs");
app.engine("hbs", handle({
    extname:"hbs", 
    defaultLayout: "index",
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    helpers:{
        speak : () => "Hi there!"
    }
}));

app.delete('/logout', (req,res) => {
    req.logOut();
    req.session.logInStatus = false;
    req.session.loginAdmin = false;
    res.redirect('/');
});

app.get("/register_success", (req, res) => {
    if(!req.session.logInStatus){
        res.render("register_success",{
            layout: 'req_register_success',
            logInStatus: req.session.logInStatus
        });
    }else{
        res.redirect("*");
    }
});

app.get("/clientPage", (req, res) => {   
    if(req.session.logInStatus){
        res.render("clientPage", {
            layout: 'req_clientPage',
            logInStatus: req.session.logInStatus,
            guest: req.session.user.roles,
            loginAdmin: req.session.loginAdmin,
            user: req.session.user
        });
    }else{
        res.redirect("login");
    }
});

app.get("/adminPage", (req,res) => {
    if(req.session.loginAdmin){
        res.render("adminPage",{
            layout: 'req_adminPage',
            logInStatus: req.session.logInStatus,
            loginAdmin: req.session.loginAdmin,
            user: req.session.user
        });
    }else{
        res.redirect("login");
    }
});

app.get("*", (req,res) => {
    res.render("notfound", {
        title: '404',
        message: 'Oops!!!',
        message2: 'Something went wrong. Please try again.',
        logInStatus: req.session.logInStatus,
        loginAdmin: req.session.loginAdmin,
        layout: 'req_notFound'
    });
});
app.listen(port);