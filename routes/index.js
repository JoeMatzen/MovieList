var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var request = require('request');
router.get("/", function(req, res)
	   {
	res.render("landing");
});




//============== AUTH ROUTES =====================

router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);

			return res.render("register");
		}else{
		
		//logs the user in
		passport.authenticate("local")(req, res, function(){
					
			req.flash("success", "Welcome to MovieList " + user.username);

			res.redirect("/movies");
		});
		}
	});
});

//login routes
router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/movies",
	failureRedirect: "/login"
	}), function(req, res){
	
});


//logging user out
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out");
	res.redirect("/movies");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else {
		req.flash("error", "Please log-in first");
		res.redirect("/login");
	}
}
//move api discover listing route
router.get("/discover", function(req, res)
{
	
	var url = "https://api.themoviedb.org/3/discover/movie?api_key=d36940b464374d14ee5181badd715761&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1";
	request(url, function(error, response, body){
		if(!error){
			var data = JSON.parse(body);
			res.render("results", {data: data});
		}
	});
});

module.exports = router;