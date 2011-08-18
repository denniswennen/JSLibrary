//		valve.js 1.1.6
//		(c) 2011 Dennis Swennen
//		Valve is a JavaScript library for loading, manipulating and displaying data trough Yahoo(c) Pipes.
//		For all details and documentation:
//		https://github.com/denniswennen/JSLibrary


// Baseline setup
google.load('visualization', '1', {
		'packages' : ['corechart', 'table', 'charteditor']
	});

	
var json3 = { "d": "[{\"Id\":1,\"UserName\":\"Sam Smith\"},{\"Id\":2,\"UserName\":\"Fred Frankly\"},{\"Id\":1,\"UserName\":\"Zachary Zupers\"}]" }

var pipe1,
	wrapper;
	pipelist = {
		"7a31ec30311b205544ee744b872f4417" : {
			name: "Sparen en Beleggen - tijd.be",
			url: "http://pipes.yahoo.com/pipes/pipe.info?_id=7a31ec30311b205544ee744b872f4417",
			params : []
		},
		"f7ce5f42573f2aba3aa11fb99a38c66d" : {
			name: "Referrals Test",
			url: "http://pipes.yahoo.com/pipes/pipe.info?_id=f7ce5f42573f2aba3aa11fb99a38c66d",
			params : []
		}
	};

//GLobal only item for representing the returned JSON object

// --------------  PRIVATE ATTR ----------------

//UPDATED: pipe Object constructor
function pipe(json) {
	
	this.count = json.count;
	this.value = json.value; // original value parsed from the JSON strike
	this.gTable = new googleDataTable();
	this.params = {};
	this.flatItems = []; //contain all the items with flattened objects
	
}

// GOOGLE DATA TABLE FUNCTIONS
function googleDataTable() {
	this.data = new google.visualization.DataTable();
	this.attributes = [];
}

//takes an object, makes it flat so it is 1 object with properties. All this properties are converted into Google Data Table columns
googleDataTable.prototype.setColumns = function (obj) {
	var flatObj = flatten(obj),
	clas;
	
	//check for "null" datatypes
	for (prop in flatObj) {
		clas = Object.prototype.toString.call(flatObj[prop]).slice(8, -1).toLowerCase();
		if (clas !== 'null' && clas !== 'undefined') {
			this.data.addColumn(clas, prop.toString(), "col_" + prop.toString());
			this.attributes.push(prop); // CHANGE PLACE?
		}
	}
}

// input: flat Array which contains all the items, each item is an object
googleDataTable.prototype.fillColumns = function (dataArray) {
	var dataTable = this.data,
	//items = pipeObj.value.items,
	count = dataArray.length,
	i,
	propNr,
	tempObj;
	
	dataTable.addRows(count); //first adds the rows in the DataTable
	
	for (i = 0; i < count; i++) {
		propNr = 0;
		tempObj = dataArray[i];
		for (prop in tempObj) {
			if (tempObj[prop] !== null && tempObj[prop] !== undefined) {
				dataTable.setCell(i, propNr, tempObj[prop]);
				propNr++;
			}
		}
	}
	
}

pipe.prototype.flatten_data = function () {

	var pipeItems,
		pipeItemsLength;
	
	pipeItems = this.value.items;
	pipeItemsLength = pipeItems.length;
	
	for (i = 0; i < pipeItemsLength; i++) {
		this.flatItems.push(flatten(pipeItems[i]));
	}


}

pipe.prototype.initDataTable = function () {
	
	this.gTable.setColumns(this.value.items[0]);
	this.gTable.fillColumns(this.flatItems);
	
}

pipe.prototype.updateData = function () {
	
	var items,
	itemsLength;
	
	this.gTable = new googleDataTable();
	this.gTable.setColumns(this.flatItems[0]);
	
	for (i = 0; i < itemsLength; i++) {
		this.flatItems.push(flatten(pipeItems[i]));
	}
	
	this.gTable.fillColumns(this.flatItems);
	
}

//User input the attribute name and get an array with all the values back, usefull to use the array of values as data somewhere else
pipe.prototype.getAttributeData = function (attrName) {
	
	var arr = [],
	items,
	itemsLength;
	
	items = this.flatItems;
	itemsLength = this.flatItems.length;
	
	for (i = 0; i < itemsLength; i++) {
		arr.push(items[i][attrName]);
	}
	
	return arr;
}





//##########################################################################################################
// USER interface
//##########################################################################################################
var ControlDashboard = {
	
	propagateAttributeBoxes : function (dataT) {
		
		var i,
		arr = dataT.attributes;
		
		for (i = 0; i < arr.length; ++i) {
			addOption(document.getElementById("attr1dropdown"), arr[i], arr[i]);
			addOption(document.getElementById("attr2dropdown"), arr[i], arr[i]);
		}
		
	},
	
	makeAttributesList : function (dataT) {
		
		var i,
		arr = dataT.attributes,
		type,
		output;
		
		var item = pipe1.flatItems[0];
		
		output = "<ul>";
		for (prop in item) {
			type = clas = Object.prototype.toString.call(item[prop]).slice(8, -1);
			output = output + "<li>" + prop + " (" + type + ") " + "</li>";
		}
		
		output += "</ul>";
		
		return output;
		
	}
	
};

