(function(window, $) {

	var document = window.document,
		$d = $(document);

	createUserSchema();
	fillList();
	bindEvents();

	function showUserInfo(row) {
		$('.fullname').html(row.firstname + ' ' + row.lastname);
		$('.email').html(row.email);
	}

	function fillList() {
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
	}

	//Defining a user schema
	function createUserSchema() {
		if(!srvmock.getSchema('users')) {
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
		}
	}

	function registerUser(ev) {
		var newUser = {
			firstname: $('input[name="firstname"]').val(),
			lastname: $('input[name="lastname"]').val(),
			email: $('input[name="email"]').val()
		};

		srvmock.httpPost('users', newUser);
		fillList();
	}

	function listUsers(ev) {
		var rowId = $(this).data('id') + '',
			row = srvmock.httpGetOne('users', rowId);

		if(row) showUserInfo(row);
	}

	function bindEvents() {
		$d.on('click', '.btn-register', registerUser);
		$d.on('click', '#user-list li', listUsers);
	}

})(this, jQuery);