var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/campgrounds", function(req,res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: allcampgrounds});
        }
    })
    
});

//NEW - show form to create new campground
router.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

//SHOW- shows mmore info about one campground
router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found, Please don't tamper with ID");
            res.redirect("back");
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });


    
});

//CREATE - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username : req.user.username
    };
    var campground = {
        name: name,
        price: price,
        image: image,
        description: description,
        author: author
    };
    
    Campground.create(campground, function(err, campground){
        if(err){
            console.log(err);
        }else{
            //redirect to GET request
            req.flash("success", "Campground is successfully created");
            res.redirect("campgrounds");
        }
    });
    
});


//Edit campground route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        res.render("campgrounds/edit", {campground: campground});
    });
}); 


//Update campground route

router.put("/campgrounds/:id", middleware.checkCampgroundOwnership,function(req, res){
    //find and update then redirect somewhere
    Campground.findByIdAndUpdate(req.params.id, req.body.edit, function(err, updatedCampground){
        if(err){

            res.redirect("/campgrounds");
        }else{
            req.flash("success", "Campground is successfully updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy campground route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds" + req.params.id);

        }else{
            req.flash("success", "Campground is successfully deleted");
            res.redirect("/campgrounds");
        }
    });
});
//middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkCampgroundOwnership(req, res, next) {
//     if(req.isAuthenticated()){
//            Campground.findById(req.params.id, function(err, foundCampground){
//               if(err){
//                   res.redirect("back");
//               }  else {
//                   // does user own the campground?
//                if(foundCampground.author.id.equals(req.user._id)) {
//                    next();
//                } else {
//                    res.redirect("back");
//                }
//               }
//            });
//        } else {
//            res.redirect("back");
//        }
//    }
module.exports = router;