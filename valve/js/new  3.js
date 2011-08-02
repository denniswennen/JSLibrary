var attr,
el;

// for each attribute of the items

for (currentItem = 0; currentItem < pipeJSON.count; currentItem++) {
	
	item = pipeJSON.value.items[currentItem]; //for each item
	currentAttr = 0;
	
	for (attr in item) {
		var temp;
		attributeValue = item[atrr];
		temp = parse(attributeValue); //integrate the parse function here
		
		dataTable.setCell(currentItem, currentAttr, element);
		currentAttr++;
	}
}

dataTable.setCell(currentItem, currentAttr, element);

function parse(attributeValue) {
	if (element == null)
		return 'null';
	if (typeof attributeValue == 'number')
		return parseNum(attributeValue);
	if (typeof attributeValue == 'string')
		return parseStr(attributeValue);
	if (typeof attributeValue == 'boolean')
		return attributeValue ? 'true' : 'false';
	return attributeValue.length ? parseArr(attributeValue) : parseObj(attributeValue);
}

function parseObj(m) {
	for (var k in m) {
		parse(m[k]);
	}
}

function parseArr(m) {
	parse(m);
}

function parseNum(m) {
	return m;
}
 
 
 for (currentItem = 0; currentItem < pipeJSON.count; currentItem++) {
	
	item = pipeJSON.value.items[currentItem]; //for each item
	currentAttr = 0;
	
	for (attr in item) {
		var temp;
		attributeValue = item[atrr];
		temp = function parse(attrValue) { //integrate the parse function here
			if (typeof attrValue == 'number' || typeof attributeValue == 'string') {
				return attrValue;
			}
			else {
				return parse(attributeValue);
			}
		};
		
		dataTable.setCell(currentItem, currentAttr, element);
		currentAttr++;
	}
}

// Convert a basic JSON datatype (number, string, boolean, null, object, array) 
	// into an tableColumn
	parseValue: function (json, parent) {
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
			this.parseValue(json[prop], prop);
			debug(prop);
		}
	},
	
	// Convert a whole JSON object into attributes list
	parseJSON : function (json) {
		this.parseValue(json);
	},
	
	parseJSON2 : function (json) {
	
		var prop;
		
		// working, but prints also 'objects' as attributes
		if ( this.checkType('Object', json) || this.checkType('Array', json)  ) { //json is an object, further parsing
			for (prop in json) {
				//hasContents = true;
				this.parseJSON2( json[prop] );
				if( ! this.checkType('Object', json[prop]) ) { //Objects cannot be used as data
					debug(prop);
				}
			}
		}
	
	},