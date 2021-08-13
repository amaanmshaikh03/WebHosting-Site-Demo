const mongoose = require('mongoose');
const config = require('config');
const uri = config.get('mongoURI');

const connectDB = async () => {
    try{
        await mongoose.connect(uri, {
            useUnifiedTopology:true,
            useNewUrlParser: true,
        });
        
        console.log("connected to MongoDB!!!");
    }catch(error){
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;