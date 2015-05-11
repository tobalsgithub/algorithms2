var fs = require('fs');
var V = [0];
var A = [];
var INDEX = [];
var reduceAgain;
var toDelete = {};
var toDeleteCount = 0;

var read_file = function (filepath, cb) {
	fs.readFile(filepath, function (err, data) {
		var dataArray = data.toString().split('\n');

		NUMCITIES = parseInt(dataArray[0]);
		var x, y;
		for (var i = 1; i < dataArray.length; i++) {
			x = parseFloat(dataArray[i].split(' ')[0]);
			y = parseFloat(dataArray[i].split(' ')[1]);
			A.push({x: x, y:y});
			x = Math.abs(x);
			y = Math.abs(y);
			if (INDEX[x] === undefined) {
				INDEX[x] = [];
			}
			if (INDEX[y] === undefined) {
				INDEX[y] = [];
			}
			INDEX[x].push(A.length - 1);
			INDEX[y].push(A.length - 1);
		}
		cb();
	});
};

var reduce = function () {
	var clause, x, y, pos, neg;
	for (var idx = 1; idx <= INDEX.length; idx++) {
		if (INDEX[idx] === undefined) continue;
		pos = neg = false;
		for (var i = INDEX[idx].length - 1; i >= 0; i--) {
			clause = A[INDEX[idx][i]];
			x = Math.abs(clause.x);
			y = Math.abs(clause.y);

			if (INDEX[x] === undefined || INDEX[y] === undefined) {
				INDEX[idx].splice(i, 1);
				if (INDEX[idx].length === 0) {
					INDEX[idx] = undefined;
				}
				continue;
			}

			if (x == idx) {
				if (clause.x > 0) {
					pos = true;
				} else {
					neg = true;
				}
			} else {
				if (clause.y > 0) {
					pos = true;
				} else {
					neg = true;
				}
			}

			if (pos && neg) break;
		}

		if ((pos || neg) && !(pos && neg)) {
			for (var j = 0; j < INDEX[idx].length; j++) {
				if (!toDelete[INDEX[idx][j]]) {
					toDeleteCount++;
					// if (toDeleteCount % 100 === 0) {
					// 	console.log('toDelete length: ' + toDeleteCount);
					// }
					toDelete[INDEX[idx][j]] = true;
				}
			}
			INDEX[idx] = undefined;
			reduceAgain = true;
		}
	}
};

var reduceA = function () {
	for (var i = A.length - 1; i >= 0; i--) {
		if (toDelete[i]) {
			A.splice(i, 1);
		}
	}
};

var doit = function () {
	var outter = 0, outterTotal, inner, innerTotal, clause, x, y, rand;
	var failed, success = false;
	outterTotal = Math.log(A.length) / Math.LN2;
	innerTotal = 2 * (A.length * A.length);
	console.log('outter total is ' + outterTotal);
	console.log('inner total is ' + innerTotal);
	while(outter < outterTotal) {
		outter++;

		for (var i = 0; i < A.length; i++) {
			if (V[Math.abs(A[i].x)] === undefined) {
				V[Math.abs(A[i].x)] = (Math.random() > 0.5) ? true : false;
			}
			if (V[Math.abs(A[i].y)] === undefined) {
				V[Math.abs(A[i].y)] = (Math.random() > 0.5) ? true : false;
			}
		}

		inner = 0;
		while (inner < innerTotal) {
			inner++;
			failed = [];

			for (j = 0; j < A.length; j++) {
				clause = A[j];
				x = Math.abs(clause.x);
				y = Math.abs(clause.y);

				if ((V[x] && clause.x < 0) && (V[y] && clause.y < 0)) {
					failed.push(j);
				} else if ((!V[x] && clause.x > 0) && (!V[y] && clause.y > 0)) {
					failed.push(j);
				} else if ((V[x] && clause.x < 0) && (!V[y] && clause.y > 0)) {
					failed.push(j);
				} else if ((!V[x] && clause.x > 0) && (V[y] && clause.y < 0)) {
					failed.push(j);
				}
			}

			if (failed.length) {
				rand = Math.floor(Math.random() * failed.length);
				clause = A[failed[rand]];
				if (Math.random() > 0.5) {
					x = Math.abs(clause.x);
					V[x] = !V[x];
				} else {
					y = Math.abs(clause.y);
					V[y] = !V[y];
				}
			} else {
				success = true;
				break;
			}
		}

		if (success) {
			return true;
		}
	}
	return false;
};

var start = function () {
	process.stdout.write('Filename: ');
	process.stdin.on('data', function (filename) {
		process.stdin.removeAllListeners('data');
		read_file(filename.toString().split('\n')[0], function (err) {
			console.log('Initial A length: ' + A.length);
			reduceAgain = true;
			while (reduceAgain) {
				reduceAgain = false;
				reduce();
			}
			reduceA();
			console.log('Post reduce A length: ' + A.length);
			if (A.length) {
				console.log(doit());
			} else {
				console.log(true);
			}
			A = [];
			V = [0];
			toDelete = {};
			toDeleteCount = 0;
			INDEX = [];
			process.stdin.on('data', start);
		});
	});
};

start();