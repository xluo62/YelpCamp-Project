var mongoose = require("mongoose");
const Comment = require("./comment");

//declare db schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    createdAt: { type: Date, default: Date.now},
    //reference id
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
campgroundSchema.pre('remove', async function(){
    await Comment.remove({
        _id:{
            $in: this.comments
        }
    });
});
//create the db model Convention is capitalized word
module.exports = mongoose.model("Campground", campgroundSchema);