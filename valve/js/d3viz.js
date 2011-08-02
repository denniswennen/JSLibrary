
function testViz() {
	var data = pipeObj.value; //array of Referrals
	


	//variable for the chart DIV
	var chart = d3.select("body")
		.append("div")
			.attr("class", "chart");
		
			
	//select all DIV child elements of chart
	chart.selectAll("div")
			.data(data.items)
		.enter().append("div")
			.style("width", function(d) {return d.TotalClicks*3 + "px";})
			.text(function(d) {return d.RefName; });

	
		
			
	var x = d3.scale.linear()
		.domain([0,d3.max(data.TotalClicks)])
		.range(["0px","840px"]);
		
	chart.selectAll("div")
			.data(data)
		.enter().append("div")
			.style("width", x)
			.text(String);
		
}