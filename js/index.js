(function()
{

	getData();

})();

function getData()
{
	var url = "https://docs.google.com/spreadsheet/pub?key=0Ar9b16u8gRNVdGtLS1FBN0F0bTNJSElvVzU1VDdFWWc&output=csv"

	d3.csv(url, function(error, res)
	{
		console.log( res );
		buildgraph( res );
	});
}

function buildgraph( data )
{
	var container = d3.select("#graph");

	var margin = {top: 20, right: 100, bottom: 30, left: 50},
		width = parseInt( container.style("width") ) - margin.left - margin.right,
		height = parseInt( container.style("height") ) - margin.top - margin.bottom;

	// parse dates
	var parseDate = d3.time.format("%m/%d/%Y").parse;
	data.forEach(function(d){ d.Date = parseDate(d.Date); });

	var color = d3.scale.category20();
	var keys = d3.keys(data[0]).filter(function(key) { return (key !== "Date" && key !== "Blast") });

	var lines = keys.map(function(key, i)
	{
		return {
			"key"		: key,
			"color"		: color(i),
			"values" 	: data.map(function(d){ return { "date": d.Date, "value": +d[key] }; })
		};
	});

	// start all plants at 0
	lines.forEach(function(d, i)
	{
		var ini = d.values[0].value;

		d.values.forEach(function(dd, ii){ dd.value = dd.value - ini; });
	});	

	// var max = d3.max( data.map(function(d){ return d3.max( d3.keys(d).filter(function(key){ return (key !== "Date") }).map(function(key){ return +d[key]; }) ) }) );
	var max = d3.max( lines.map(function(d){ return d3.max( d.values.map(function(dd){ return dd.value; }) ) }) )
	max = max * 1.2

	var x = d3.time.scale()
		.range([0, width])
		.domain( d3.extent( data.map(function(d){ return d.Date; }) ) );

	var y = d3.scale.linear()
		.range([height, 0])
		.domain([0, max])

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

	var svg = container.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)

	var main = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	main.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	main.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Amount Grown [inches]");

	var visi = main.selectAll(".visi")
		.data( lines )
		.enter()
		.append("g")
		.attr("class", "visi");

	visi.append("path")
		.attr("class", "line")
		.attr("d", function(d) { return line(d.values); })
		.style("stroke", function(d) { return d.color; });

	var l = svg.append("g")
		.attr("transform", "translate(" + (margin.right) + "," + 0 + ")");

	var legend = l.selectAll(".legend")
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