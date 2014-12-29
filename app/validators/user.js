var new_user = {
	'fullname' : {required : true},
	'password' : {equals_attr: 'confirm', length: [5, 20], depends_on: ['set_password', 'confirm']},
	'confirm' : {equals_attr: 'password', depends_on: ['password']},
	'phone' : {type: 'numeric'},
	'email' : {required: true, type: 'email'}
};

var edit_user = {
	'fullname' : {required : true},
	'phone' : {type: 'numeric'}
};

typeof(module) !== "undefined" ?
	module.exports = {user: edit_user, new_user: new_user} :
	packager("academy.object_validators", function() {
		this.new_user = new_user; this.user = edit_user;
	});
