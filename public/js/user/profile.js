$(document).ready(function(){
	$('.add-btn').on('click', function() {
		$('#addInput').click();

	});
	$('#addInput').on('change', function(){
		var addInput = $('#addInput');
			if (addInput.val() != '') {
				var formData = new FormData();
				formData.append('upload', addInput[0].files[0]);
				$('#completed').html('File uploaded successfuly');
				$.ajax({
					url: '/userupload',
					type: 'POST',
					data: formData,
					processData: false,
					contentType: false,
					success: function(){
						addInput.val('');
					}
				})
			}
			showImage(this);
	});
	$('#profile').on('click', function(){
		var username = $('#username').val();
		var fullname = $('#fullname').val();
		var country = $('#country').val();
		var about = $('#about').val();
		var gender = $('#gender').val();
		var upload = $('#addInput').val();
		var image = $('#userImage').val();

		var valid  = true;
		if(upload === '') {
			 $('#userImage').val(image);
		}

		if (username == '' || fullname == '' || country == '' || gender == '' || about == ''){
			valid === false;
			$('#error').html('<div class="alert alert-danger">You can not submit an empty field</div>');
		}else{
			upload = $('#addInput').val();
			$('#error').html('');
		}
		if (valid === true){
			$.ajax({
				url:'/settings/profile',
				type:'POST',
				data:{
					username:username,
					fullname:fullname,
					country:country,
					gender:gender,
					about:about,
					upload:upload
				},
				success: function(){
					setTimeout(function(){
						window.location.reload();
					}, 200);
				}
			})
		}else{
			return false;
		}
	});
});

function showImage(input){
	if(input.files && input.files[0]){
		var reader = new FileReader();
		reader.onload = function(e){
			$('#showImg').attr('src', e.target.result);
		}
		reader.readAsDataURL(input.files[0]);
	}
}