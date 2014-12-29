/**
 * Author by Alex Tanti
 */

/* include modules */
var validators = require('validator');
/* include modules */

/* include libraries */
var util = require('../lib/util');
/* include libraries */

/***
 *
 * EXAMPLE:
 *
 * var validator = new engine.createValidator(args);
 * validator.add("name", {
 *      required: true, // if true parameter is required
 *      not_null: true,  // if true parameter cannot be null
 *      type: "object_id", // parameter type ("object_id" / "numeric" / "int" / "decimal" / "float" / "alpha" / "alphanumeric" / "uuid" / "email" / "date" / "ip" / "url" / "array')
 *      length: [4, 20], // length of parameter
 *      not_contains: 'localhost', // parameters cannot contain this string
 *      contains: 'abc', // parameter must contain this string
 *      equal: 'test', // parameter must be equal to this string
 *      in: "234",  // parameter must be in this comma separated string
 *      not_in: "34", // parameter must be in this comma separated string
 *      min: 5, // parameter must be a numerical value greater or equal to the parameter
 *      max: 10, // parameter must be a numerical value smaller or equal to the specified
 *      after: '10-2-2014', // parameter must be a date after the specified
 *      before: '10-2-2013', // parameter must be a date before the specified
 *      depends_on: [ 'parameters.username' ] // parameter must be specified with other parameters - eg: password must have a username
 * });
 * validator.execute(function(error){
 *      console.log(error);
 * });
 *
 */

/**
 * createValidator - create a validator instance
 */
validators.notNull = function(str){
    return !validators.isNull(str);
};

validators.isDecimal = function(str){
    return str !== '' && str.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/);
};

validators.regex = function (str, pattern, modifiers) {
    str += '';
    if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
        pattern = new RegExp(pattern, modifiers);
    }
    return str.match(pattern);
};

validators.isArray = function(str){
    return typeof str === 'object' && Object.prototype.toString.call(str) === '[object Array]';
};

validators.notContains = function(str, elem){
    return !validators.contains(str, elem);
};

validators.notIn = function(str, elem){
    return !validators.isIN(str, elem);
};

validators.max = function(str, val){
    var number = parseFloat(str);
    return isNaN(number) || number <= val;
};

validators.min = function(str, val){
    var number = parseFloat(str);
    return isNaN(number) || number >= val;
};

var Validator = function(){};
Validator.prototype.check = function (str, fail_msg) {
    this.str = validators.toString(str);
    this.msg = fail_msg;
    this._errors = this._errors || [];
    return this;
};
for (var key in validators) {
    if (validators.hasOwnProperty(key)) {
        (function (key) {
            Validator.prototype[key] = function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this.str);
                if(!validators[key].apply(this, args)) {
                    var msg = this.msg || exports.defaultError[key];
                    if (typeof msg === 'string') {
                        args.forEach(function(arg, i) { msg = msg.replace('%'+i, arg); });
                    }
                    return this.error(msg);
                }
                return this;
            };
        })(key);
    }
}


