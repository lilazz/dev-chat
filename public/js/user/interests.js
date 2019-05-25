$(document).ready(function(){
	$('#favTechBtn').on('click', function(){
		var favTech = $('#favTech').val();

		var valid = true;
		if (favTech === ''){
			valid = false;
			$('#error').html('<div class="alert alert-danger">You can not submit an empty field</div>');
		}else{
			$('#error').html('');
		};

		if(valid === true){
			$.ajax({
				url:'/settings/interests',
				type:'POST',
				data:{
					favTech:favTech
				},
			
			success:function(){
				$('#favTech').val('');
				setTimeout(function(){
					window.location.reload();
				},200);
			}
		})
	}else{
		return false;
	}
	});


	$('#favCategoryBtn').on('click', function(){
		var favCategory = $('#favCategory').val();

		var valid = true;
		if (favCategory === ''){
			valid = false;
			$('#error').html('<div class="alert alert-danger">You can not submit an empty field</div>');
		}else{
			$('#error').html('');
		};

		if(valid === true){
			$.ajax({
				url:'/settings/interests',
				type:'POST',
				data:{
					favCategory:favCategory
				},
			
			success:function(){
				$('#favCategory').val('');
				setTimeout(function(){
					window.location.reload();
				},200);
			}
		})
	}else{
		return false;
	}
	});
})