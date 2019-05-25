const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport')
const lodash = require('lodash');
const socketIO = require('socket.io');
const {Users} = require('./helpers/userClass');
const {Global} = require('./helpers/global');
const compression = require('compression');
const helmet = require('helmet');

require('./passport/passport-local');
require('dotenv').config();

const container = require('./container');

container.resolve(function(users, lodash, admin, home, group, result, privateChat, profile, interests, news) {

	mongoose.Promise = global.Promise;
	//mongoose.connect('mongodb://localhost/chat', {'useMongoClient': true});
	//mongoose.connect('mongodb+srv://adminDevChat:31085@devchat-c5jxu.mongodb.net/chat');

	mongoose.connect(encodeURI(process.env.MONGODB_URI), {useNewUrlParser:true})
	.then(connection => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
      console.log(error.message)
     })
	console.log(encodeURI(process.env.MONGODB_URI));


	const app = SetupExpress();
	function SetupExpress(){
		const app = express();
		const server = http.createServer(app);
		const io = socketIO(server);

		server.listen(process.env.PORT || 3000, function(){
			console.log('Listening on port 3000');
		});
		ConfigureExpress(app);

		require('./socket/globalroom')(io, Global, lodash);	
		
		require('./socket/groupchat')(io, Users);
		
		require('./socket/friend')(io);
		require('./socket/pm.js')(io);
	


		//setup router
		const router = require('express-promise-router')();
		users.SetRouting(router);
		admin.SetRouting(router);
		home.SetRouting(router);
		group.SetRouting(router);
		result.SetRouting(router);
		privateChat.SetRouting(router);
		profile.SetRouting(router);
		interests.SetRouting(router);
		news.SetRouting(router);
		app.use(router);

		app.use(function(req, res){
			res.render('404');
		})
	}
	
	

	function ConfigureExpress(app){
		app.use(compression());
		app.use(helmet());

		require('./passport/passport-local');
		require('./passport/passport-facebook');
		require('./passport/passport-google');

		app.use(express.static('public'));
		app.use(cookieParser());
		app.set('view engine', 'ejs');
		app.use(express.json()).use(express.urlencoded());
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({extended: true}));

		app.use(validator());

		app.use(session({
			secret: process.env.SECRET_KEY,
			resave: true,
			saveInitialized: true,
			store: new MongoStore({mongooseConnection: mongoose.connection})
		}));
		app.use(flash());
		app.use(passport.initialize());
		app.use(passport.session());
		app.locals.lodash = lodash;
		


	}


})