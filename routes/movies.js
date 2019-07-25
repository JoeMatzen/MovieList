var express = require("express");
var router = express.Router();
var Movie = require("../models/movie");


router.get("/", function(req, res)
{
	//get all campgrounds from db
	Movie.find({},function(err, allMovies){
	if(err){
		console.log("Something went wrong");
	}else
	res.render("movies/index", {movies: allMovies, currentUser: req.user});
	});
	
	
});

router.post("/", isLoggedIn, function(req, res)
{
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newMovie = {name: name, image: image, description: desc, author: author};
	//create new campground and save to database
	Movie.create(newMovie, function(err,newlyCreated){
		if(err){
			console.log(err);
		}else {
			res.redirect("/movies");
		}
	});
	
	
});

router.get("/new", isLoggedIn, function(req, res)
{
	
	res.render("movies/new.ejs");
});

//SHOW: shows more info about campground
router.get("/:id", function(req, res)
{
	
	Movie.findById(req.params.id).populate("comments").exec( function(err, foundMovie){
		if(err){
			console.log(err);
		}else {
			//find campground with privded id and show more info
			res.render("movies/show", {movie: foundMovie});
		}
	});
	
});

//EDIT
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
	
	
			Movie.findById(req.params.id, function(err, foundMovies){
			
				res.render("movies/edit", {movie: foundMovies});

			

	});
	

});
//UPDATE
router.put("/:id", checkCampgroundOwnership, function(req, res){
	Movie.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
			res.redirect("/movies/" + req.params.id);
		});
});

//DESTROY
router.delete("/:id", checkCampgroundOwnership, function(req, res){
	
	Movie.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/movies");
		}else{
			res.redirect("/movies");
		}
		
	});
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else {
		req.flash("error", "Please log-in first");
		res.redirect("/login");
	}
}

function checkCampgroundOwnership(req, res, next){
	if(req.isAuthenticated()){
			Movie.findById(req.params.id, function(err, foundMovie){
			if(foundMovie.author.id.equals(req.user._id)){
				next();

			}else {
				req.flash("error", "You dont have permission to do that");
				res.redirect("back");
			}

	});
	}else {
		req.flash("error", "Please log-in first");
		res.redirect("back");
	}
}

module.exports = router;