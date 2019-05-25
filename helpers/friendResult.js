module.exports = function(async, Users){
	return {
		PostReq: function(req, res, url){
/*			async.parallel([
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

				], (err, results) =>{
					res.redirect(url);
				});*/
		}
	}
}