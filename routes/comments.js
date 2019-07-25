var express = require("express");
var router = express.Router();
var Movie = require("../models/movie");
var Comment = require("../models/comment");



//=========== Comment Routes ==============
router.get("/movies/:id/comments/new", isLoggedIn, function(req, res){
	Movie.findById(req.params.id, function(err,movie){
		res.render("comments/new", {movie: movie});
	});
	
});

router.post("/movies/:id/comments", isLoggedIn, function(req, res){
	//look up campground by id
	Movie.findById(req.params.id, function(err,movie){
		Comment.create(req.body.comment, function(err, comment){
			//add username and id to comment
			comment.author.id = req.user._id;
			comment.author.username = req.user.username;
			//save comment
			comment.save();
			
			movie.comments.push(comment);
			movie.save();
			req.flash("success", "Comment successfully added!");

			res.redirect("/movies/" + movie._id);
		});
		
		
		
	});
	
});
//EDIT ROUTE
router.get("/movies/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
	
	Comment.findById(req.params.comment_id, function(err, foundComments){
		res.render("comments/edit", {movie_id: req.params.id, comment: foundComments});

	});
});
//Update route
router.put("/movies/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
		Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
			res.redirect("/movies/" + req.params.id);
		});
});

//DESTROY Route
router.delete("/movies/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
		Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment was deleted");

			res.redirect("back");
		}
		
	});
});

function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
			if(foundComment.author.id.equals(req.user._id)){
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


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else {
		req.flash("error", "Please log-in first");
		res.redirect("/login");
	}
}

module.exports = router;