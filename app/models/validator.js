/*
 *	2. Modify validator service
 *
 */
var Validator = require('../validators/index');
function ValidateFactory(compound) {
	function Validate(data, checks) {
		this.checks = checks;
		this.data = data;

		this.isValid = this.validate();
	}

	Validate.prototype.validate = Validate.validate = function() {
        var validator = new Validator.createValidator(this.data, this.checks);
        var valid = validator.execute();
		return valid;
	};

	compound.models.Validate = Validate;
	Validate.className = Validate;

	return Validate;
};

module.exports = ValidateFactory;
