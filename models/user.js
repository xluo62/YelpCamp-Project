var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
//declare db schema
var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
//create the db model Convention is capitalized word
module.exports = mongoose.model("User", userSchema);