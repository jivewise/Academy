packager('academy.validator.util', function() {
	this.getBodyString = function(data) {
	 var body = '';
	 if(data && !this.isEmpty(data)){
		 Object.keys(data).forEach(function(key) {
		  var val = data[key];
		  if (this.isArray(val)) {
		   for (var i=0; i<val.length; i++) {
			body += key + '[]=' + encodeURIComponent(val[i]) + '&';
		   }
		  } else {
		   body += key + '=' + encodeURIComponent(val) + '&';
		  }
		 });
		 return body;
	 }
	 return null;
	};

	this.parseUrl = function(url) {
		return (url.substring(0,1) == "/") ? url.substring(1) : url;
	}

	this.isArray = function(obj) {
		return Object.prototype.toString.call( obj ) === '[object Array]';
	}

	this.isObject = function(obj) {
		return Object.prototype.toString.call(obj) == "[object Object]";
	}

	this.isFunction = function(data){
		if (typeof(data) == "function") {
			return true;
		}
		return false;
	}

	this.isString = function(data){
		if (typeof(data) == "string") {
			return true;
		}
		return false;
	}

	this.count = function(obj)
	{
		var count = 0;
		for(var i in obj)
			if(obj.hasOwnProperty(i))
				count++;
		return count;
	}

	this.isEmpty = function(obj) 
	{ 
		for(var i in obj) { return false; } return true; 
	}

	this.isJSON = function(data)
	{
		try {
			JSON.parse(data);		
		} catch(e) {
			return false;
		}
		return true;
	}
});
