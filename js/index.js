(function()
{

	getData();

})();

function getData()
{
	var url = "https://docs.google.com/spreadsheet/pub?key=0Ar9b16u8gRNVdGFCMHppN0ZGdmpkOVVoNFVwZ1k0N2c&output=csv"

	d3.csv(url, function(error, res)
	{
		buildgraph( res );
	});
}

function buildgraph( data )
{
	var container = d3.select("#graph");

	var margin = {top: 20, right: 80, bottom: 30, left: 50},
		width = parseInt( container.style("width") ) - margin.left - margin.right,
		height = parseInt( container.style("height") ) - margin.top - margin.bottom;

	// parse dates
	var parseDate = d3.time.format("%m/%d/%Y").parse;
	data.forEach(function(d){ d.Date = parseDate(d.Date); });

	var max = d3.max( data.map(function(d){ return d3.max([d.Organic, d.Reschedules]) }) );

	var x = d3.time.scale()
		.range([0, width])
		.domain( d3.extent( data.map(function(d){ return d.Date; }) ) );

	var y = d3.scale.linear()
		.range([height, 0])
		.domain([0, max])

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var line = d3.svg.line()
		.interpolate("basis")
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.value); });

	var keys = d3.keys(data[0]).filter(function(key) { return (key !== "Date" && key !== "Blast") });

	var lines = keys.map(function(key, i)
	{
		return {
			"key"		: key,
			"color"		: color(i),
			"values" 	: data.map(function(d){ return { "date": d.Date, "value": d[key] }; })
		};
	});

	var svg = container.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Visit Count");

	var visi = svg.selectAll(".visi")
		.data( lines )
		.enter()
		.append("g")
		.attr("class", "visi");

	visi.append("path")
		.attr("class", "line")
		.attr("d", function(d) { return line(d.values); })
		.style("stroke", function(d) { return d.color; });

	var legend = svg.selectAll(".legend")
		.data( lines )
		.enter()
		.append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", function(d){ return d.color; });

	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d.key; });
}