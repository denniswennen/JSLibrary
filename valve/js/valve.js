//		valve.js 1.1.6
//		(c) 2011 Dennis Swennen
//		Valve is a JavaScript library for loading, manipulating and displaying data trough Yahoo(c) Pipes.
//		For all details and documentation:
//		https://github.com/denniswennen/JSLibrary


// Baseline setup
google.load('visualization', '1', {
		'packages' : ['corechart', 'table']
	});


//GLobal only item for representing the returned JSON object
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
	attributes : [],
	
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


//UPDATED: pipe Object constructor
function pipe(json) {

	this.count = json.count;
	this.value = json.value;
	
}



// GOOGLE DATA TABLE FUNCTIONS
function googleDataTable() {
	this.JSONdata = new google.visualization.DataTable();
	this.attributes = [];
}

googleDataTable.prototype.makeColumns = function (pipeObj) {
		//code to fill the dataTable with all the items from the Pipe
		//each row is an item. every parameter is added
		var json = flatten( pipeObj.value.items[0] );
		
		for (prop in json) {
			this.JSONdata.addColumn(typeof(prop), prop.toString(), "col_" + prop.toString());
			this.attributes.push(prop); // CHANGE PLACE?
		}
}

googleDataTable.prototype.makeRows = function (pipeObj) {
		var dataTable = this.JSONdata,
		items = pipeObj.value.items,
		count = pipeObj.count,
		itemNr,
		propNr,
		flatItem;
		
		dataTable.addRows(count); //first adds the rows in the DataTable
		
		for (itemNr = 0; itemNr < count; itemNr++) {
			
			flatItem = flatten(items[itemNr]); //flatten item
			propNr = 0;
			for (prop in flatItem) {
				dataTable.setCell(itemNr, propNr, flatItem[prop] ? flatItem[prop] : "null");
				propNr++;
			}
		}

}






