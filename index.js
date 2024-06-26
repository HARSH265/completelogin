const express = require("express");
const app = express();
const PORT = 8000;
const { connectMongoDB } = require("./connection");
const userRoutes = require("./routes/userRoutes");
const authenticateToken = require("./middleware/authMiddleware");


app.use(express.json());


app.use("/api/users", userRoutes);


app.get("/api/protected", authenticateToken, (req, res) => {
    res.status(200).json({ message: "This is a protected route", user: req.user });
});


const startServer = async () => {
    try {
        
        await connectMongoDB("your_mongo_db_connection_string");
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server started at port: ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
}


startServer();
