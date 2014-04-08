function dayRange(start, stop)
{
	return ( stop.getTime() - start.getTime() ) / 86400000;
}

function createLine(eq, n)
{
	var l = eq.length;

	var data = [];

	for(var i = 0; i < n; i++)
	{
		var tmp = 0;

		for(var j = 0; j < l; j++)
		{
			tmp = tmp + ( eq[j] * Math.pow(i, j) );
		}

		data.push(tmp);
	}

	return data;
}

function polynomial(order, data)
{
	rows = data.length;

	var initial = new Date(data[0].date).getTime() / 86400000;

	if(order > rows)
	{
		order = rows;
	}

	var nd = [];
	var matrix = [];

	//Sets up the new data using the ranges between dates as the x-coordinate
	for(var i = 0; i < order; i++)
	{
		var n = new Date(data[i].date).getTime() / 86400000;
		var x = n - initial;
		var y = data[i].value;

		nd.push( {x: x, y: y} );
	}

	//Sets up the matrix to be put into reduced row echelon form
	for(var j = 0; j < order; j++)
	{
		var temp = [];

		for(var n = 0; n < order; n++)
		{
			temp.push( 1 * (Math.pow(nd[j].x, n)) );
		}

		temp.push( nd[j].y );
		matrix.push(temp);
	}

	coo = matrix;

	//Begins reducing the matrix into reduced row echelon form
	var reducedMatrix = rowReduce(matrix);

	console.log(matrix.slice());

	var b = getRightColumn(matrix);

	return b;
}

function getRightColumn(matrix)
{
	var b = [];
	var rows = matrix.length;
	var columns = matrix[0].length;

	for(var g = 0; g < rows; g++)
	{
		b.push( matrix[g][columns - 1] );
	}

	return b;
}

function rowReduce(matrix)
{
	//This function takes an AUGMENTED matrix (an array of arrays) and reduces the matrix to reduced row echelon form using Gaussian elimination (I think its this method at least).
	// - matrix : this will be of the form:
	// [ [2, 3, 4],
	//   [9, 8, 7],
	//   [4, 5, 6] ]
	//
	// The function will return an augmented matrix with the values in the rightmost column

	var rows = matrix.length;
	var columns = matrix[0].length;

	for(var i = 1; i < rows; i++)
	{

		for(var k = i; k < (rows); k++)
		{

			var multiplier = (matrix[k][i-1] / matrix[i-1][i-1]) * (-1);

			var tmp = [];

			for(var j = 0; j < columns; j++)
			{
				tmp.push( (matrix[i-1][j] * multiplier) + matrix[k][j] );
			}

			var divisor = tmp[i];

			for(var n = 0; n < columns; n ++)
			{
				tmp[n] = tmp[n] / divisor;
			}

			matrix[k] = tmp.slice();

		}
	}

	//NOW GO IN REVERSE
	for(var a = (rows - 1); a > 0; a--)
	{

		for(var b = a; b > 1; b--)
		{

			var tmp = [];
			var multiplier = (-1) * ( matrix[b - 1][a] / matrix[a][a] );

			for(var c = 0; c < columns; c++)
			{
				tmp.push( (matrix[a][c] * multiplier) + matrix[b-1][c] );
			}

			matrix[b-1] = tmp;
		}

	}

	return matrix;
}

function printEquation(eq, prec)
{
	// returns a string of the polynomial equation.

	prec = prec || 3;

	var n = eq.length;
	var eqArr = [];

	eqArr.push( 'y =' );

	for(var i = 0; i < n; i++)
	{
		var str;

		str = '' + eq[i].toFixed(prec) + '';

		if(eq[i] < 0)
		{
			var op = '-';
			str = str.substring(1);

			if(i == 0)
			{
				str = '- ' + str;
			}
		}
		else
		{
			op = '+';
		}

		if(i > 0)
		{
			str = op + ' ' + str;
			str += ' x';
		}

		if(i > 1)
		{
			str += '^' + i;
		}

		eqArr.push( str );
	}
	
	return eqArr.join(" ");
}