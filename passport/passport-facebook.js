'use strict';
const passport = require('passport');
const User = require('../models/user');
const facebookStrategy = require('passport-facebook').Strategy;
//const secret = require('../secret/secretfile');

passport.serializeUser((user, done) => {
	done(null, user.id);//gets the user id and saves it in the session
});

passport.deserializeUser((id, done) =>{
	User.findById(id, (err, user) => //if user exists we'll get userData from db
		done(err, user));
});

passport.use( new facebookStrategy({
	clientID: process.env.FB_CLIENT_ID,
	clientSecret: process.env.FB_CLIENT_SECRET,
	profileFields: ['email', 'displayName', 'photos'],
	callbackURL: 'http://localhost:3000/auth/facebook/callback',
	pathReqToCallback: true
	
}, (req, token, refreshToken, profile, done) =>{

	//we first have to check if the email already exists
	User.findOne({facebook: profile.id}, (err, user) =>{
		if (err) {
			return done(err);
		}
		if (user) {
			return done(null, user);

		}else {
			const newUser = new User();
			newUser.facebook = profile.id;
			newUser.fullname = profile.displayName;
			newUser.userName = profile.displayName;
			newUser.email = profile._json.email;
			newUser.userImage = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
			newUser.fbTockens.push(token);

			newUser.save((err) => {
				return done(null, newUser);
			})
		}

		
	});
}));

