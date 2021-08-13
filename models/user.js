const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber:{
        type: Number,
        required: false,
    },
    company: {
        type: String,
        required: false,
    },
    streetAddress:{
        type: String,
        required: false,
    },
    streetAddress2:{
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    postCode: {
        type: String,
        required: false,
    },
    tax: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    checkBox:{
        type: Array,
        required: false
    },
    roles:{
        type: Number,
        default: 0
    }
});

var User = mongoose.model("user_register", userSchema);
module.exports = User;