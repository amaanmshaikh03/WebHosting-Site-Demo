const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const {check, validationResult, body} = require("express-validator");
const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");

const flash = require("express-flash");
const session = require("express-session");
const MemoryStore = require('memorystore')(session);

const methodOverride = require('method-override');

const urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.use(flash());
app.use(session({
    //secret: process.env.SESSION_SECRET,
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    cookie:{maxAge: 86400000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


router.get("/", (req,res) => {
    if(!req.session.logInStatus){
        res.render("login", {
            layout: "req_login"
        });
    }else{
        res.redirect("/");
    }
});

// router.post("/", checkNotAuthenticated, passport.authenticate('local', {
//     successRedirect: "clientPage",
//     failureRedirect: '/',
//     failureFlash: true
// }))

router.post("/", 
checkNotAuthenticated, 
urlencodedParser,[
    check('email')
        .not().isEmpty().withMessage('Please enter email'),
    check('password')
        .not().isEmpty().withMessage('please enter password')
],
(req,res)=>{

    const error = validationResult(req);

    if(!error.isEmpty()){
        const alert = error.array()
        res.render('login', {
            alert,
            layout:'req_login'
        })
       }else{

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if(!user){
                return res.render('login', {
                    layout: 'req_login',
                    emails: "NO USER FOUND"
                });
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        const payload = {
                            id: user.id,
                            name: user.name
                        };
                        jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err,token)=>{
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            });
                        });
                      
                        if(user.roles == 0){
                            req.session.logInStatus = true;
                            req.session.user = user;
                            res.redirect('clientPage');
                        }else{
                            req.session.loginAdmin = true;
                            req.session.logInStatus = true;
                            req.session.user = user;
                            res.redirect('adminPage');
                        }

                    }else{
                        return res.render('login', {
                            layout: 'req_login',
                            passwords: "Password doesnt matches with the one entered"
                        });
                    } 
                });
        });
       }
});

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
  }
  
  function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
  }

module.exports = router;
 