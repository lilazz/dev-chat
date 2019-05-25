module.exports = function(io, Global, lodash){
	const clients = new Global();

	io.on('connection', (socket)=>{
		socket.on('global room', (global)=>{
			socket.join(global.room);
			clients.EnterRoom(socket.id, global.name, global.room, global.img);

			const nameProp = clients.GetRoomList(global.room);
			const arr = lodash.uniqBy(nameProp, 'name');
			console.log(arr);
			io.to(global.room).emit('loggedInUser', arr)
		});

		socket.on('disconnect', ()=>{
			const user = clients.RemoveUser(socket.id);

			if (user) {
				const userData = clients.GetRoomList(user.room);
				const arr = lodash.uniqBy(userData, 'name');
				console.log(arr);
				const removeData = lodash.remove(arr, function(userData){
					return userData.name === user.name;

				});
								console.log(arr);

				io.to(user.room).emit('loggedInUser', arr);
			}
		})
	})
}