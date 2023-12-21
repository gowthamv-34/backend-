const cors = require('cors');
const dotenv = require('dotenv')
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require("./routes/auth.js")

dotenv.config();
const app = express();
mongoose.set("strictQuery", false);
const connect = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("mongodb connected");
    } catch (error) {
        throw error;
    }
};
const corsOpts = {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"],
};
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type, Authorization', // Allow 'Authorization'
}));


// Handle OPTIONS requests


app.use(cors(corsOpts));
mongoose.connection.on("disconnected", () => {
    console.log("Mongodb disconnected!");
});
app.use(express.json());
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});
app.listen(5000, () => {
    connect();
    console.log("backend connected");
});