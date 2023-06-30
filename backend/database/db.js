require("dotenv").config();
const mongoose = require("mongoose");
const mongooseURI = "mongodb://127.0.0.1:27017/" + process.env.DB_NAME;
// const mongooseURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.CLUSTER_NAME}.wrl8nah.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.set("strictQuery", true);

const connectToMongo = () => {
    mongoose
        .connect(mongooseURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("MongoDB Connected"))
        .catch((error) => console.log(error));
};

module.exports = connectToMongo;
