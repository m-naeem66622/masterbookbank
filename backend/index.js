require("dotenv").config();
const connectToMongo = require("./database/db");
const express = require("express");
const cors = require("cors");

connectToMongo();

// Server Setup
const app = express();
const domain = process.env.DOMAIN || "http://localhost";
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Available Routes
app.use("/api/book", require("./routes/book"));
app.use("/api/auth", require("./routes/admin"));
app.use("/api/auth", require("./routes/user"));
app.use("/api/order", require("./routes/order"));
app.use("/api/coupon", require("./routes/coupon"));

app.get("/", (req, res) => {
    res.send("Hello From Server");
});

// Start Server
app.listen(port, () => {
    console.log("Server is listening at ", domain + ":" + port);
});
