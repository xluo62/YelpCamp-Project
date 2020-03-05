var mongoose = require("mongoose");

//declare db schema
var commentSchema = new mongoose.Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    }
});
//create the db model Convention is capitalized word
module.exports = mongoose.model("Comment", commentSchema);