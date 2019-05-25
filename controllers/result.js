module.exports = function(async, Users,Club){
	return {
		SetRouting: function(router){
			router.get('/result', this.getResult);
			router.post('/result', this.postResult);

			router.get('/members', this.viewMembers);
			router.post('/members', this.searchMembers);
		},

		getResult:function(req,res){
			//res.render('result', {user:req.user});
			res.redirect('/home');
		},

		postResult: function(req, res){
			async.parallel([
				function(callback){
					const regex = new RegExp((req.body.category), 'gi');
					Club.find({'$or': [{'category':regex}, {'name':regex}]}, (err, result)=>{
						callback(err, result);
					} );
				}
				], (err, results) =>{
					const res1 = results[0];

					const dataChunk = [];
					const chunkSize = 3;
					for (let i = 0; i < res1.length; i += chunkSize){
						dataChunk.push(res1.slice(i, i + chunkSize));
					}

					res.render('result', {title: 'Chat - Result', user: req.user, chunks: dataChunk});
				})
		},
		viewMembers: function(req, res){
			async.parallel([
				function(callback){
					Users.find({}, (err, result)=>{
						callback(err, result);
					} );
				}
				], (err, results) =>{
					const res1 = results[0];

					const dataChunk = [];
					const chunkSize = 4;
					for (let i = 0; i < res1.length; i += chunkSize){
						dataChunk.push(res1.slice(i, i + chunkSize));
					}

					res.render('members', {title: 'Chat - Members', user: req.user, chunks: dataChunk});
				})
			
		}, 
		searchMembers: function(req, res){
			async.parallel([

				function(callback){
				const regex = new RegExp((req.body.userName), 'gi');

					Users.find({'userName':regex}, (err, result)=>{
						callback(err, result);
					} );
				}
				], (err, results) =>{
					const res1 = results[0];

					const dataChunk = [];
					const chunkSize = 4;
					for (let i = 0; i < res1.length; i += chunkSize){
						dataChunk.push(res1.slice(i, i + chunkSize));
					}

					res.render('members', {title: 'Chat - Members', user: req.user, chunks: dataChunk});
				})
			
		}
	}
}