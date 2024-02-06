const mongoose = require('mongoose')

const connectDB = async () => {
    const conn = await mongoose.connect("mongodb://localhost/theorydrivingtest", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    console.log(`MongoDB connected: ${conn.connection.host}`)
}


module.exports = connectDB;








