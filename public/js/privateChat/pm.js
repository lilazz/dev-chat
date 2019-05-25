$(document).ready(function(){
	var socket = io();
	//var param1 = $.params(window.location.pathname);

		var value1 = window.location.pathname;
		var value2 = value1.split('/');
		var value3 = value2.pop();

	console.log(value3);
	var newParam = value3.split('.');

	var userName = newParam[0];
	$('#receiver-name').text('@'+userName);
	swap(newParam, 0, 1);
	var param2 = newParam[0]+'.'+newParam[1];

	
	socket.on('connect', function(){
		var params = {
			room1: value3,
			room2: param2
		}

		socket.emit('join PM', params);
		socket.on('message display', function(){
			$('#reload').load(location.href + ' #reload');
		})
	});

		socket.on('new message', function(data) {
		//console.log(data);
		const template = $('#messageTemplate').html();
		const message = Mustache.render(template, {
			text: data.text.text,
			sender: data.sender
		});

		$('#messages').append(message);
	})

	$('#messageForm').on('submit', function(e) {
		e.preventDefault(); //we don't want form to reload
		var msg = $('#msg').val();
		var sender = $('#nameUser').val();

		if(msg.trim().length > 0){
			socket.emit('private message', { //we emit event createMessage and server will listent for theevent with this name
				text: msg,
				sender: sender,
				room: value3
			
			}, function(){
				$('#msg').val('');
			});
		};
			
	});

$('#send-message').on('click', function(){
		var message = $('#msg').val();
		$.ajax({
			url:'/chat/'+value3,
			type:'POST',
			data:{
				message: message
			},
			success: function(){
				$('#msg').val('');
			}
		});
		
	});


});

function swap(input, val1, val2){
	var temp =input[val1];
	input[val1] = input[val2];
	input[val2] = temp;
}