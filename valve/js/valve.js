//		valve.js 1.1.6
//		(c) 2011 Dennis Swennen
//		Valve is a JavaScript library for loading, manipulating and displaying data trough Yahoo(c) Pipes.
//		For all details and documentation:
//		https://github.com/denniswennen/JSLibrary


// Baseline setup
google.load('visualization', '1', {
		'packages' : ['corechart', 'table']
	});

var pipe1;

//GLobal only item for representing the returned JSON object

// --------------  PRIVATE ATTR ---------------- 

//UPDATED: pipe Object constructor
function pipe(json) {

	this.count = json.count;
	this.value = json.value;
	this.datatable = new googleDataTable();
	this.params = {};
	this.flatItems = []; //contain all the items with flattened objects
	
}



// GOOGLE DATA TABLE FUNCTIONS
function googleDataTable() {
	this.JSONdata = new google.visualization.DataTable();
	this.attributes = [];
}

googleDataTable.prototype.makeColumns = function (pipeObj) {
		//code to fill the dataTable with all the items from the Pipe
		//each row is an item. every parameter is added
		var json = flatten( pipeObj.value.items[0] ),
			clas;

		//check for "null" datatypes
		for (prop in json) {
			clas = Object.prototype.toString.call(json[prop]).slice(8, -1).toLowerCase();
			if( clas !== 'null' && clas !== 'undefined' ){
				this.JSONdata.addColumn(clas, prop.toString(), "col_" + prop.toString());
				this.attributes.push(prop); // CHANGE PLACE?
			}
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
			pipe1.flatItems.push( flatItem );
			propNr = 0;
			for (prop in flatItem) {
				if( flatItem[prop] !== null && flatItem[prop] !== undefined ) {
					dataTable.setCell(itemNr, propNr, flatItem[prop]);
					propNr++;
				}
			}
		}

}


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

function createRequestURI(uri) {
	
	var fullUri,
	paramObj,
	str = '';
	
	paramObj = GetParametersFromInputFields();
	
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
			var r = JSON.parse(request.responseText, pipeReviver); //the actual parsing from Yahoo Pipes to a Javascript object
			//do something with the returned JSON object 'r'
			if( r.count != 0 ) {
				processResponse( r );
				console.log ( "Pipe URL: " + createRequestURI(inputURL) );
				debug( r.count );
			}
			
			
		};
		request.send();
	}
	

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

// Handles the Pipe response Callback
function processResponse(response) {

	pipe1 = new pipe(response);
	
	//Displays Google Data Table
	drawTable(pipe1, 'jsontable');
	
	this.jsonFormatter = new JSONFormatter();
	
	try {
		outputDoc = this.jsonFormatter.jsonToHTML(pipe1.value, this.uri);
	} catch (e) {
		outputDoc = this.jsonFormatter.errorPage(e, this.data, this.uri);
	}
	
	document.getElementById('jsondata').innerHTML = outputDoc;
	addClickHandlers();
	
	
	document.getElementById('loading').style.display = 'none'; //remove loading indicator

}

function drawTable(pip, outputDiv) {
	
	//Draw Google Viz
	var dataT = new googleDataTable();
	
	dataT.makeColumns(pip);
	dataT.makeRows(pip);
	
	pipe1.datatable = dataT;
	
	// Create and draw the visualization.
	visualization = new google.visualization.Table(document.getElementById(outputDiv));
	visualization.draw(dataT.JSONdata, {
			'allowHtml' : true,
		});
		
	//Displays control dashboard
	ControlDashboard.propagateAttributeBoxes( dataT );
	
}

function drawExampleChart() {

	//raw data
	var dataTable,
		dataView,
		chart,
		colNumbers = [];
		

	//perform query, select the data used from the attributeboxes
	colNumbers.push (document.getElementById('attr1dropdown').selectedIndex );
	colNumbers.push (document.getElementById('attr2dropdown').selectedIndex );
	
	dataTable = pipe1.datatable.JSONdata;
	dataView = new google.visualization.DataView(dataTable);
	dataView.setColumns( colNumbers );
	
	chart = new google.visualization.ColumnChart(document.getElementById('visualization'));
	chart.draw(dataView, {width: 900, height: 300});
	
}


//-------------------------------------------------------------------------------------------------
// Parsing Items




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
		param_values = document.getElementsByClassName("param_value"),
		paramObj = {},
		i;
	
	
	for (i = 0; i < param_names.length; i++) {
		var key = param_names[i].value,
			value = param_values[i].value;
			
		if (key != '' && value != '') {
			paramObj[key] = value;
			
		}
	}
	
	return paramObj;
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

function typeCheck(type, obj) {
	var clas;
	
	clas = Object.prototype.toString.call(obj).slice(8, -1);
	return obj !== undefined && obj !== null && clas === type;
}

// Converts the value of an object's key into the type of the given type argument
function typeConvert(type, obj) {
	
	if( 'Boolean' == type ) { return ( obj == "true" ? true : false ); }
	
	if ('String' == type ) { return obj = String(obj); }
	
	if ('Number' == type ) { return parseInt(obj, 10); }
	

	
}

function convert() {
	
	var pipe,
		items,
		key,
		type,
		i,
		outputDoc;
	
	pipe = pipe1;
	items = pipe.flatItems;
	key = GetSelectedValue('attr1dropdown'),
	type = GetSelectedValue('conversionType');
	
	for(i=0;i<items.length;i++) {
		items[i][key] = typeConvert( type, items[i][key] ); 
	}
	
	pipe.flatItems = items;
	
	try {
		outputDoc = this.jsonFormatter.jsonToHTML(items, this.uri);
	} 
	catch (e) {
		outputDoc = this.jsonFormatter.errorPage(e, this.data, this.uri);
	}
	
	document.getElementById('jsondata').innerHTML = outputDoc;
	addClickHandlers();
	
}
//Examines the JSON string and converts it into the right JavaScript data type
function pipeReviver(key, value) {

	var d = new Date(),
		numbers = ['count', 'milliseconds', 'year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
	
	if ("object" === typeof value) { return value; }
	
	else if ( numbers.indexOf(key) >= 0 ) { 
		return +value;
	}
	
	else if (key === "pubDate") { 
		return new Date(value);
	}
	
	return value;
}

// Creates a linear object from a structered object
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

 