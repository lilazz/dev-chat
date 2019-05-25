
module.exports = function(async, Club, lodash, Users, Message){
	return {
		SetRouting: function(router) {
			router.get('/home', this.homePage);
			router.post('/home', this.postHomePage);

			router.get('/logout', this.logout);
		},

		homePage: function(req, res){
			if (req.user.userName){
			async.parallel([
				function(callback){
					Club.find({}, (err, result) => {
						callback(err, result);
					}) //will return an array
				}, 
				function (callback) { 
					Club.aggregate([{
											$group: {id: "$category"}
										}], (err, newResult) => {
						callback(err, newResult);
					});
				},

				function(callback){
					Users.findOne({'userName': req.user.userName})
					.populate('request.userId')
					.exec((err, result)=>{
						
						console.log(result.request.userId);
						callback(err, result);
					}); 
				},
				function(callback){
					const nameRegex = new RegExp("^"+req.user.userName.toLowerCase(), "i");
					Message.aggregate(
					[{$match:{$or: [{"senderName":nameRegex},{"receiverName":nameRegex}]}},
										{$sort:{"createdAt":-1}},
										{
											$group:{"_id":{
												"last_message_between":{
													$cond:[
														{
															$gt:[
																{$substr:["$senderName", 0, 1]},
																{$substr:["$receiverName", 0, 1]}]
														},
														
															{$concat:["$senderName", " and ", "$receiverName"]},
															{$concat:["$receiverName", " and ", "$senderName"]}
														
													]
												}
											},
												"body":{$first:"$$ROOT"}
					
											}}], function(err, newResult){
							const arr = [
							{
								path:'body.sender',
								model: 'User'
							},{
								path:'body.receiver',
								model: 'User'
							}];

							Message.populate(newResult, arr, (err, newResult1)=>{
								
								callback(err, newResult1);
							})
						}
					)
				},

				], (err, results) => {
					const res1 = results[0];
					const res2 = results[1];
					const res3 = results[2];
					const res4 = results[3];
					console.log(res4);
					
					const dataChunk = [];
					const chunkSize = 3;
					for (let i = 0; i < res1.length; i += chunkSize){
						dataChunk.push(res1.slice(i, i + chunkSize));
					}

					const categorySort = lodash.sortBy(res2, '_id');
					res.render('home', {title: 'Chat - Home', user: req.user, chunks: dataChunk, category: categorySort, chat: res4, data:res3});
				})
			
		}},

		postHomePage: function(req, res){
			async.parallel([
				function(callback){
					Club.update({
						'_id': req.body.id,
						'fans.userName': {$ne: req.user.userName}

					},{
						$push: {fans: {
							userName: req.user.userName,
							email: req.user.email
						}}
					}, (err, count)=>{
						console.log(count);
						callback(err, count);
					}); 
				},
					function(callback){

					if(req.body.chatId){
						console.log('UPDATE');
						Message.update({
							'_id':req.body.chatId,

						},
						{
							"isRead":true
						}, (err,done)=>{
							console.log('HERE        '+done);
							callback(err, done)
						})
					}
				}

				], (err, results)=>{
					res.redirect('/home');
				});
			//friendResult.PostReq(req, res, '/home');
		},
		

		logout: function(req, res){
			req.logout();
			req.session.destroy((err)=>{
				res.redirect('/');
			})
		}

	}
}