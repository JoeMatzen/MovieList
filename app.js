var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Movie = require("./models/movie");
var Comment = require("./models/comment");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var commentRoutes = require("./routes/comments");
var movieRoutes = require("./routes/movies");
var indexRoutes = require("./routes/index");
var request = require('request');
var seedDB = require("./seeds");
var mongoose = require("mongoose");

//mongoAtlas setup
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb+srv://acereca21:1234567890@cluster0-9xl6g.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("Error", err.message);
	
});


app.use(flash());
//passport config
app.use(require("express-session")({
	secret: "catdog",
	resave: false,
	saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//end passport config--------------------------------

app.use(methodOverride("_method"));
//seedDB();
// mongoose.set('useNewUrlParser', true);
// mongoose.connect("mongodb://localhost/movie_watchlist");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.use(commentRoutes);
app.use("/movies", movieRoutes);
app.use(indexRoutes);




app.listen(3000, process.env.IP, function(){
	console.log("Movie-Watchlist app has Started");
});