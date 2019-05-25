$(document).ready(function() {
	var socket = io();
	var room = $('#groupName').val();
	var sender = $('#sender').val();
	socket.on('connect', function() {
		console.log('Yeahhh User connected');

		var params = {
			room: room,
			name: sender
		};

		socket.emit('join', params, function() {
			console.log('User joined this channel');
		});
	});
	socket.on('usersList', function(users){
		console.log(users);
		var ol = $('<ol></ol>');

		for (i = 0; i < users.length; i++){
			ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a></p>');

		};
		$(document).on('click', '#val', function(){
			$('#name').text('@'+$(this).text());
			$('#receiverName').val($(this).text());
			$('#nameLink').attr("href", "/profile/"+$(this).text());
		})



		$('#numValue').text('('+ users.length +')');
		$('#users').html(ol);
	})
	socket.on('newMessage', function(data) {
		console.log(data);
		const template = $('#messageTemplate').html();
		const message = Mustache.render(template, {
			text: data.text,
			sender: data.from,
			userImage: data.image
		});

		$('#messages').append(message);
	})

	$('#message-form').on('submit', function(e) {
		e.preventDefault(); //we don't want form to reload
		var msg = $('#msg').val();
		var userPic = $('#nameImg').val();

		socket.emit('createMessage', { //we emit event createMessage and server will listent for theevent with this name
			text: msg,
			room: room,
			from: sender,
			userPic: userPic
		}, function(){
			$('#msg').val('');
		});
		$.ajax({
			url: '/group/'+room,
			type: 'POST',
			data: {
				message: msg,
				groupName:room,
				
			},
			success: function(){
				$('#msg').val('');
			}
		})
	});	
});