const exp = require("express");
const router = exp.Router();
const app = exp();
const bodyParser = require("body-parser");
const Admin = require('../models/admin');
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const MemoryStore = require('memorystore')(session);
const methodOverride = require('method-override');
const initializePassport = require('../config/passport-config');

const mongoClient = require('mongodb').MongoClient;
const config = require('config');
const { ObjectID } = require("mongodb");
const url = config.get('mongoURI');
const options = {useUnifiedTopology:true};

initializePassport(
    passport,
    firstName => User.find(user => user.firstName === firstName),
    email => User.find(user => user.email === email),
    id => User.find(user => user.id === id)
);

app.use(bodyParser.urlencoded({extended:false}));
app.use(exp.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(exp.static("../views"));

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

router.get("/", (req,res,next) => {

    Admin.find().lean()
    .then(admin => {
        if(admin){
            res.locals.admin = admin;
            req.session.logInStatus;
            const admins = res.locals.admin;
            
            for(let i=0; i<admin; i++){
                if(mostPopular2 == undefined){
                    mostPopular2 == null
                }else{
                    var mostPopular2 = admins[i].mostPopular2;
                }
                var dataReceived = admins[i].dataReceived;
                var enterprise = admins[i].enterprise;
                var description = admins[i].description;
                var price = admins[i].price;
            }
            return res.render("plan", {
                layout: 'req_plan',
                logInStatus: req.session.logInStatus,
                loginAdmin: req.session.loginAdmin,
                admins, mostPopular2, dataReceived, enterprise, description, price
            });
        }else{
            next();
        }
    }).catch(err => {
        console.log(`error: ${err.message}`);
        next(err);
    });
    
});

module.exports = router;