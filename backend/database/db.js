require("dotenv").config();
const mongoose = require("mongoose");
const mongooseURI = "mongodb://127.0.0.1:27017/" + process.env.DB;

mongoose.set("strictQuery", true);

const connectToMongo = () => {
    mongoose.connect(mongooseURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("MongoDB Connected")).catch(err => console.log(err));
}

module.exports = connectToMongo;