var fs = require('fs');
var A = {};
var CITIES = {};
var NUMCITIES;
var INFINITY = 9999999999999;
var DISTANCES = {};

var read_file = function (filepath, cb) {
	fs.readFile(filepath, function (err, data) {
		var dataArray = data.toString().split('\n');

		NUMCITIES = parseInt(dataArray[0]);
		var x, y;
		for (var i = 1; i < dataArray.length; i++) {
			x = parseFloat(dataArray[i].split(' ')[0]);
			y = parseFloat(dataArray[i].split(' ')[1]);
			CITIES[i] = {x: x, y: y};
		}
		cb();
	});
};

var bitSubsets = function (k, n) {
	var subsets = {};
	var bits = '';

	for (var i = 0; i < k; i++) {
		bits += '1';
	}
	for (var j = k; j<n; j++) {
		bits = '0'.concat(bits);
	}

	x = parseInt(bits, 2);

	var u, v;
	while (x < Math.pow(2, n)) {
		subsets[x.toString(2)] = x;
		u = x & (-x);
		v = x + u;
		x = v + (((v ^ x) / u) >> 2);
	}
	return subsets;
};

var baseCases = function () {
	A[0] = {
		1: 0
	};
};

var tsp = function () {
	var currentSets, prevSets, s, count;
	var sMinusJ, min, cost, cityJ, cityK, minKCity;
	for (var m = 1; m < NUMCITIES; m++) {
		
		console.log('m is ' + m);
		
		prevSets = currentSets;
		if (!prevSets) {
			prevSets = {
				0: 0
			};
		}
		currentSets = bitSubsets(m, NUMCITIES - 1);
		console.log('Subsets length is ' + Object.keys(currentSets).length);
		count = 0;
		for (var set in currentSets) {
			count++;
			if (count % 1000 === 0) {
				console.log('Processed ' + count + ' subsets');
			}
			s = set;

			while (s.length < NUMCITIES - 1) {
				s = '0'.concat(s);
			}

			for (var j = 0; j < s.length; j++) {
				if (s[j] != 1) continue; 

				sMinusJ = s.slice(0, j) + '0' + s.slice(j+1, s.length);
				while (sMinusJ[0] == '0') {
					sMinusJ = sMinusJ.slice(1, sMinusJ.length);
				}
				if (sMinusJ === '') {
					sMinusJ = '0';
				}

				min = INFINITY;
				cityJ = CITIES[j+2];

				for (var k = 0; k < s.length; k++ ) {
					if (s[k] != 1 || j == k) continue;
					
					if (!A[prevSets[sMinusJ]]) continue; // infitinty
					if (A[prevSets[sMinusJ]][k+2] >= INFINITY) continue;

					cityK = CITIES[k+2];

					if (DISTANCES[j+2] && DISTANCES[j+2][k+2]) {
						cost = DISTANCES[j+2][k+2];
					} else if (DISTANCES[k+2] && DISTANCES[k+2][j+2]) {
						cost = DISTANCES[k+2][j+2];
					} else {
						cost = Math.sqrt((cityJ.x - cityK.x)*(cityJ.x - cityK.x) + (cityJ.y - cityK.y)*(cityJ.y - cityK.y));
						if (!DISTANCES[j+2]) {
							DISTANCES[j+2] = {};
						}
						DISTANCES[j+2][k+2] = cost;
					}

					if ((A[prevSets[sMinusJ]][k+2] + cost) < min) {
						min = A[prevSets[sMinusJ]][k+2] + cost;
						minKCity = k+2;
					}
				}

				cityK = CITIES[1];
				if (DISTANCES[j+2] && DISTANCES[j+2][k+2]) {
					cost = DISTANCES[j+2][k+2];
				} else if (DISTANCES[k+2] && DISTANCES[k+2][j+2]) {
					cost = DISTANCES[k+2][j+2];
				} else {
					cost = Math.sqrt((cityJ.x - cityK.x)*(cityJ.x - cityK.x) + (cityJ.y - cityK.y)*(cityJ.y - cityK.y));
					if (!DISTANCES[j+2]) {
						DISTANCES[j+2] = {};
					}
					DISTANCES[j+2][k+2] = cost;
				}
				//cost = Math.sqrt(Math.pow((cityJ.x - cityK.x), 2) + Math.pow((cityJ.y - cityK.y), 2));

				if (A[prevSets[sMinusJ]] && (A[prevSets[sMinusJ]][1] + cost) < min) {
					min = A[prevSets[sMinusJ]][1] + cost;
					minKCity = 1;
				}

				if (!A[currentSets[set]]) {
					A[currentSets[set]] = {};
				}
				
				//console.log('Setting A[' + currentSets[set] + '][' + (j+2) + '] = ' + min);
				A[currentSets[set]][j+2] = min;
			}
		}

		for (var key in prevSets) {
			delete A[key];
		}
	}
};

var findMinimum = function () {
	var cityJ, min = 9999999999999, city1, cost;
	var bits = Math.pow(2, NUMCITIES - 1) - 1;

	city1 = CITIES[1];
	for (var j = 1; j < NUMCITIES; j++) {
		cityJ = CITIES[j + 1];

		cost = Math.sqrt(Math.pow((cityJ.x - city1.x), 2) + Math.pow((cityJ.y - city1.y), 2));

		if (A[bits][j+1] + cost < min) {
			min = A[bits][j+1] + cost;
		}
	}
	return min;
};

var start = function () {
	process.stdout.write('Filename: ');
	process.stdin.on('data', function (filename) {
		process.stdin.removeAllListeners('data');
		read_file(filename.toString().split('\n')[0], function (err) {
			console.log(CITIES);
			baseCases();
			tsp();
			console.log();
			//console.log(A);
			console.log(findMinimum());
			A = {};
			CITIES = [];
			process.stdin.on('data', start);
		});
	});
};

start();