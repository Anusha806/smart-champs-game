const mongoose =
require("mongoose");

const playerQuestionSetSchema =

new mongoose.Schema({

    teamName:{
        type:String,
        required:true
    },

    level1:[
        Object
    ],

    level2:[
        Object
    ],

    level4:[
        Object
    ],

    level7:[
        Object
    ],

    level8:[
        Object
    ]

});

module.exports =

mongoose.model(

    "PlayerQuestionSet",

    playerQuestionSetSchema
);