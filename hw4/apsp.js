var fs = require('fs');
var A = {};
var V = [];
var NumV, NumE;
V[0] = null;

var read_file = function (filepath, cb) {
	fs.readFile(filepath, function (err, data) {
		var dataArray = data.toString().split('\n');

		NumV = parseInt(dataArray[0].split(' ')[0]);
		NumE = parseInt(dataArray[0].split(' ')[1]);
		var v1, v2, e;
		for (var i = 1; i < dataArray.length; i++) {
			v1 = parseInt(dataArray[i].split(' ')[0]);
			v2 = parseInt(dataArray[i].split(' ')[1]);
			e =  parseInt(dataArray[i].split(' ')[2]);
			if (V[v1] === undefined) {
				V[v1] = {};
			}

			if (V[v1][v2] !== undefined && V[v1][v2] < e) continue;

			V[v1][v2] = e;
		}
		for (var j = 1; j <= NumV; j++) {
			if (V[j] === undefined) {
				V[j] = {};
			}
		}
		cb();
	});
};

var baseCases = function () {
	for (var i = 1; i <= NumV; i++) {
		for (var j = 1; j <= NumV; j++) {
			if (A[i] === undefined) {
				A[i] = {};
			}

			if (A[i][j] === undefined) {
				A[i][j] = {};
			}

			if (i === j) {
				A[i][j][0] = 0;
			} else if (V[i][j] !== undefined) {
				A[i][j][0] = V[i][j];
			} else {
				A[i][j][0] = 9999999999999999999999999999999;
			}
		}
	}
};

var floyd = function () {
	for (var k = 1; k <= NumV; k++) {
		process.stdout.write(k.toString());
		for (var i = 1; i <= NumV; i++) {
			if (i % 10 === 0) process.stdout.write('.');
			for (var j = 1; j <= NumV; j++) {
				if (k > 1) {
					delete A[i][j][(k-2)];
				}
				if (A[i][j][(k-1)] < A[i][k][(k-1)] + A[k][j][(k-1)]) {
					A[i][j][k] = A[i][j][(k-1)];
				} else {
					A[i][j][k] = A[i][k][(k-1)] + A[k][j][(k-1)];
				}
			}
		}
		console.log();
	}
};

var hasNegativeCycle = function () {
	for (var i = 1; i <= NumV; i++) {
		if (A[i][i][NumV] < 0) {
			return true;
		}
	}
	return false;
};

var findMinimum = function () {
	var min = 999999999999999999999999;
	for (var i = 1; i <= NumV; i++) {
		for (var j = 1; j <= NumV; j++) {
			if (A[i][j][NumV] < min) {
				min = A[i][j][NumV];
			}
		}
	}
	return min;
};

var start = function () {
	process.stdout.write('Filename: ');
	process.stdin.on('data', function (filename) {
		process.stdin.removeAllListeners('data');
		read_file(filename.toString().split('\n')[0], function (err) {
			baseCases();
			floyd();
			if (hasNegativeCycle()) {
				console.log('Has negative cycle');
			} else {
				console.log('Minimum is :' + findMinimum());
			}
			A = {};
			V = [];
			V[0] = null;
			process.stdin.on('data', start);
		});
	});
};

start();