'use strict';

module.exports = function(lodash, passport, userVal){
	return {
		SetRouting: function(router){
			router.get('/', this.indexPage);
			router.get('/signup', this.getSignUp);
			router.get('/auth/facebook', this.getFacebookLogin);
			router.get('/auth/facebook/callback', this.facebookLogin);
			router.get('/auth/google', this.getGoogleLogin);
			router.get('/auth/google/callback', this.googleLogin);

			router.post('/', userVal.LoginValidation, this.postLogin);
			router.post('/signup', userVal.SignUpValidation, this.postSignUp);

		},

		indexPage: function (req, res){
			const errors = req.flash('error');
			return res.render('index', {title: 'Chat | Login', messages: errors, hasErrors: errors.length > 0});
		},

		postLogin: passport.authenticate('local.login', {
			successRedirect: '/home',
			failureRedirect: '/',
			failureFlash: true
		}),

		getSignUp: function(req, res){
			const errors = req.flash('error');
			return res.render('signup', {title: 'Chat | SignUp', messages: errors, hasErrors: errors.length > 0});
		},

		postSignUp: passport.authenticate('local.signup', {
			successRedirect: '/',
			failureRedirect: '/signup',
			failureFlash: true
		}),

		getFacebookLogin: passport.authenticate('facebook', {
			scope:'email'

		}),

		getGoogleLogin: passport.authenticate('google', {
			scope: 
			['https://www.googleapis.com/auth/userinfo.profile', //request user permission
			'https://www.googleapis.com/auth/userinfo.email']
			//['https://www.googleapis.com/auth/plus.login', //request user permission
			//'https://www.googleapis.com/auth/plus.profile.emails.read']
		}),

		googleLogin: passport.authenticate('google', {
			successRedirect: '/home',
			failureRedirect: '/signup',
			failureFlash: true
		}),

		facebookLogin: passport.authenticate('facebook', {
			successRedirect: '/home',
			failureRedirect: '/signup',
			failureFlash: true
		})

		
	}
}