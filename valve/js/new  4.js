var JSONparser = {
	
	// Convert a basic JSON datatype (number, string, boolean, null, object, array) 
	// into an tableColumn
	parseValue: function (json) {
		var valueType = typeof json;
		
		if (json == null) {
		} 
		else if (json && json.constructor == Array) {
			this.parseObject(json);
		} 
		else if (valueType == 'object') {
			this.parseObject(json);
		} 
		else if (valueType == 'number') {
			;
		} 
		else if (valueType == 'string') {
			;
		} else if (valueType == 'boolean') {
			;
		}
	},
	
	// Convert an object into Column attribute
	parseObject : function (json) {
		for (var prop in json) {
			hasContents = true;
			this.parseValue(json[prop]);
			debug(prop);
		}
	},
	
	// Convert a whole JSON object into attributes list
	parseJSON : function (json) {
		this.parseValue(json);
	}
};