const mongoose =
require("mongoose");

const questionSchema =
new mongoose.Schema({

    level:{
        type:Number
    },

    subject:{
        type:String,
        default:""
    },

    question:{
        type:String,
        default:""
    },

    clue:{
        type:String,
        default:""
    },

    options:{
        type:[String],
        default:[]
    },

    answer:{
        type:String,
        default:""
    }
});

module.exports =
mongoose.model(
    "Question",
    questionSchema
);