(function(win){
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function namespacer( str ) {
        var split = (''+str).split('.');
        var result = window;

        for( var i = 0, item; item = split[i]; i++ ) {
            if( !hasOwnProperty.call(result, item) )
                result[item] = {};

            result = result[item];
        }

        return result;
    }

    win.packager = function( str, func ) {
        var namespace = namespacer( str );
        var args = Array.prototype.slice.call(arguments);
        func.apply( namespace, args.slice(2) );
    };

}(window));
