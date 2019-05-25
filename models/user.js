
/*module.export = function(mongoose) {
	consr userSchema = mongoose.Schema({

	})
	mongoose.model('User', userSchema)
}
User.findOne();*/

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const userSchema = mongoose.Schema({
	userName: {type: String, unique: true},
	fullname: {type: String, unique: true, default: ''},
	email: {type: String, unique: true},
	password: {type: String, unique: true, default: ''},
	userImage: {type: String, default: 'defaultPic.png'},
	facebook: {type: String, default: ''},
	fbTockens: Array,
	google: {type: String, default: ''},
	sendRequests: [{
			userName: {type: String, default: ''}
		}],
	request: [{
		userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		userName: {type: String, default: ''}
	}],
	friendsList: [{
		friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		friendName: {type: String, default: ''}
	}],
	totalRequest: {type: Number, default:0},
	gender:{type: String, default:''},
	country:{type:String, default: ''},
	about: {type: String, default:''},
	interestedStack: [{
		favTech: {type: String, default:''}

	}],
	interestedCategory: [{
		favCategory: {type: String}
	}]

	
});

userSchema.methods.encryptPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validUserPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);