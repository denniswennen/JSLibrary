//		valve.js 1.1.6
//		(c) 2011 Dennis Swennen
//		Valve is a JavaScript library for loading, manipulating and displaying data trough Yahoo(c) Pipes.
//		For all details and documentation:
//		https://github.com/denniswennen/JSLibrary


// Baseline setup


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
}

// Loading functions
// Parsing functions
// Object functions
/** convert the input url **/
function pipeCall(inputURL) {
	var url,
		paramObj,
		str = '';
		
	paramObj = GetParameters();
		
	for(var prop in paramObj) {
    if(paramObj.hasOwnProperty(prop))
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
function pipeCallback(response) {
	var output;
	
	pipeObj = response;
	debug("respone.count:" + pipeObj.count);
	
	//output = val(response);
	//document.getElementById('attributeslist').innerHTML = output;
	
	this.jsonFormatter = new JSONFormatter();
	
	try {
		outputDoc = this.jsonFormatter.jsonToHTML(response, this.uri);
	} catch (e) {
		outputDoc = this.jsonFormatter.errorPage(e, this.data, this.uri);
	}
	
	document.getElementById('jsondata').innerHTML = outputDoc;
	addClickHandlers();
	
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

function GetParameters() {
	
	var param_names = document.getElementsByClassName("param_name"),
		param_values = document.getElementsByClassName("param_value"),
		paramObj = {};
	
	for (var i = 0; i < param_names.length; i++) {
		if( param_names[i].value != '' && param_values[i].value != '' ) {
			paramObj[param_names[i].value] = param_values[i].value;
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
 