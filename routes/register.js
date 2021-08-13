const exp = require("express");
const app = exp();
const User = require("../models/user");
const router = exp.Router();
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const { check, validationResult, body } = require("express-validator");
const jwt = require('jsonwebtoken');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(exp.static(__dirname + "/public"));

router.get("/", checkNotAuthenticated, (req, res) => {
  res.render("register", {
    layout: "req_register",
  });
});

router.post("/", 
checkNotAuthenticated,
urlencodedParser,
  [
    check("email")
      .isEmail()
      .withMessage("Email is required")
      .normalizeEmail()
      .withMessage("Email form should be xxx@xxx.com")
      .custom(async function(value){
        var user = await User.find({email: value})
        return user.length==0;
      })
      .withMessage("Email already exist"),
    check("firstName", "Please enter your first name")
      .exists()
      .trim()
      .escape()
      .not()
      .isEmpty(),
    check("lastName", "Please enter your last name")
      .exists()
      .trim()
      .not()
      .isEmpty(),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches("[0-9]")
      .withMessage("Password Must Contain a Number")
      .matches("[A-Z]")
      .withMessage("Password Must Contain an Uppercase Letter")
      .custom((value, { req, loc, path }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Passwords do not match");
        } else {
          return value;
        }
      }),
  ], 

(req,res)=>{

  const errors = validationResult(req);

  var info = req.body;

  var firstName = info.firstName;
  var lastName = info.lastName;
  var email = info.email;
  var phone = info.phone;
  var company = info.company;
  var streetAddress = info.streetAddress;
  var streetAddress2 = info.streetAddress2;
  var city = info.city;
  var state = info.state;
  var postCode = info.postCode;
  var tax = info.tax;
  var password = info.password;
  var confirmPassword = info.confirmPassword;
  var checkBox = info.checkBox;

  if(!errors.isEmpty()){
    const alerts = errors.array()
    res.render('register', {
        alerts,
        firstName, lastName, email, phone, company, streetAddress, streetAddress2,
        city, state, postCode, tax, password, confirmPassword,checkBox,
        layout:'req_register'
    })
   }else{

    User.findOne({email: req.body.email})
    .then(user=>{
      if(user){
        return res.render('register', {
          layout: 'req_register',
          firstName, lastName, email, phone, company, streetAddress, streetAddress2,
          city, state, postCode, tax, password, confirmPassword,checkBox,
          emails: "Email already used"
        });
      }else{
        const newUser = new User({
          id: Date.now().toString,
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          company: req.body.company,
          streetAddress: req.body.streetAddress,
          streetAddress2: req.body.streetAddress2,
          city: req.body.city,
          state: req.body.state,
          postCode: req.body.postCode,
          tax: req.body.tax,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword,
          checkBox: req.body.checkBox
        });

        bcrypt.genSalt(12, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err) throw err;
            
            newUser.password = hash;

          });
          bcrypt.hash(newUser.confirmPassword, salt, (err, hash2)=>{
            if(err) throw err;
            
            newUser.confirmPassword = hash2;

            newUser.save();

            //===============
            const payload = {
              user:{
                id: newUser.id,
              },
            };
            jwt.sign(
              payload,
              "jwtSecret",
              {expiresIn: "1h"},
              (err, token) => {
                if(err) throw err;
                  res.render('register_success',{
                    user: firstName,
                    layout:'req_register_success'
                });
              }
            );
      
          });
        });
      }
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
