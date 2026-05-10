const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const playerRoutes =
require("./routes/playerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/api/players",
    playerRoutes
);

mongoose.connect(process.env.MONGO_URI)
.then(()=>{

    console.log("MongoDB Connected");

})
.catch((err)=>{

    console.log(err);
});

app.get("/",(req,res)=>{

    res.send("Smart Champs API Running");
});

const PORT =
process.env.PORT || 5000;

app.listen(PORT,()=>{

    console.log(
        `Server running on ${PORT}`
    );
});