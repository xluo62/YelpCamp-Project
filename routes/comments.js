var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//=======================
//comments routes
//Comments New
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn ,function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground: campground});
        }
    });
    

});
//Comments Create
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment is successfully added");
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    });
});


//Edit Comments
//在这里我们只需要campground的id 不需要campground的具体内容
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "No campground found, and don't tamper with ID");
            return res.redirect("back");
        }
        //call back make sure following code happens after above code.
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                console.log(err);
                res.redirect("/campgrounds/" + req.params.id);
            }else{
                res.render("comments/edit", {campground_id : req.params.id, comment: comment});
            }
        });
    });
    
    
    
});

//Update Comments
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "No campground found, and don't tamper with ID");
            return res.redirect("back");
        }
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
            if(err){
                res.redirect(back);
            }else{
                req.flash("success", "Campground is successfully updated");
                res.redirect("/campgrounds/" + req.params.id);
             }
        });
    });
    
    
});
//Destroy Comments

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership,function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "No campground found, and don't tamper with ID");
            return res.redirect("back");
        }
        Comment.findByIdAndRemove(req.params.comment_id,  function(err){
            if(err){
                res.redirect("back");
            }else{
                req.flash("success", "Campground is successfully deleted");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
    
});


// //middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkCommentOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err){
//                 res.redirect("back");
//             }else{
//                 //does user own the comment?
//                 //req.user.id is stored in req.user thanks to passport
//                 if(foundComment.author.id.equals(req.user._id)){
//                     next();
//                 }else{
//                     res.redirect("back");
//                 }
//             }
//         })
//     }else{
//         res.redirect("back");

//     }
// }

module.exports = router;