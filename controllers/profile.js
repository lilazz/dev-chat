module.exports = function(async, Users, Message, aws, formidable){
	return {
		SetRouting: function(router){
			router.get('/settings/profile', this.profilePage);
			router.post('/userupload', aws.Upload.any(), this.userUpload);
			router.post('/settings/profile', this.getProfilePage);

			router.get('/profile/:name', this.getOverviewPage);

			router.post('/profile/:name', this.overviewPostPage);
		},

		profilePage: function(req, res){
			const name = req.params.name;
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
							//console.log('HERE  '+newResult[0]._id.last_message_between);
							callback(err, newResult);
						}
					)
				},

				

				], (err, results)=> {
					const result1 = results[0];
					const result2 = results[1];
					
					res.render('userProfile/profile', {title: 'Chat - MemberProfile', user: req.user, data:result1, chat:result2});
				});

			
		},


		getProfilePage:function(req, res){
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
					res.redirect('/settings/profile');
				});

			async.waterfall([
				function(callback){
					Users.findOne({'_id':req.user._id}, (err, result)=>{
						callback(err, result);
					})
				}, 
				function(result, callback){
					if(req.body.upload === null || req.body.upload === ''){
						Users.update({
						'_id':req.user._id
					},
					{
						userName: req.body.username,
						fullName: req.body.fullname,
						about: req.body.about,
						gender: req.body.gender,
						country:req.body.country,
						userImage: result.userImage

					},
					{
						upset:true
					}, (err, result)=>{
						console.log(result);
						res.redirect('/settings/profile');
					}
					)

					}else if(req.body.upload !== null || req.body.upload !== ''){
						Users.update({
						'_id':req.user._id
					},
					{
						userName: req.body.username,
						fullName: req.body.fullname,
						about: req.body.about,
						gender: req.body.gender,
						userImage: req.body.upload

					},
					{
						upset:true
					}, (err, result)=>{
						console.log(result);
						res.redirect('/settings/profile');
					}
					)
					}
				}
				])
		},

		userUpload: function(req, res){
			const form = new formidable.IncomingForm();
			form.on('file', (field, file)=>{});
			form.on('error', (err)=>{});
			form.on('end', (err)=>{
				
			});
			form.parse(req);
		},

		getOverviewPage:function(req, res){
			async.parallel([
				function(callback){
					Users.findOne({'userName': req.params.name})
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
							//console.log('HERE  '+newResult[0]._id.last_message_between);
							callback(err, newResult);
						}
					)
				},

				

				], (err, results)=> {
					const result1 = results[0];
					const result2 = results[1];
					console.log('GET Overview   '+result1);
					res.render('userProfile/overview', {title: 'Chat - Overview', user: req.user, data:result1, chat:result2});
				});
		},
		overviewPostPage: function(req, res){
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
					
					res.render('/profile/'+req.params.name, {title: 'Chat - MemberProfile', user: req.user, data:result1, chat:result2});
				});	
		}

	}
}