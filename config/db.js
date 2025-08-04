const mongoose = require('mongoose');
const URI = ('mongodb://localhost:27017/practice-user-data');
const connectDB = async(req, reply)=>{
    try {
        await mongoose.connect(URI);
        console.log('db connected successfully. ')
    } catch (error) {
        console.error('Db connection failed.')
    }
}

module.exports = connectDB;