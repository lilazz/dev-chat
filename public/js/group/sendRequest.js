$(document).ready(function(){
	var socket = io();
	var room = $('#groupName').val();
	var sender = $('#sender').val();

	socket.on('connect', function(){
		var params = {
			sender: sender
		};

		socket.emit('joinRequest', params, function(){
			console.log('JOined');
		});


	}); 

	socket.on('newFriendRequest', function(friend){
		$('#reload').load(location.href + ' #reload');

		$(document).on('click', '#acceptFriend', function(){
		var senderId = $('#senderId').val();
		var senderName = $('#senderName').val();

		$.ajax({
			url: '/group/' + room,
			type:'POST',
			data: {
				senderId: senderId,
				senderName: senderName
			}, 
			success: function(){
				$(this).parent().eq(1).remove();
			}
		});
		$('#reload').load(location.href + ' #reload');
	});

		$(document).on('click', '#cancelFriend', function(){
		var userId = $('#user_id').val();

		$.ajax({
			url: '/group/' + room,
			type:'POST',
			data: {
				userId: userId
			}, 
			success: function(){
				$(this).parent().eq(1).remove();
			}
		});
		$('#reload').load(location.href + ' #reload');
	});

	});

	$('#friendAdd').on('click', function(e){
		e.preventDefault();

		var receiverName = $('#receiverName').val();

/*		socket.emit('friendRequest', {
					receiver: receiverName,
					sender: sender
				}, function(){
					console.log('Request Sent');
				})*/

		$.ajax({
			url: '/group/'+room,
			type: 'POST',
			data: {
				receiverName: receiverName,
				sender: sender
			},
			success: function(){
				socket.emit('friendRequest', {
					receiver: receiverName,
					sender: sender
				}, function(){
					console.log('Request Sent');
				})
			}
		})
	});
	$('#acceptFriend').on('click', function(){
		var senderId = $('#senderId').val();
		var senderName = $('#senderName').val();

		$.ajax({
			url: '/group/' + room,
			type:'POST',
			data: {
				senderId: senderId,
				senderName: senderName
			}, 
			success: function(){
				$(this).parent().eq(1).remove();
			}
		});
		$('#reload').load(location.href + ' #reload');
	});

	$('#cancelFriend').on('click', function(){
		var userId = $('#user_id').val();

		$.ajax({
			url: '/group/' + room,
			type:'POST',
			data: {
				userId: userId
			}, 
			success: function(){
				$(this).parent().eq(1).remove();
			}
		});
		$('#reload').load(location.href + ' #reload');
	});
});