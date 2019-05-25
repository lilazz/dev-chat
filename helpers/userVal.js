'user strict';

module.exports = function(){
require('../passport/passport-local');

	return {
		SignUpValidation: (req, res, next) => {
			req.checkBody('username', 'Username is required').notEmpty();
			req.checkBody('username', 'Username must be not less than 5').isLength({min: 5});
			req.checkBody('email', 'Email is required').notEmpty();
			req.checkBody('email', 'Email is requiredinvalid').isEmail();
			req.checkBody('password', 'Password is required').notEmpty();
			req.checkBody('password', 'Password must not be less than 5').isLength({min: 5});

			req.getValidationResult()
				.then((result) => {
					const errors = result.array();
					const messages = [];
					errors.forEach((error) => {
						messages.push(error.msg);
					});

					req.flash('error', messages);
					res.redirect('/signup');

				})
				.catch((err) => {
					return next();
				})
		},

		LoginValidation: (req, res, next) => {

			req.checkBody('email', 'Email is required').notEmpty();
			req.checkBody('email', 'Email is requiredinvalid').isEmail();
			req.checkBody('password', 'Password is required').notEmpty();
			req.checkBody('password', 'Password must not be less than 5').isLength({min: 5});

			req.getValidationResult()
				.then((result) => {
					console.log(req.user);
					const errors = result.array();
					const messages = [];
					errors.forEach((error) => {
						messages.push(error.msg);
					});

					req.flash('error', messages);
					res.redirect('/');

				})
				.catch((err) => {
					return next();
				})
		}
	}
}