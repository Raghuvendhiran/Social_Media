const express = require('express');
const app = express();
require('dotenv').config();
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors');
//Importing DB
const db = require('./db/connect');
//Establishing DB connection
db();
//Importing all routes.
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const postRoute = require("./routes/postsRoutes");

//middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);


app.get('/', (req, res) => {
    res.send("Welcome to Social Media Management Tool")
});

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`)
});