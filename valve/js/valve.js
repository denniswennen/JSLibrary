//		valve.js 1.1.6
//		(c) 2011 Dennis Swennen
//		Valve is a JavaScript library for loading, manipulating and displaying data trough Yahoo(c) Pipes.
//		For all details and documentation:
//		https://github.com/denniswennen/JSLibrary


// Baseline setup
google.load('visualization', '1', {
		'packages' : ['corechart', 'table']
	});

/* Standard JSON object */
var pipeObj = {
	"count" : 0,
	"value" : {
		"title" : "MyTitle", // name of the Yahoo Pipe
		"description" : "MyDescription", // description for the Pipe
		"link" : "http:\/\/pipes.yahoo.com\/pipes\/pipe.info?_id=", //link to the pipe
		"pubDate" : "Mon, 18 Jul 2011 03:55:41 -0700", //The moment the Pipe output was created
		"generator" : "http:\/\/pipes.yahoo.com\/pipes\/", //Generator of the JSON data, mostly Yahoo pipes itself
		"callback" : "", //function called to handle the JSON data
		"items" : []// contains the list of items.
	}
};

var YPipeObj = {
	count : 0,
	value : {
		title : "", // name of the Yahoo Pipe
		description : "", // description for the Pipe
		link : "", //link to the pipe
		pubDate : "", //The moment the Pipe output was created
		generator : "", //Generator of the JSON data, mostly Yahoo pipes itself
		callback : "", //function called to handle the JSON data
		items : []// contains the list of items.
	},
	
	params : {},
	attributes : {},
	
	//representation of parameters
	
	setParam : function (key, val) {
		this.params[key] = val;
	},
	
	getParam : function (key) {
		return param.key;
	},
	
	getItems : function () {
		return this.items;
	},
	
	setItems : function (itemsArray) {
		this.items = itemsArray;
	},
};

// Datastructure for the Google Data Table
var GoogleDataTable = {
	
	init : function () {
		this.JSONdata = new google.visualization.DataTable();
	},
	makeColumns : function (pipeJSON) {
		//code to fill the dataTable with all the items from the Pipe
		//each row is an item. every parameter is added
		// STILL SOME WORK. NOT ALL ATTRIBUTES ARE LOADED
		var json = pipeJSON.value.items[0];
		this.getAttributes(json);
		/*
		for (var attr in firstItem) {
		
		this.JSONdata.addColumn(typeof(attr), attr.toString(), attr.toString() + "column");
		};
		 */
		
	},
	
	getAttributes : function (json) {
		
		var prop;
		
		if (checkType('Object', json) || checkType('Array', json)) { //json is an object, further parsing
			for (prop in json) {
				this.getAttributes(json[prop]);
				if (!checkType('Object', json[prop])) { //Objects cannot be used as data
					//do something with the prop of the item
					this.JSONdata.addColumn(typeof(prop), prop.toString(), prop.toString() + "column");
				}
			}
		}
		
	},
	
	fillColumns : function (pipeJSON) {
		
		var currentItem,
		currentAttr,
		dataTable = this.JSONdata,
		item,
		obj;
		
		dataTable.addRows(pipeJSON.count);
		
		for (currentItem = 0; currentItem < pipeJSON.count; currentItem++) {
			
			item = pipeJSON.value.items[currentItem]; //for each item
			currentAttr = 0;
			
			/** previous loop iteration with OBJECT String
			for(var attr in item) {
			el = item[attr];
			if (typeof(el) == 'string' || typeof(el) =='number') {// for each attribute of the items
			dataTable.setCell(currentItem, currentAttr, el);
			currentAttr++;
			}
			else {
			dataTable.setCell(currentItem, currentAttr, "[OBJECT]");
			currentAttr++;
			}
			}**/
			
		}
		
	},
	
	parseObj : function (obj) { //integrate the parse function here
		if (typeof obj == 'number' || typeof obj == 'string') {
			return obj;
		} else {
			return this.parseObj(obj);
		}
	},
	
	insertRows : function (pipeJSON) {
		var i,
		opt_cellArray = [],
		pos,
		firstItem = pipeJSON.value.items[0];
		
		for (var attr in firstItem) {
			opt_cellArray.push(firstItem[attr]);
		}
		
		for (i = 0; i < pipeJSON.count; i++) { //for every row
			//addRow(opt_cellArray); //contains an Array with al the values for a specific row
		};
		
	},
	
};

// Loading functions
// Parsing functions

var itemParser = {
	
	getAttributes : function (json) {
		
		var prop;
		
		if (this.checkType('Object', json) || this.checkType('Array', json)) { //json is an object, further parsing
			for (prop in json) {
				this.getAttributes(json[prop]);
				if (!checkType('Object', json[prop])) { //Objects cannot be used as data
					//do something with the property of the item
				}
			}
		}
		
	},
};

