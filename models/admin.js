const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const adminSchema = new mongoose.Schema({
    mostPopular2:{
        type: String,
        required: false
    },
    dataReceived:{
        type: Object,
        required: true,
        contentType: String
    },
    enterprise:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
});

var Admin = mongoose.model("admin_package", adminSchema);
module.exports = Admin;