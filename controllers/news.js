module.exports = function(){
	return {
		SetRouting: function(router){
			router.get('/latest-news/', this.devNews);
		},
		devNews: function(req, res){
			res.render('./news/news', {title: 'Development News', user:req.user})
		}
	}
}