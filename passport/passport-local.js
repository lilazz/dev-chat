'use strict';
const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
	done(null, user.id);//gets the user id and saves it in the session
});

passport.deserializeUser((id, done) =>{
	User.findById(id, (err, user) => //if user exists we'll get userData from db
		done(err, user));
});

passport.use('local.signup', new LocalStrategy({
	usernameField: 'email',
	passportField: 'password',
	passReqToCallback: true
}, (req, email, password, done) =>{

	//we first have to check if the email already exists
	User.findOne({'email': email}, (err, user) =>{
		if (err) {
			return done(err);
		}
		if (user) {
			return done(null, false, req.flash('error', 'User with email already exists'));

		}

		const newUser = new User();
		newUser.userName = req.body.username; //we'll get the data from input with the help of body-parser
		newUser.fullname = req.body.username;
		newUser.email = req.body.email;
		newUser.password = newUser.encryptPassword(req.body.password);

		newUser.save((err) => {
			done(null, newUser);
		});
	});
}));

passport.use('local.login', new LocalStrategy({
	usernameField: 'email',
	passportField: 'password',
	passReqToCallback: true
}, (req, email, password, done) =>{

	//we first have to check if the email already exists
	User.findOne({'email': email}, (err, user) =>{
		if (err) {
			return done(err);
		}
		
		const messages = [];
		if (!user || !user.validUserPassword(password)) {
			messages.push('Email does not exist or password is invalid');
			console.log(user);
			return done(null, false, req.flash('error', messages));

		}

		return done(null, user);
		
	});
}));