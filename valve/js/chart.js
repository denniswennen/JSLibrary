// Load the Visualization API and the piechart package.
	
google.load('visualization', '1', {
		'packages' : ['corechart', 'table']
	});
	
// Load multiple Google packages:
// google.load('visualization', '1', {'packages':['corechart', 'table', 'geomap']});


// Set a callback to run when the Google Visualization API is loaded.
//google.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.






function drawChart() {
	
	// Create our data table.
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Topping');
	data.addColumn('number', 'Slices');
	data.addRows([
			['Mushrooms', 3],
			['Onions', 1],
			['Olives', 1],
			['Zucchini', 1],
			['Pepperoni', 2]
		]);
	
	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
	chart.draw(data, {
			width : 400,
			height : 240
		});
}

function drawVisualization(data) {


}

function testFunction() {

	var data = new google.visualization.DataTable(),
		//kol1 = new GColumn("number","Count","countColumn"),
		//kol2 = new GColumn("string", "Text", "textColumn"),
		temp = new GoogleColumn(),
		columns = [],
		inputAttr = [],
		type,
		label,
		id;
		
	var number = 1,
		str = "namen";
		
	// Get the attributes that were selected
	inputAttr = document.getElementById('selectedAttributes').innerHTML.split(" | ");
	
	//define the columns for the chart
	for(i=0; i<inputAttr.length; i++) {
		temp = MakeGoogleColumn(inputAttr[i]);
		data.addColumn(temp.type, temp.label, temp.id);
	}
	
	//define the rows for the chart
	var count = pipeObj.count
	data.addRows(count);
	for(i=0; i<count; i++) {
		data.setValue(i, 0, pipeObj.value.items[i].title);
		data.setValue(i, 1, pipeObj.value.items[i].category);		//works not yet !!!
	}
	
	
	// Create and draw the TABLE visualization.
	visualization = new google.visualization.Table(document.getElementById('jsontable'));
	visualization.draw(data, {'allowHtml': true});

}

function MakeGoogleColumn(v) {
	
	var type = typeof(v),
		label = v,
		id = v + "_column",
		googleCol = new GoogleColumn(type, label, id);
		
	return googleCol;
}

// Google Chart Column
function GoogleColumn(type, label, id) {
	this.type = type;
	this.label = label;
	this.id = id;
}	




 