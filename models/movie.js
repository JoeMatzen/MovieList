var mongoose = require("mongoose");


//Schema
var movieSchema = new mongoose.Schema({
	name: String,
	image: String,
	rating: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
        	ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Movie", movieSchema);