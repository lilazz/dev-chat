module.exports = function(async, Users, Message){
	return {
		SetRouting: function(router){
			router.get('/settings/interests', this.getInterestsPage);
			router.post('/settings/interests', this.postInterestsPage);

			

		},

		getInterestsPage: function(req, res){

			async.parallel([
				function(callback){
					Users.findOne({'userName': req.user.userName})
					.populate('request.userId')
					.exec((err, result)=>{
						callback(err, result);
					});
				},
					function(callback){
					const nameRegex = new RegExp("^"+req.user.userName.toLowerCase(), "i");
					Message.aggregate(
					{$match:{$or: [{"senderName":nameRegex},{"receiverName":nameRegex}]}},
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

						}}, function(err, newResult){
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

				

				], (err, results)=> {
					const result1 = results[0];
					const result2 = results[1];
					
					res.render('userProfile/interests', {title: 'Chat - UserInterests', user: req.user, data:result1, chat:result2});
				});

			
		},
		postInterestsPage: function(req, res){
			async.parallel([
				function(callback){
					if(req.body.receiverName){
						Users.update({
							'userName': req.body.receiverName,
							'request.userId': {$ne: req.user._id},
							'friendsList.friendId': {$ne: req.user._id}

						},
						{
							$push: {request: {
								userId: req.user._id,
								userName: req.user.userName
							}},
							$inc: {totalRequest: 1}
						}, (err, count)=> {
							callback(err, count);
						})
					}
				},
				function(callback){
					if(req.body.receiverName){
						Users.update({
							'userName': req.user.userName,
							'sendRequests.userName': {$ne: req.body.receiverName},

						},
						{
							$push: {sendRequests: {
								userName: req.body.receiverName
							}}
						}, (err, count)=> {
							callback(err, count);
						})
					}
				}
			], (err, results)=>{
				res.redirect(url);//redirect to the same page
			});

			async.parallel([
				//this function is updated for the receiver of the friendRequest when request is accepted
				function(callback) {
					if(req.body.senderId){
						Users.update({
							'_id': req.user._id,
							'friendsList.friendId': {$ne: req.body.senderId}
					},
						{
						$push: {friendsList:{
							friendId: req.body.senderId,
							friendName: req.body.senderName
						}},
						$pull: {request: {
							userId: req.body.senderId,
							userName: req.body.senderName
						}},
						$inc: {totalRequest: -1}
					}, (err, count)=>{
						callback(err, count)
					})
					}
				},
				//this function is updated for the sender of the friendRequest when request is accepted by receiver
					function(callback) {
					if(req.body.senderId){
						Users.update({
							'_id': req.body.senderId,
							'friendsList.friendId': {$ne: req.user._id}
						},
						{
						$push: {friendsList:{
							friendId: req.user._id,
							friendName: req.user.userName
						}},
						$pull: {sendRequests: {
							
							userName: req.user.userName
						}},
						
					}, (err, count)=>{
						callback(err, count);
					});
					}
				},

				function(callback){
					if (req.body.user_id){
						Users.update({
							'_id': req.user._id,
							'request.userId': {$eq: req.body.user_Id}
						},
						{
						$pull: {request: {
							userId: req.body.user_Id,
							
						}},
						$inc: {totalRequest: -1}
					}, (err, count)=>{
						callback(err, count)
					})
					}
				},

				function(callback){
					if (req.body.user_id){
						Users.update({
							'_id': req.body.user_id,
							'sendRequests.userName': {$eq: req.user.userName}
						},
						{
						$pull: {sendRequests: {
							
							userName: req.user.userName
						}},
						
					}, (err, count)=>{
						callback(err, count);
					});
					}
				},
						

				], (err, results) =>{
					res.redirect('/settings/interests');
				});

			async.parallel([
				function(callback){
					if(req.body.favTech){
						Users.update({
							'_id':req.user._id,
							'interestedStack.favTech':{$ne: req.body.favTech}
						},{
							$push:{interestedStack:{
								favTech:req.body.favTech
							}}
						}, (err,result1)=>{
							console.log(result1);
							callback(err, result1)
						})
					}
				},
				
				], (err, result)=>{
					res.redirect('/settings/interests');
				});

			async.parallel([
				function(callback){
					if(req.body.favCategory){
						Users.update({
							'_id':req.user._id,
							'interestedCategory.favCategory':{$ne: req.body.favCategory}
						},{
							$push:{interestedCategory:{
								favCategory:req.body.favCategory
							}}
						}, (err,result2)=>{
							console.log(result2);
							callback(err, result2)
						})
					}
				}
				],(err, result)=>{
					res.redirect('/settings/interests');
				})

}
}
}

