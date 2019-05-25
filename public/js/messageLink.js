$(document).ready(function(){
	var socket = io();
	//var param1 = $.params(window.location.pathname);

	var value1 = window.location.pathname;
		var value2 = value1.split('/');
		var value3 = value2.pop();
	var newParam = value3.split('.');

	
	swap(newParam, 0, 1);
	var param2 = newParam[0]+'.'+newParam[1];

	socket.on('connect', function(){
		var params = {
			room1: value3,
			room2: param2
		}

		socket.emit('join PM', params);

		socket.on('new refresh', function(){
				$('#reload').load(location.href + '#reload');
			})		
	});
	

	$(document).on('click', '#messageLink', function(){
		var chatId = $(this).data().value;
		$.ajax({
			url: '/chat/'+value3,
			type: 'POST',
			data: {chatId: chatId},
			success: function(){

			}
		});

		socket.emit('refresh', {});
	})
});

function swap(input, val1, val2){
	var temp =input[val1];
	input[val1] = input[val2];
	input[val2] = temp;
}