exports.createValidator = function(args, checks, fields_to_ignore, error_code){

    var _args = {};
    if(fields_to_ignore){	
		for(var key in args) {
			if(fields_to_ignore.indexOf(key) == -1) {
				_args[key] = args[key];
			}
		}
	} else {
		_args = args;
	}
	error_code = (error_code) ? error_code : 'validation_error'; 

    var v = new Validator();

    Validator.prototype.clear = function() {
		this._errors = [];
		this._msgs = null;
    }

    Validator.prototype.error = function (name) {
		this._msgs = this._msgs || {};

		this._errors.push(name);

		var field = name.split(" ")[0];
		this._msgs[field] = name;
		return this;
    }

    Validator.prototype.getErrors = function () {
		return this._errors && this._errors.length ? this._msgs : null;
    }

    // clear errors
    v.clear();

	this.set = function(checks) {
		for(var key in checks) {
			this.add(key, checks[key]);
		}
	};



    /**
     * add - add a validation rule
     *
     * @param field
     * @param field_value
     * @param rules
     */
    this.add = function(field, rules){

        // resolve this field
        var field_value = resolveField(field, _args);

        // iterate on each role of this field
        for(var rule in rules){

            if(rules[rule]){
                // check whether this parameter is defined and is not ignored
                if(isDefinedField(rule, field_value, ['required', 'not_null', 'is_restricted'] )){
                    // choose a rule
                    switch(rule){
                        case "required": {
                            validateRequired(v, field, field_value);
                            break;
                        }
                        case "not_null": {
                            validateNotNull(v, field, field_value);
                            break;
                        }
                        case "type": {
                            validateType(v, field, field_value, rules, rule);
                            break;
                        }
                        case "length": {
                            validateLength(v, field, field_value, rules, rule);
                            break;
                        }
                        case "equals": {
                            validateEquals(v, field, field_value, rules, rule);
                            break;
                        }
                        case "contains": {
                            validateContains(v, field, field_value, rules, rule);
                            break;
                        }
                        case "not_contains": {
                            validateNotContains(v, field, field_value, rules, rule);
                            break;
                        }
                        case "in": {
                            validateIn(v, field, field_value, rules, rule);
                            break;
                        }
                        case "not_in": {
                            validateNotIn(v, field, field_value, rules, rule);
                            break;
                        }
                        case "max": {
                            validateMax(v, field, field_value, rules, rule);
                            break;
                        }
                        case "min": {
                            validateMin(v, field, field_value, rules, rule);
                            break;
                        }
                        case "after": {
                            validateAfter(v, field, field_value, rules, rule);
                            break;
                        }
                        case "before": {
                            validateBefore(v, field, field_value, rules, rule);
                            break;
                        }
                        case "depends_on": {
                            validateDependsOn(v, field, field_value, rules, rule);
                            break;
                        }
                        case "is_restricted": {
                            validateRestricted(v, field, field_value);
                            break;
                        }
                        case "equals_attr": {
                            validateEqualsAttr(v, field, field_value, rules, rule);
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * resolveField - resolve a field in a json object (used for complex nested fields)
     */
    var resolveField = function(field, body){
        if(field == "" || !body){
            return body;
        } else if(body[field] || body[field] === null){
            return body[field];
        } else {
            var _field = (field.indexOf(".") != -1) ? field.split(".") : [field];
            var _field_next = _field.slice(1).join(".");
            var f = _field[0];
            return resolveField(_field_next, body[f]);
        }
    }

    /**
     * isDefinedField - checks whether a field is defined - with the exception of the fields listed in the cannot_be_null array
     */
    var isDefinedField = function(rule, field_value, cannot_be_null){
        // field_value === undefined must be ignored (means not parameter not specified)
        if((cannot_be_null.indexOf(rule) != -1) || field_value || field_value === null){
            return true;
        }
        return false;
    }

    /**
     * validateRequired - validates a required field
     */
    var validateRequired = function(v, field, field_value){
        if(field_value !== null){
            var required = (field_value && !util.isEmpty(field_value)) ? 1 : null;
            v.check(required, field + ' is required').notNull();
        }
     }

    /**
     * validateNotNull - validates a not_null field
     */
    var validateNotNull = function(v, field, field_value){
        if(field_value === null){
            var not_null = (field_value && !util.isEmpty(field_value)) ? 1 : null;
            v.check(not_null, field + ' cannot have a null value').notNull();
        }
    }

    /**
     * validateType - validates type of field
     *  - numeric
     *  - int
     *  - decimal
     *  - float
     *  - alpha
     *  - alphanumeric
     *  - object_id
     *  - uuid
     *  - email
     *  - date
     *  - ip
     *  - url
     *  - array
     *
     */
    var validateType = function(v, field, field_value, rules, r){
        var type = rules[r];
        switch(type){
            case "numeric": {
                v.check(field_value, field + ' is not numeric').isNumeric();
                break;
            }
            case "int": {
                v.check(field_value, field + ' is not an int').isInt();
                break;
            }
            case "decimal": {
                v.check(field_value, field + ' is not a decimal').isDecimal();
                break;
            }
            case "float": {
                v.check(field_value, field + ' is not a float').isFloat();
                break;
            }
            case "alpha": {
                v.check(field_value, field + ' is not an alpha').isAlpha();
                break;
            }
            case "alphanumeric": {
                v.check(field_value, field + ' is not an alphanumeric').isAlphanumeric();
                break;
            }
            case "object_id": {
                v.check(field_value, field + ' is not an object_id').regex("^[0-9a-fA-F]{24}$");
                break;
            }
            case "uuid": {
                v.check(field_value, field + ' is not a uuid').isUUID(4);
                break;
            }
            case "email": {
                v.check(field_value, field + ' is not an email').isEmail();
                break;
            }
            case "date": {
                v.check(field_value, field + ' is not a date').isDate();
                break;
            }
            case "ip": {
                v.check(field_value, field + ' is not an ip').isIP();
                break;
            }
            case "url": {
                v.check(field_value, field + ' is not a url').isURL();
                break;
            }
            case "array": {
                v.check(field_value, field + ' is not an array').isArray();
                break;
            }
        }
    }

    /**
     * validateLength - validates length of field
     */
    var validateLength = function(v, field, field_value, rules, r){
        v.check(field_value, field + ' must have a number of characters between ' + rules[r][0] + ' and ' + rules[r][1]).isLength(rules[r][0], rules[r][1]);
    }

    /**
     * validateEquals - validates field against equals rule
     */
    var validateEquals = function(v, field, field_value, rules, r){
        v.check(field_value, field + ' must be identical to ' + rules[r]).equals(rules[r]);
    }

    /**
     * validateContains - validates field against contains rule
     */
    var validateContains = function(v, field, field_value, rules, r){
        v.check(field_value, field + ' must contain ' + rules[r]).contains(rules[r]);
    }

    /**
     * validateNotContains - validates field against not_contains rule
     */
    var validateNotContains = function(v, field, field_value, rules, r){
        v.check(field_value, field + ' cannot contain ' + rules[r]).notContains(rules[r]);
    }

    /**
     * validateIn - validates field against in rule
     */
    var validateIn = function(v, field, field_value, rules, r){
        v.check(field_value, field + ' must be in ' + rules[r]).isIn(rules[r]);
    }

    /**
     * validateNotIn - validates field against not_in rule
     */
    var validateNotIn = function(v, field, field_value, rules, r){
        v.check(field_value, field + ' cannot be in ' + rules[r]).notIn(rules[r]);
    }

    /**
     * validateMax - validates field against max rule
     */
    var validateMax = function(v, field, field_value, rules, r){
        v.check(field_value, field + ' cannot be greater than ' + rules[r]).max(rules[r]);
    }

    /**
     * validateMin - validates field against min rule
     */
    var validateMin = function(v, field, field_value, rules, r){
        v.check(field_value, field + ' cannot be less than ' + rules[r]).min(rules[r]);
    }

    /**
     * validateAfter - validates field against after rule
     */
    var validateAfter = function(v, field, field_value, rules, r){
        v.check(field_value, field + ' must be after ' + rules[r]).isAfter(rules[r]);
    }

    /**
     * validateBefore - validates field against bedore rule
     */
    var validateBefore = function(v, field, field_value, rules, r){
        v.check(field_value, field + ' must be before ' + rules[r]).isBefore(rules[r]);
    }

    /**
     * validateDependsOn - validates field against depends_on rule
     */
    var validateDependsOn = function(v, field, field_value, rules, r){
        for(var i = 0; i < rules[r].length; i++){
            var depends_on_field = resolveField(rules[r][i], _args);
            v.check(depends_on_field, field + ' must co-exist with ' + rules[r][i]).notNull();

        }
    }

    /**
     * validateRestricted - validates field against restricted rule
     */
    var validateRestricted = function(v, field, field_value){
        if(field_value || field_value === null){
            var restricted = (field_value && !util.isEmpty(field_value)) ? 1 : null;
            v.check(restricted, field + ' is restricted and cannot be updated').isNull();
        }
    }

    /**
     * validateEqualsAttr - validates field must be equals equals_attr rule
     */
    var validateEqualsAttr = function(v, field, field_value, rules, r){
        var equals_attr_field = resolveField(rules[r], _args);
        v.check(field_value, field + ' must be equals ' + rules[r]).equals(equals_attr_field);
    }

    /**
     * execute - perform validation
     */
    this.execute = function(next){
        var errors = v.getErrors();

		if (!next) {
        	if(errors){
				return { error: { message: errors, code: error_code } };
			} else {
				return true;
			}
		}

        if(errors){
			next({ error: { message: errors, code: error_code } }, null);
        } else {
            next(null, { success: 1 });
        }
    }

	this.fields = [];

	if (checks) { this.set(checks); }

    return this;
}
