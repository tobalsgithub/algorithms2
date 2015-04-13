var fs = require('fs');

var vertices = {};
var edges = [];
var leaders = {};

var read_file = function (filepath, cb) {
	fs.readFile(filepath, function (err, data) {
		var dataArray = data.toString().split('\n');
		var v1, v2, ec;

		for (var i = 1; i < dataArray.length; i++) {
			v1 = dataArray[i].split(' ')[0];
			v2 = dataArray[i].split(' ')[1];
			ec = parseInt(dataArray[i].split(' ')[2]);

			if (!vertices[v1]) {
				vertices[v1] = {
					leader: v1
				};
				leaders[v1] = {};
				leaders[v1][v1]=  true;
			}

			// if (!vertices[v1][v2] || vertices[v1][v2] > ec) {
			// 	vertices[v1][v2] = ec;
			// }

			if (!vertices[v2]) {
				vertices[v2] = {
					leader: v2
				};
				leaders[v2] = {};
				leaders[v2][v2]=  true;
			}

			// if (!vertices[v2][v1] || vertices[v2][v1] > ec) {
			// 	vertices[v2][v1] = ec;
			// }

			edges.push({
				cost: ec,
				v1: v1,
				v2: v2
			});
		}
		cb();
	});
};

var sortEdges = function () {
	return edges.sort(function (a, b) {
		if (a.cost < b.cost) {
			return -1;
		} else if (a.cost > b.cost) {
			return 1;
		} else {
			return 0;
		}
	});
};

var space = function (num) {
	var i = 0;
	var v1, v2, ec, newLeader, oldLeader;

	while (Object.keys(leaders).length > num) {
		v1 = edges[i].v1;
		ec = edges[i].cost;
		v2 = edges[i].v2;

		if (vertices[v1].leader !== vertices[v2].leader) {
			if ( Object.keys(leaders[vertices[v1].leader]).length > Object.keys(leaders[vertices[v2].leader]).length) {
				newLeader = vertices[v1].leader;
				oldLeader = vertices[v2].leader;
			} else {
				newLeader = vertices[v2].leader;
				oldLeader = vertices[v1].leader;
			}

			console.log('Merging... ');
			console.log(leaders[oldLeader]);
			console.log(' into...');
			console.log(leaders[newLeader]);

			for (var v in leaders[oldLeader]) {
				vertices[v].leader = newLeader;
				leaders[newLeader][v] = true;
			}

			delete leaders[oldLeader];
		}
		console.log(leaders);
		console.log();
		i++;
	}
	while (vertices[edges[i].v1].leader === vertices[edges[i].v2].leader) {
		i++;
	}
	console.log();
	console.log(i);
	console.log(edges[i]);
	//console.log(leaders);
};

var start = function () {
	process.stdout.write('Filename: ');
	process.stdin.on('data', function (filename) {
		process.stdin.removeAllListeners('data');
		process.stdout.write('How many clusters? ');
		process.stdin.on('data', function (num) {
			process.stdin.removeAllListeners('data');
			read_file(filename.toString().split('\n')[0], function (err) {
				edges = sortEdges();
				console.log(edges);
				space(parseInt(num.toString().split('\n')[0]));
				process.stdin.on('data', start);
			});
		});
	});
};

start();