function update() {
	
	//update DATA
	var pipe = pipe1;
	
	pipe.updateData();
	
	//update JSON view
	try {
		outputDoc = this.jsonFormatter.jsonToHTML(pipe.flatItems, this.uri);
	} catch (e) {
		outputDoc = this.jsonFormatter.errorPage(e, this.data, this.uri);
	}
	
	document.getElementById('jsondata').innerHTML = outputDoc;
	addClickHandlers();
	
	//update GOOGLE DATA TABLE
	updateTable(pipe, "jsontable");
	
	//update CONTROL DASHBOARD
	updateControlDashboard();
}

function updateControlDashboard() {
	
	var gTableObj = pipe1.gTable;
	//Updates control dashboard
	//ControlDashboard.propagateAttributeBoxes( gTable );
	document.getElementById("datatypes").innerHTML = ControlDashboard.makeAttributesList(gTableObj);
	
}

function createPipeList() {
	var dropdownbox = document.getElementById('pipelist');
	
	for (var id in pipelist) {
		addOption(dropdownbox, pipelist[id].name, id);
	}
}

function updateParameters() {
	
	var id = GetSelectedValue('pipelist');
	createYQLscriptTag(id);
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

function createYQLscriptTag(pipeID) {

var uri,
	scriptEl,
	scriptInsert;
	
	uri = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fpipes.yahoo.com%2Fpipes%2Fpipe.info%3F_id%3D' + pipeID +'%22%20and%20xpath%20%3D%20\'%2F%2Fdiv%2Fform%2Ftable%2F*%2F*%2Finput%5Bnot%20(%40name%3D%22_cmd%22)%5D\'&format=json&diagnostics=true&callback=set_pipe_parameters';
	
	scriptEl = document.createElement('script');
	//scriptEl.type = 'text/javascript';
	scriptEl.src = uri;
	scriptInsert = document.getElementsByTagName('script')[0];
	scriptInsert.parentNode.insertBefore(scriptEl, scriptInsert);
	
	console.log(uri);

}

function set_pipe_parameters(o) {

	var list,
		id,
		el,
		out_div,
		text;
		
	out_div = document.getElementById("pipeparameters");
	text = "";
	
	if( o.query.count > 0 ) { // the pipe has parameters
		list = o.query.results.input;
		id = GetSelectedValue('pipelist');
		pipelist[id].params.length = 0; //clears the parameters for the current selected pipe
		
		//multiple returned parameters
		if ( $.isArray(list) ) {
			for(i=0; i<list.length; i++) {
				pipelist[id].params.push(list[i]);
				text += list[i].name + '<input type="text" class="param_value" name="'+ list[i].value + '" id="value' + (i+1) +'"/><br>';
			}
		}
		//only found 1 parameter
		else { //Object
			pipelist[id].params.push(list);
			text += list.name + '  <input type="text" class="param_value" name="'+ list.value + '" id="value1"/><br>';
		}
		
		
	}
	
	else {
		text = "(This pipe has no parameters)";
	}
	

	//text = "tetten: " + '<input type="text" class="param_value" name="'+ "tettenvalue1" + '" id="' + "tettenvalue1" +'"/>';
	out_div.innerHTML = text;
	
	
}

function createRequestURI(id) {
	
	var fullUri,
	paramObj,
	paramList,
	param_values,
	rendertype,
	uri,
	str = '';
	
	uri = pipelist[id].url;
	//paramObj = GetParametersFromInputFields();
	paramList = pipelist[id].params;
	rendertype = getRenderType();
	param_values = document.getElementsByClassName("param_value")
	
	for (i=0; i< paramList.length; i++) {
			str += "&" + paramList[i].name + "=" + param_values[i].value;
	}
	
	fullUri = uri.replace("info", "run");
	fullUri += "&_render=",
	fullUri += rendertype;
	fullUri += str;
	//fullUri += "&_callback=pipeCallback";
	
	return fullUri;
}

function pipeCallCORS() {
	
	var request,
	renderType,
	id,
	inputurl;
	
	id = GetSelectedValue('pipelist');
	
	
	request = createCORSRequest("get", createRequestURI( id ));
	renderType = getRenderType();
	
	document.getElementById('loading').style.display = 'inline';
	
	if (request) {
		request.onload = function () {
			
			if (renderType == "json") {
				var r = JSON.parse(request.responseText, pipeReviver); //the actual parsing from Yahoo Pipes to a Javascript object
				//do something with the returned JSON object 'r'
				if (r.count != 0) {
					processJSONResponse(r);
					//console.log("Pipe URL: " + createRequestURI(inputURL));
					debug(r.count);
				}
			} else if (rendertype == "kml") {
				//do something
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
function processJSONResponse(response) {
	
	pipe1 = new pipe(response);
	pipe1.flatten_data();
	
	
	//CREATING ALL THE DATA TABLES
	$('#DynamicGrid').append(CreateTableView( pipe1.flatItems , "lightPro", true)).fadeIn();
	
	//Displays Google Data Table
	//drawTable(pipe1, 'jsontable');
	
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

function drawTable(pipeObj, outputDiv) {
	
	//Inits the Google Data Table (property of the pipe obj) for the 1st time
	pipeObj.flatten_data();
	pipeObj.initDataTable();
	
	// Create and draw the visualization.
	visualization = new google.visualization.Table(document.getElementById(outputDiv));
	visualization.draw(pipeObj.gTable.data, {
			'allowHtml' : true,
		});
	
	//Displays control dashboard
	ControlDashboard.propagateAttributeBoxes(pipeObj.gTable);
	updateControlDashboard(pipeObj.gTable);
	
	//var a = pipeObj.getAttributeData("RefName");
	
}

function updateTable(pipeObj, outputDiv) {
	
	visualization = new google.visualization.Table(document.getElementById(outputDiv));
	visualization.draw(pipeObj.gTable.data, {
			'allowHtml' : true,
		});
	
}

function drawExampleChart() {
	
	//raw data
	var dataTable,
	dataView,
	chart,
	colNumbers = [];
	

	
	dataTable = pipe1.gTable.data;
	dataView = new google.visualization.DataView(dataTable);
	dataView.setColumns(colNumbers);
	
	if ("ColumnChart" == vizType) {
		chart = new google.visualization.ColumnChart(document.getElementById('visualization'));
		chart.draw(dataView, {
				width : 900,
				height : 300
			});
	}
	
}

function draw() {

	var dataTable,
	dataView,
	chart,
	colNumbers = [],
	chart = 'ColumnChart';
	
	var chartEditor = null;
	
	//perform query, select the data used from the attributeboxes
	colNumbers.push(document.getElementById('attr1dropdown').selectedIndex);
	colNumbers.push(document.getElementById('attr2dropdown').selectedIndex);
	
	dataTable = pipe1.gTable.data;
	dataView = new google.visualization.DataView(dataTable);
	dataView.setColumns(colNumbers);

	wrapper = new google.visualization.ChartWrapper({
				chartType : chart,
				options: {
					width: 900,
					heigth: 300
				},
				containerId : 'visualization',
			});
			
	wrapper.setDataTable(dataView);
	//wrapper.setView(dataView);
	wrapper.draw();

}

function openEditor() {
  // Handler for the "Open Editor" button.
  var editor = new google.visualization.ChartEditor();
  google.visualization.events.addListener(editor, 'ok',
    function() { 
      wrapper = editor.getChartWrapper();  
      wrapper.draw(document.getElementById('visualization')); 
  }); 
  editor.openDialog(wrapper);
}

function redrawChart(){
        chartEditor.getChartWrapper().draw(document.getElementById('visualization'));
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

function get_parameter_value_from_input() {
	
	var param_values = document.getElementsByClassName("param_value"),
	paramObj = [],
	i;
	
	for (i = 0; i < param_values.length; i++) {
		var key = param_names[i].value,
		value = param_values[i].value;
		
		if (key != '' && value != '') {
			paramObj[key] = value;
			
		}
	}
	
	return paramObj;
}

// Prints out debug variable
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
	
	if ('Boolean' == type) {
		return (obj == "true" ? true : false);
	}
	
	if ('String' == type) {
		return obj = String(obj);
	}
	
	if ('Number' == type) {
		return parseInt(obj, 10);
	}
	
}

function convertData() {
	
	var items,
	key,
	type,
	i,
	outputDoc;
	
	items = pipe1.flatItems;
	key = GetSelectedText('attr1dropdown'),
	type = GetSelectedText('conversionType');
	
	for (i = 0; i < items.length; i++) {
		items[i][key] = typeConvert(type, items[i][key]);
	}
	
	pipe1.flatItems = items;
	
	update();
	
}
//Examines the JSON string and converts it into the right JavaScript data type
function pipeReviver(key, value) {
	
	var d = new Date(),
	numbers = ['count', 'milliseconds', 'year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond', 'day_of_week'];
	
	if ("object" === typeof value) {
		return value;
	} else if (numbers.indexOf(key) >= 0) {
		return +value;
	} else if (key === "pubDate") {
		return new Date(value);
	}
	
	return value;
}

// Creates a linear object from a structered object
function flatten(obj) {
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
	walk(obj);
	return output;
}

// -------------GOOGLE MAPS------------------------------

//called after loading the Google MAPS API
function initialize() {
	var myLatlng = new google.maps.LatLng(-34.397, 150.644);
	var myOptions = {
		zoom : 8,
		center : myLatlng,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}

//loads the Google Maps API
function loadGoogleMapsAPI() {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
	document.body.appendChild(script);
	
}
 