// Datastructure for the Google Data Table
var GoogleDataTable = {
	
	init : function () {
		this.JSONdata = new google.visualization.DataTable();
	},
	
	makeColumns : function (pip) {
		//code to fill the dataTable with all the items from the Pipe
		//each row is an item. every parameter is added
		// STILL SOME WORK. NOT ALL ATTRIBUTES ARE LOADED
		var json = flatten( pip.value.items[0] );
		
		for (prop in json) {
			this.JSONdata.addColumn(typeof(prop), prop.toString(), "col_" + prop.toString());
			YPipeObj.attributes.push(prop); // CHANGE PLACE
		}
		
	},
	
	makeRows : function (pipeJSON) {
		
		var dataTable = this.JSONdata,
		items = pipeJSON.value.items,
		count = pipeJSON.count,
		itemNr,
		propNr,
		flatItem;
		
		dataTable.addRows(count); //first adds the rows in the DataTable
		
		for (itemNr = 0; itemNr < count; itemNr++) {
			
			flatItem = flatten(items[itemNr]); //flatten item
			propNr = 0;
			for (prop in flatItem) {
				dataTable.setCell(itemNr, propNr, flatItem[prop] ? flatItem[prop] : "null");
				propNr++;
			}
		}
		
	},
	
	fillCells : function (json, itemNr) {
		var prop,
		attrNr = 0;
		
		if (checkType('Object', json) || checkType('Array', json)) { //json is an object, further parsing
			for (prop in json) {
				this.fillCells(json[prop], itemNr, attrNr); // for objects at a deeper level
				if (!checkType('Object', json[prop])) { //Objects cannot be used as data
					//do something with the prop of the item
					dataTable.setCell(itemNr, attrNr, val);
					attrNr++;
				}
			}
		}
		
	},
	
	fillColumns : function (pipeJSON) {
		
		var itemNr,
		item,
		obj,
		val,
		dataTable = this.JSONdata;
		
		dataTable.addRows(pipeJSON.count);
		
		for (itemNr = 0; itemNr < pipeJSON.count; itemNr++) {
			
			item = pipeJSON.value.items[itemNr]; //for each item
			this.fillCells(item, itemNr);
		}
		
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

// Controls the User interface
var ControlDashboard = {
	
	propagateAttributeBoxes : function (dataT) {
		
		var i,
		arr = dataT.attributes;
		
		for (i = 0; i < arr.length; ++i) {
			addOption(document.getElementById("attr1dropdown"), arr[i], arr[i]);
			addOption(document.getElementById("attr2dropdown"), arr[i], arr[i]);
		}
		
	},
	
};
// Loading functions
// Parsing functions


function flatten(json) {
	var output = {},
	walk = function (j) {
		var jp;
		for (var prop in j) {
			jp = j[prop];
			if (jp == null) {
				output[prop] = jp;
			} else {
				if (jp.toString() === "[object Object]") {
					walk(jp);
				} else {
					output[prop] = jp;
				}
			}
		}
	};
	walk(json);
	return output;
}

// Object functions
/** convert the input url **/
function pipeCallScriptTag(inputURL) {
	
	var uri,
	scriptEl,
	scriptInsert;
	
	document.getElementById('loading').style.display = 'inline';
	
	uri = createCallbackURI(inputURL);
	
	scriptEl = document.createElement('script');
	scriptEl.type = 'text/javascript';
	scriptEl.src = uri;
	scriptInsert = document.getElementsByTagName('script')[0];
	scriptInsert.parentNode.insertBefore(scriptEl, scriptInsert);
	
	debug(uri);
	
}

function createCallbackURI(uri) {
	
	var fullUri,
	paramObj,
	str = '';
	
	GetParametersFromInputFields();
	paramObj = YPipeObj.params;
	for (var prop in paramObj) {
		if (paramObj.hasOwnProperty(prop))
			str += "&" + prop + "=" + paramObj[prop];
	}
	
	fullUri = uri.value.replace("info", "run");
	fullUri += "&_render=json";
	fullUri += str;
	fullUri += "&_callback=pipeCallback";
	
	return fullUri;
}

function createRequestURI(uri) {
	
	var fullUri,
	paramObj,
	str = '';
	
	GetParametersFromInputFields();
	paramObj = YPipeObj.params;
	for (var prop in paramObj) {
		if (paramObj.hasOwnProperty(prop))
			str += "&" + prop + "=" + paramObj[prop];
	}
	
	fullUri = uri.value.replace("info", "run");
	fullUri += "&_render=json";
	fullUri += str;
	//fullUri += "&_callback=pipeCallback";
	
	return fullUri;
}

function pipeCallCORS(inputURL) {
	
	var request = createCORSRequest("get", createRequestURI(inputURL) );
	
	document.getElementById('loading').style.display = 'inline';
	
	if (request) {
		request.onload = function () {
			var r = JSON.parse(request.responseText); //the actual parsing from Yahoo Pipes to a JSON object
			//do something with the returned JSON object 'r'
			processResponse( r );
			
			
		};
		request.send();
	}
	

}

function processResponse(response) {

	var pipe1 = new pipe(response);
	
	//Displays Google Data Table
	drawTable(pipe1, 'jsontable');
	
	
	document.getElementById('loading').style.display = 'none'; //remove loading indicator

}


function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
		xhr.open(method, url, true);
	} else
		if (typeof XDomainRequest != "undefined") {
			xhr = new XDomainRequest();
			xhr.open(method, url);
		} else {
			xhr = null;
		}
	return xhr;
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
	currentTesterFunc();
	//itemParser.parseJSON(YPipeObj.value.items);
	
	document.getElementById('loading').style.display = 'none'; //remove loading indicator
	
}

function drawTable(pip, outputDiv) {
	
	//Draw Google Viz
	var dataT = new googleDataTable();
	
	dataT.makeColumns(pip);
	dataT.makeRows(pip);
	
	// Create and draw the visualization.
	visualization = new google.visualization.Table(document.getElementById(outputDiv));
	visualization.draw(dataT.JSONdata, {
			'allowHtml' : true
		});
		
	//Displays control dashboard
	ControlDashboard.propagateAttributeBoxes( dataT );
	
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
function GetParametersFromInputFields() {
	
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

//Runs allways, put test code in here
 