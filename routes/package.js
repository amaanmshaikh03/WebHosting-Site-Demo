const exp = require("express");
const router = exp.Router();
const app = exp();
const bodyParser = require("body-parser");
const Admin = require('../models/admin')
const multer = require('multer');
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
app.use(bodyParser.urlencoded({extended:false}));
app.use(exp.static(__dirname + "/public"));
app.use(bodyParser.json());

var data = multer.diskStorage({
    destination: "./public/img/package",
    filename: (req, file, cb) => {
        cb(null, Date.now()+path.extname(file.originalname));
    }
});

var upload = multer({storage:data});
app.use(exp.static("../views"));

router.get("/", (req,res) => {
    if(req.session.loginAdmin){
        res.render("package",{
            layout: "req_package",
            logInStatus: req.session.logInStatus,
            loginAdmin: req.session.loginAdmin,
            user: req.session.user
        });
    }else{
        res.render("main",{
            logInStatus: req.session.logInStatus,
            loginAdmin: req.session.loginAdmin,
        });
    }
});

router.post("/", upload.single("profile_pt"),(req,res) => {

    var formData = req.body;
    var formFile = req.file;

    Admin.findOne({enterprise: req.body.enterprise})
    .then(admin => {
        if(!admin){
            const newAdmin = new Admin({
                id: Date.now().toString,
                mostPopular2: req.body.mostPopular2,
                dataReceived:"../img/package/" + formFile.filename + "",
                enterprise: req.body.enterprise,
                description: req.body.description,
                price: req.body.price
            });

            newAdmin.save();

            req.session.logInStatus = true;
            req.session.loginAdmin = true;
            req.body.newAdmin = true;
    
            return res.redirect('plan');

        }else{
            req.session.logInStatus = true;
            req.session.loginAdmin = true;
            return res.render('package',{
                layout:'req_package',
                logInStatus: req.session.logInStatus,
                loginAdmin: req.session.loginAdmin,
                error: "You check all information again"
            });
        }
    }).catch(errors => {
        console.log(errors.message);
    })
});

module.exports = router;