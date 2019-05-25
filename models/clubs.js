const mongoose = require('mongoose');
const clubNames = mongoose.Schema({
	
		name: {type:String, default:''},
		category: {type:String, default:''},
		image: {type:String, default:'default.png'},
		fans: [{
			userName: {type:String, default:''},
			email: {type:String, default:''},


		}]

});

module.exports = mongoose.model('Club', clubNames);
