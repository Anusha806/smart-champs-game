const mongoose =
require("mongoose");

const questionSchema =

new mongoose.Schema({

    level:{
        type:Number
    },

    type:{
        type:String
    },

    subject:{
        type:String
    },

    question:{
        type:String
    },

    options:[
        String
    ],

    answer:{
        type:String
    },

    clue:{
        type:String
    }

});

module.exports =

mongoose.model(
    "Question",
    questionSchema
);