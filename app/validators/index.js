/**
 *  Created by Alex Tanti
 */
var init = function(args, checks, fields_to_ignore, error_code){
    return new require('./lib/core').createValidator(args, checks, fields_to_ignore, error_code);
}

module.exports.createValidator = function(args, checks, fields_to_ignore, error_code){
    return new init(args, checks, fields_to_ignore, error_code);
}





