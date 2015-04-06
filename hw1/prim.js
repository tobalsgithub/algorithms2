var fs = require('fs');

var vertices = {};
var visited = {};
var edgeCost = 0;

var read_file = function (filepath, cb) {

	fs.readFile(filepath, function (err, data) {
		var dataArray = data.toString().split('\n');
		var v1, v2, ec;

		for (var i = 1; i < dataArray.length; i++) {

			v1 = dataArray[i].split(' ')[0];
			v2 = dataArray[i].split(' ')[1];
			ec = parseInt(dataArray[i].split(' ')[2]);

			if (!vertices[v1]) {
				vertices[v1] = {};
			}

			if (!vertices[v1][v2] || vertices[v1][v2] > ec) {
				vertices[v1][v2] = ec;
			}

			if (!vertices[v2]) {
				vertices[v2] = {};
			}

			if (!vertices[v2][v1] || vertices[v2][v1] > ec) {
				vertices[v2][v1] = ec;
			}
		}

		cb(null);
	});
};

var prim = function () {
	var minEdge = 999999999999999999999999;
	var selectedV;

	if (Object.keys(visited).length === Object.keys(vertices).length) {
		return;
	}

	if (Object.keys(visited).length === 0 ) {
		visited[Object.keys(vertices)[0]] = true;
		console.log('Initial vertex is ' + Object.keys(vertices)[0]);
	}

	for (var v in visited) {
		for (var v2 in vertices[v]) {
			if (visited[v2]) continue;

			if (vertices[v][v2] < minEdge) {
				minEdge = vertices[v][v2];
				selectedV = v2;
			}
		}
	}

	edgeCost += parseInt(minEdge);
	visited[selectedV] = true;

	console.log();
	console.log(visited);
	console.log('Added vertext ' + selectedV + ' with edge cost ' + minEdge);

	return prim();
};

var start = function () {
	process.stdout.write('Filename: ');
	process.stdin.on('data', function (filename) {
		process.stdin.removeAllListeners('data');
		read_file(filename.toString().split('\n')[0], function (err, array) {
			console.log(vertices);
			prim();
			console.log(edgeCost);
			process.stdin.on('data', start);
		});
	});
};

start();

