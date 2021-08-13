const express = require('express');
const router = express.Router();

const main = require('./main.js');
const login = require('./login.js');
const register = require('./register.js');
const package = require('./package.js');
const plan = require('./plan.js');
const shopping = require('./shopping.js');
const cart = require('./cart.js')

router.use('/', main);
router.use('/login', login);
router.use('/register', register);
router.use('/package', package);
router.use('/plan', plan);
router.use('/shopping', shopping);
router.use('/cart', cart);

module.exports = router;
