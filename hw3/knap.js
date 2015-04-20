var fs = require('fs');
var N, Weight;
var A = {};
var W = [0];
var V = [0];

var read_file = function (filepath, cb) {
	fs.readFile(filepath, function (err, data) {
		var dataArray = data.toString().split('\n');
		var v1, v2, ec;

		Weight = parseInt(dataArray[0].split(' ')[0]);
		N = parseInt(dataArray[0].split(' ')[1]);

		for (var i = 1; i < dataArray.length; i++) {			
			V.push(parseInt(dataArray[i].split(' ')[0]));
			W.push(parseInt(dataArray[i].split(' ')[1]));
		}
		cb();
	});
};

knap = function (i, w) {
	var weightDiff, ret;

	if (i === 0) {
		return 0;
	}

	if (A[i-1] === undefined) {
		A[i-1] = {};
	}

	if (A[i-1][w] === undefined) {
		A[i-1][w] = knap(i-1, w);
	}

	weightDiff = w - W[i];

	if (weightDiff < 0) {
		return A[i-1][w];
	}

	if (A[i-1][weightDiff] === undefined) {
		A[i-1][weightDiff] = knap(i-1, weightDiff);
	}

	if (A[i-1][w] > (A[i-1][weightDiff] + V[i])) {
		ret = A[i-1][w];
	} else {
		ret = A[i-1][weightDiff] + V[i];
	}

	return ret;
};

var start = function () {
	process.stdout.write('Filename: ');
	process.stdin.on('data', function (filename) {
		process.stdin.removeAllListeners('data');
		read_file(filename.toString().split('\n')[0], function (err) {
			A[N] = {};
			A[N][Weight] = knap(N, Weight);
			console.log();
			console.log(A[N][Weight]);
			console.log('done');
			process.stdin.on('data', start);
		});
	});
};

start();