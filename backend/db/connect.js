const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

dbConnection = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log('DB Connection established... Connected to MongoDB');
    } catch (error) {
        console.log('DB Error: ', error);
    }
};

module.exports = dbConnection;