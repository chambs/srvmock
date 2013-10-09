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

//srvmock.setSchema(userSchema);

(function() {
	var userList = srvmock.httpGet('users', 15),
		i = 0,
		len = userList.length,
		buffer = "",
		user;

	for(i; i < len; i++) {
		user = userList[i];
		buffer += "<li data-id='" + user.id + "'>" + user.firstname + "</li>";
	}

	$('#user-list').html(buffer);

})();