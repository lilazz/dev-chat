$(document).ready(function(){
	loadData('.paginate');
	return getResult();
});

function getResult(){
	$.ajax({
		url:'https://api.dou.ua/articles/?format=json&tag=frontend',
		type:'GET',
		dataType:'json',
		success:function(data){
			var results='';
//console.log(data.results);
			$.each(data.results, function(i){
				var date = new Date(Date.parse(data.results[i].published)).toDateString();
				results += '<form class="paginate">';
				results += '<div class="col-md-12 news-post">';
				results += '<div class="row">';

				results += '<a href= '+data.results[i].url+' target="_blank" style="color:#4aa1f3; text-decoration:none;">';
				results += '<div class="col-md-2">';
				results += '<img class="img-responsive" src='+data.results[i].img_big+' />';
				results += '</div>';

				results += '<div class="col-md-10">';
				results += '<h4 class="news-date">'+date+'</h4>';
				results += '<h3>'+data.results[i].title+'</h3>';
				results += '<p class="news-text">'+data.results[i].announcement+'</p>';
				results += '</div>';

				results += '</a>';

				results += '</div>';
				results += '</div>';
				results +='</form>';
			});
			$('#newsResult').html(results);
			$('.paginate').slice(0,3).show();
		}
	})
}

function loadData(divClass){
	$('#loadMore').on('click', function(e){
		e.preventDefault();
console.log('pressed');
		$(divClass+":hidden").slice(0,4).slideDown();

		$('html, body').animate({
			scrollTop:$(this).offset().top
		}, 2000);
	});

	$('#linkTop').on('click', function(e){
		e.preventDefault();
		$('html, body').animate({
			scrollTop:0
		}, 500);
	})
}