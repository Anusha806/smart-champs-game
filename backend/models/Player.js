const mongoose = require("mongoose");

const playerSchema =
new mongoose.Schema({

    teamName:{
        type:String,
        required:true,
        unique:true
    },

    score:{
        type:Number,
        default:0
    },

    level:{
        type:Number,
        default:1
    },

    warnings:{
        type:Number,
        default:0
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports =
mongoose.model(
    "Player",
    playerSchema
);