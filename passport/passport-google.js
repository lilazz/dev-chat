'use strict';
const passport = require('passport');
const User = require('../models/user');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const secret = require('../secret/secretfile');

passport.serializeUser((user, done) => {
	done(null, user.id);//gets the user id and saves it in the session
});

passport.deserializeUser((id, done) =>{
	User.findById(id, (err, user) => //if user exists we'll get userData from db
		done(err, user));
});

passport.use( new googleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: 'http://localhost:3000/auth/google/callback',
	pathReqToCallback: true
	
}, (req, accessToken, refreshToken, profile, done) =>{

	//we first have to check if the email already exists
	User.findOne({google: profile.id}, (err, user) =>{
		if (err) {
			return done(err);
		}
		
		if (user) {
			return done(null, user);
		}else{
			const newUser = new User();
			console.log(profile.emails[0].value);
			newUser.google = profile.id;
			newUser.fullname = profile.displayName;
			newUser.userName = profile.displayName;
			newUser.email = profile.emails[0].value;
			//newUser.userImage = profile._json.image.url;

			newUser.save((err) =>{
				if (err) {
					return done(err);
				}
				return done (null, newUser);
			})
		}

		
	});
}));

