const mongoose =
require("mongoose");

const playerSchema =

new mongoose.Schema({

    teamName:{
        type:String
    },

    score:{
        type:Number,
        default:0
    },

    warnings:{
        type:Number,
        default:0
    },

    levelsCompleted:{
        type:Number,
        default:0
    },

    totalTime:{
        type:Number,
        default:0
    }

});

module.exports =

mongoose.model(
    "Player",
    playerSchema
);