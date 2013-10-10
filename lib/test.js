//Defining a user schema
var userSchema = {
	name: 'users',
	fields: [
		{name: 'id', type: 'number', size: 3},
		{name: 'firstname', type: 'string', size: 15},
		{name: 'lastname', type: 'string', size: 25},
		{name: 'email', type: 'string', size: 50}
	]
};

srvmock.setSchema(userSchema);

(function() {
	var userList = srvmock.httpGet('users'),
		i = 0,
		len = userList.length,
		buffer = "",
		user;

	for(i; i < len; i++) {
		user = userList[i];
		buffer += "<li data-id='" + user._id + "'>" + user.firstname + "</li>";
	}

	$('#user-list').html(buffer);


	$(document).on('click', '#user-list li', function() {
		var rowId = $(this).data('id') + '',
			row = srvmock.httpGetOne('users', rowId);

		if(row) showUserInfo(row);
	});

	function showUserInfo(row) {
		$('.fullname').html(row.firstname + ' ' + row.lastname);
		$('.email').html(row.email);
	}

})();