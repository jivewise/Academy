var new_group = {
	'name' : {required : true}
};


typeof(module) !== "undefined" ?
	module.exports = {new_group: new_group} :
	packager("academy.object_validators", function() { 
		this.new_group = new_group;
	});
