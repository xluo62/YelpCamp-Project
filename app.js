var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");



var commentRoutes = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

//connect mongoose
mongoose.connect("mongodb+srv://luoxi701:Sss999xxx~@cluster0-dasza.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true , useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();
app.locals.moment = require('moment');
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"yeah yeah yeah yeah",
    resave: false,
    saveUninitialized: false
}));
//!!!!!顺序很重要！！！
app.use(passport.initialize());
app.use(passport.session());

//for this local strategy, we use this authenticate methods
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundsRoutes);

 

app.listen("0.0.0.0", function(){
    console.log("Server Is ON!");
});