// Object functions
/** convert the input url **/
function pipeCall(inputURL) {
	
	document.getElementById('loading').style.display = 'inline';
	//$('img#loadingImage').style.display = 'inline';
	
	var url,
	paramObj,
	str = '';
	
	//paramObj = GetParameters();
	GetParametersFromInput();
	
	paramObj = YPipeObj.params;
	for (var prop in paramObj) {
		if (paramObj.hasOwnProperty(prop))
			str += "&" + prop + "=" + paramObj[prop];
	}
	
	url = inputURL.value.replace("info", "run");
	url += "&_render=json";
	url += str;
	url += "&_callback=pipeCallback";
	
	var scriptEl = document.createElement('script');
	scriptEl.type = 'text/javascript';
	scriptEl.src = url;
	var scriptInsert = document.getElementsByTagName('script')[0];
	scriptInsert.parentNode.insertBefore(scriptEl, scriptInsert);
	
	debug(url);
	
}

/** Handles the Pipe response Callback **/
function pipeCallback(jsonString) {
	var output;
	
	YPipeObj.count = jsonString.count;
	YPipeObj.value = jsonString.value;
	
	debug(jsonString.count);
	
	//output = val(response);
	//document.getElementById('attributeslist').innerHTML = output;
	
	this.jsonFormatter = new JSONFormatter();
	
	try {
		outputDoc = this.jsonFormatter.jsonToHTML(jsonString, this.uri);
	} catch (e) {
		outputDoc = this.jsonFormatter.errorPage(e, this.data, this.uri);
	}
	
	document.getElementById('jsondata').innerHTML = outputDoc;
	addClickHandlers();
	
	drawGTableFromJSON(YPipeObj, 'jsontable');
	//itemParser.parseJSON(YPipeObj.value.items);
	
	document.getElementById('loading').style.display = 'none'; //remove loading indicator
	
}

function drawGTableFromJSON(json, outputDiv) {
	
	//Draw Google Viz
	GoogleDataTable.init();
	GoogleDataTable.makeColumns(json);
	//GoogleDataTable.insertRows(YPipeObj);
	//GoogleDataTable.fillColumns(json);
	
	// Create and draw the visualization.
	visualization = new google.visualization.Table(document.getElementById(outputDiv));
	visualization.draw(GoogleDataTable.JSONdata, {
			'allowHtml' : true
		});
	
}

//-------------------------------------------------------------------------------------------------
// Parsing Items
function val(m) {
	if (m == null)
		return '';
	if (typeof m == 'number')
		return num(m);
	if (typeof m == 'string')
		return str(m);
	if (typeof m == 'boolean')
		return m ? 'true' : 'false';
	return m.length ? arr(m) : obj(m);
}

function obj(m) {
	var sb = '<dl>';
	for (var k in m) {
		sb += '<dt class="ib"><b>' + splitCase(k) + '</b></dt><dd>' + val(m[k]) + '</dd>';
	}
	sb += '</dl>';
	return sb;
}

function arr(m) {
	val(m);
}

function arr2(m) {
	var len = m.length,
	sb = '<ul>',
	i;
	
	if (typeof m[0] == 'string' || typeof m[0] == 'number') {
		return m.join(', ');
	}
	
	for (i = 0; i < len; i++) {
		sb += '<li>' + m[i] + '</li>';
	}
	
	sb += '</ul>'
	
	return sb;
}

function makeRows(h, m) {
	var sb = '';
	for (var r = 0, len = m.length; r < len; r++) {
		sb += '<tr>';
		var row = m[r];
		sb += '<td>' + r + '</td>';
		for (var k in h)
			sb += '<td>' + val(row[k]) + '</td>';
		sb += '</tr>';
	}
	return sb;
}

function num(m) {
	return m;
}
function str(m) {
	return m.substr(0, 6) == '/Date(' ? dfmt(date(m)) : m;
}
function date(s) {
	return new Date(parseFloat(/Date\(([^)]+)\)/.exec(s)[1]));
}
function pad(d) {
	return d < 10 ? '0' + d : d;
}
function dfmt(d) {
	return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate());
}
function splitCase(t) {
	return typeof t != 'string' ? t : t.replace(/([A-Z]|[0-9]+)/g, ' $1').replace(/_/g, ' ');
}

// Utility functions

function propagateAttributes() {
	var dropdownbox = document.getElementById('attributelist');
	
	var data = pipeKeys.toString.apply(pipeKeys);
	
	for (var i = 0; i < pipeKeys.length; ++i) {
		addOption(dropdownbox, pipeKeys[i], pipeKeys[i]);
	}
}

// Gets the parameters from the input fields
function GetParametersFromInput() {
	
	var param_names = document.getElementsByClassName("param_name"),
	param_values = document.getElementsByClassName("param_value");
	
	for (var i = 0; i < param_names.length; i++) {
		if (param_names[i].value != '' && param_values[i].value != '') {
			//paramObj[param_names[i].value] = param_values[i].value;
			YPipeObj.setParam(param_names[i].value, param_values[i].value);
			
		}
	}
}

/** Prints out debug variable **/
function debug(variable) {
	var outputdiv = document.getElementById('debug');
	if (variable === null) {
		outputdiv.innerHTML = "Variable undefined"
			
	} else {
		outputdiv.innerHTML += "<br />DEBUG:" + variable;
	}
}

function checkType(type, obj) {
	var clas;
	
	clas = Object.prototype.toString.call(obj).slice(8, -1);
	return obj !== undefined && obj !== null && clas === type;
}
 