//		valve.js 1.1.6
//		(c) 2011 Dennis Swennen
//		Valve is a JavaScript library for loading, manipulating and displaying data trough Yahoo(c) Pipes.
//		For all details and documentation:
//		https://github.com/denniswennen/JSLibrary


// Baseline setup
google.load('visualization', '1', {
		'packages' : ['corechart', 'table', 'charteditor']
	});

var json3 = {
	"d" : "[{\"Id\":1,\"UserName\":\"Sam Smith\"},{\"Id\":2,\"UserName\":\"Fred Frankly\"},{\"Id\":1,\"UserName\":\"Zachary Zupers\"}]"
}

var mainpipe,
	wrapper,
	pipeLoaded = false,
	pipeConfirmed = false,
	pipelist = {
	"7a31ec30311b205544ee744b872f4417" : {
		name : "Sparen en Beleggen - tijd.be",
		url : "http://pipes.yahoo.com/pipes/pipe.info?_id=7a31ec30311b205544ee744b872f4417",
		params : []
	},
	"f7ce5f42573f2aba3aa11fb99a38c66d" : {
		name : "Referrals Test",
		url : "http://pipes.yahoo.com/pipes/pipe.info?_id=f7ce5f42573f2aba3aa11fb99a38c66d",
		params : []
	},
	"45ac0c6883a348080eaa4522ff10e9e7" : {
		name : "Combined Feeds",
		url : "http://pipes.yahoo.com/pipes/pipe.info?_id=45ac0c6883a348080eaa4522ff10e9e7",
		params : []
	},
	"0h4I8bvB3BGapGYoxJtC8g" : {
		name: "Google News on Map",
		url : "http://pipes.yahoo.com/pipes/pipe.info?_id=0h4I8bvB3BGapGYoxJtC8g",
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
	this.currentDataView = [];
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

pipe.prototype.updateGoogleData = function () {
	
	var items;
	
	this.gTable = new googleDataTable();
	this.gTable.setColumns(this.flatItems[0]);

		/*
	for (i = 0; i < itemsLength; i++) {
		this.flatItems.push(flatten(pipeItems[i]));
	}
	*/
	
	this.gTable.fillColumns(this.flatItems);
	
}

//User input the attribute name and get an array with all the values back, usefull to use the array of values as data somewhere else
pipe.prototype.collect_data_array = function (key) {
	
	var arr = [],
	items,
	itemsLength;
	
	items = this.flatItems;
	itemsLength = this.flatItems.length;
	
	for (i = 0; i < itemsLength; i++) {
		arr.push(items[i][key]);
	}
	
	return arr;
}

//Return an object which contains all the pipe's parameters & their types
pipe.prototype.get_data_attributes = function () {
	
	var item,
	prop,
	type,
	attrListObj = {},
	i = 0;
	
	item = this.flatItems[0];
	
	for (prop in item) {
		type = Object.prototype.toString.call(item[prop]).slice(8, -1);
		attrListObj[prop] = {};
		attrListObj[prop].id = i;
		attrListObj[prop].type = type;
		attrListObj[prop].value = item[prop];
		i++;
	}
	
	return attrListObj;
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
		
		var item = mainpipe.flatItems[0];
		
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
	var pipe,
	o;
	
	pipe = mainpipe;
	o = mainpipe.get_data_attributes();
	
	pipe.updateGoogleData();
	
	//update JSON view
	try {
		outputDoc = this.jsonFormatter.jsonToHTML(pipe.value, this.uri);
	} catch (e) {
		outputDoc = this.jsonFormatter.errorPage(e, this.data, this.uri);
	}
	
	document.getElementById('jsondata').innerHTML = outputDoc;
	addClickHandlers();
	
	//update GOOGLE DATA TABLE
	//updateTable(pipe, "jsontable");
	
	//update CONTROL DASHBOARD
	updateControlDashboard();
	
	//CREATING ALL THE DATA TABLES
	$('#keytable').remove();
	$('#DynamicGrid').append(CreateKeysView(o, "lightPro", true)).fadeIn();
	create_checkboxes();
}

function updateControlDashboard() {
	
	var gTableObj = mainpipe.gTable;
	//Updates control dashboard
	//ControlDashboard.propagateAttributeBoxes( gTable );
	//document.getElementById("datatypes").innerHTML = ControlDashboard.makeAttributesList(gTableObj);
	
}

function createPipeList() {
	var dropdownbox = document.getElementById('pipelist');
	
	for (var id in pipelist) {
		addOption(dropdownbox, pipelist[id].name, id);
	}
}

function update_UI() {
	
	var id;

	id = GetSelectedValue('pipelist');
	$('.button:not("#importpipebutton")').css('visibility', 'hidden');
	$('#div_timeline, #div_googlechart')
			.css('visibility', 'hidden')
			.css('display', 'none');
	createYQLscriptTag(id);
	
	$('#keytable').remove();
	pipeLoaded = false;
}












//##########################################################################################################
// PIPE CALLS
//##########################################################################################################
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
	
	uri = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fpipes.yahoo.com%2Fpipes%2Fpipe.info%3F_id%3D' + pipeID + '%22%20and%20xpath%20%3D%20\'%2F%2Fdiv%2Fform%2Ftable%2F*%2F*%2Finput%5Bnot%20(%40name%3D%22_cmd%22)%5D\'&format=json&diagnostics=true&callback=set_pipe_parameters';
	
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
	text = "";
	
	out_div = document.getElementById("pipeparameters");
	text += '<fieldset>';
	
	if (o.query.count > 0) { // the pipe has parameters
		list = o.query.results.input;
		id = GetSelectedValue('pipelist');
		pipelist[id].params.length = 0; //clears the parameters for the current selected pipe
		
		//multiple returned parameters
		if ($.isArray(list)) {
			for (i = 0; i < list.length; i++) {
				pipelist[id].params.push(list[i]);
				//text += list[i].name + '<input type="text" class="param_value" name="' + list[i].value + '" id="value' + (i + 1) + '"/><br>';
				text += "<p><label for='value1'>"+list[i].name+"</label><input type='text' class='required param_value' name='"+list[i].value+"' id='value" +(i+1) + "' /></p>";
			}
		}
		//only found 1 parameter
		else { //Object
			pipelist[id].params.push(list);
			text += "<p><label for='value1'>"+list.name+"</label><input type='text' class='required param_value' name='" + list.value + "' id='value1'/></p>";
		}
		
	} else {
		text = "(This pipe has no parameters)";
	}
	
	text += "</fieldset>"
	//text = "tetten: " + '<input type="text" class="param_value" name="'+ "tettenvalue1" + '" id="' + "tettenvalue1" +'"/>';
	out_div.innerHTML = text;
	
	$('#commentForm').validate();
	
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
		
		for (i = 0; i < paramList.length; i++) {
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
	
	//console.log ( $('input.param_value').val() );
	
	if( $('input:text.param_value[value=""]').length > 0 ) {
		update_status_text("no parameter", "error");
	}
	
	else {
		
		request = createCORSRequest("get", createRequestURI(id));
		renderType = getRenderType();
		
		update_status_text("pipe is loading..", "warning");
		document.getElementById('statusicon').style.display = 'inline';
		
		if (request) {
			request.onload = function () {
				
				if (renderType == "json") {
					var r = JSON.parse(request.responseText, pipeReviver); //the actual parsing from Yahoo Pipes to a Javascript object
					//do something with the returned JSON object 'r'
					if (r.count != 0) {
						processJSONResponse(r);
						pipeLoaded = true;
						//document.getElementById("statustext").innerHTML = r.count + " items loaded.";
						update_status_text( r.count + " pipe items loaded");	
						$(".button").css('visibility', 'visible');
					}
				} else if (rendertype == "kml") {
					//do something
				}
				
			};
			request.send();
		}
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
	
	var o;
	
	mainpipe = new pipe(response);
	mainpipe.flatten_data();
	
	o = mainpipe.get_data_attributes();
	
	//CREATING ALL THE DATA TABLES
	$('#keytable').remove();
	$('#DynamicGrid').append(CreateKeysView(o, "lightPro", true)).fadeIn();
	create_checkboxes();
	
	//Displays Google Data Table
	//drawTable(mainpipe, 'jsontable');
	
	this.jsonFormatter = new JSONFormatter();
	
	try {
		outputDoc = this.jsonFormatter.jsonToHTML(mainpipe.value, this.uri);
	} catch (e) {
		outputDoc = this.jsonFormatter.errorPage(e, this.data, this.uri);
	}
	
	document.getElementById('jsondata').innerHTML = outputDoc;
	addClickHandlers();
	
	document.getElementById('statusicon').style.display = 'none'; //remove loading indicator
	
}












//##########################################################################################################
// VISUALISATION
//##########################################################################################################
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
	
	dataTable = mainpipe.gTable.data;
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


function get_selected_attributes() {

	var selectedNames,
		selectedValues,
		key,
		value,
		i,
		hash = [], //result
		div,
		str,
		count = 0;

	selectedNames = $("#keytable").find(".selected th span");
	selectedValues = $("#keytable tr")
		.filter(".selected")
		.find("td.numberCell");
		
	for(i=0; i < selectedNames.length; i++ ) {
		key = selectedNames[i].innerHTML;
		value = parseInt( selectedValues[i].innerHTML, 10 );
		hash[value] = key;
	}
	
	
	div = document.getElementById("selectedattr_div");
	
	str = '<ul>'
	
	for(i=1; i < hash.length; i++ ) {
		str += "<li>Column " + i + ": " + hash[i] + "</li>";
		count++;
	}
	
	mainpipe.gTable.currentDataView = hash; //stores the selected attributes in the main pipe

	//update
	div.innerHTML = str;
	update_status_text( count + " attributes selected");
	pipeConfirmed = true;
	
}

function draw_selected_attributes() {
	
	var dataTable,
	dataView,
	chart,
	colNumbers = [],
	keyNamesArray = [],
	chart = 'ColumnChart',
	prop,
	dataAttributes,
	i,
	n,
	a,
	chartEditor = null,
	typeChart,
	container,
	components;
	
	
	if( pipeLoaded && pipeConfirmed ) {
	
		var div = $('#div_googlechart');
		div.css('display', 'inherit').css('visibility', 'visible');
					
		dataAttributes = mainpipe.get_data_attributes();
		//selectedKeys = $("#keytable tr").find("span.selected");
		
		
		//GET THE HASH THAT CONTAINS THE SLELECTED ATTRIBUTES
		a = mainpipe.gTable.currentDataView;
		
		for (i=1; i < a.length; i++) {
			colNumbers.push( dataAttributes[a[i]].id );
		}

		dataTable = mainpipe.gTable.data;
		dataView = new google.visualization.DataView(dataTable);
		dataView.setColumns(colNumbers);
		
		typeChart = GetSelectedText('typeChart');
		
		wrapper = new google.visualization.ChartWrapper({
					chartType : typeChart,
					options : {
						width : 900,
						heigth : 300,
						legend : "bottom"
					},
					containerId : 'visualization',
				});
		
		wrapper.setDataTable(dataView);
		//wrapper.setView(dataView);
		wrapper.draw();
		
		console.log (dataView.toDataTable().toJSON() );
		
		
		container = document.getElementById('googletoolbar_div');
		components = [ {type: 'html', datasource: dataView.toDataTable().toJSON() },
			{
				type : 'htmlcode',
				datasource : dataView,
				gadget : 'https://www.google.com/ig/modules/pie-chart.xml',
				userprefs : {
					'3d' : 1
			},
			style : 'width: 800px; height: 700px; border: 3px solid purple;'
			}
		];
		google.visualization.drawToolbar(container, components);
	}
	else {
		update_status_text("Please load pipe & confirm attributes.", "error");
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
	
	dataTable = mainpipe.gTable.data;
	dataView = new google.visualization.DataView(dataTable);
	dataView.setColumns(colNumbers);
	
	wrapper = new google.visualization.ChartWrapper({
				chartType : chart,
				options : {
					width : 900,
					heigth : 300
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
		function () {
			wrapper = editor.getChartWrapper();
			wrapper.draw(document.getElementById('visualization'));
		});
	editor.openDialog(wrapper);
}

function redrawChart() {
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
	
	items = mainpipe.flatItems;
	key = GetSelectedText('attr1dropdown');
	type = GetSelectedText('conversionType');
	
	for (i = 0; i < items.length; i++) {
		items[i][key] = typeConvert(type, items[i][key]);
	}
	
	mainpipe.flatItems = items;
	
	update();
	
}

function convert_selected_attributes() {
	
	var items,
	keysArray,
	key,
	type,
	i,
	outputDoc,
	div;
	
	items = mainpipe.flatItems;
	//key = GetSelectedText('attr1dropdown'),
	//get the attributes that need to be converted
	
	keys = $("#keytable").find(".selected th span");
	
	console.log ( keys );
	
	type = GetSelectedText('conversionType');
	
	for (i = 0; i < items.length; i++) {
		for (j = 0; j < keys.length; j++) {
			key = keys[j].innerHTML;
			items[i][key] = typeConvert(type, items[i][key]);
		}
	}
	
	mainpipe.flatItems = items;
	update_status_text(keys.length + " attribute(s) converted to " + type, "warning");
	div = document.getElementById("selectedattr_div").innerHTML = "";
	pipeConfirmed = false;
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
 