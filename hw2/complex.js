var fs = require('fs');
var ones = [];
var twos = [];
var xors = [];
var vertices = {};
var leaders = {};

var getOnes = function (numBits) {
	for (var i = 0; i < numBits; i++) {
		ones[i] = Math.pow(2, i);
	}
};

var getTwos = function (numBits) {
	for (var i = 0; i < ones.length; i++) {
		for (var  j = i; j < ones.length; j++) {
			if (ones[i] !== ones[j]) {
				a = ones[i] + ones[j];
				twos.push(a);
			}
		}
	}
};

var read_file = function (filepath, cb) {
	fs.readFile(filepath, function (err, data) {
		var dataArray = data.toString().split('\n');
		for (var i = 1; i < dataArray.length; i++) {
			dataArray[i] = dataArray[i].split(' ').join('');
			if (!vertices[dataArray[i]]) {
				vertices[dataArray[i]] = {};
			}

			vertices[dataArray[i]] = {
				leader: dataArray[i]
			};
			leaders[dataArray[i]] = {};
			leaders[dataArray[i]][dataArray[i]] = true;
		}
		cb();
	});
};

var doit = function () {
	var intv, v2, newLeader, oldLeader, v1, i, v, counter = 0, mergeCount;
	console.log('xors length is ' + xors.length);

	for (i = 0; i < xors.length; i++ ) {
		mergeCount = 0;

		process.stdout.write('xors ' + i  + ' ');
		for (v1 in vertices) {
			counter++;
			if (counter % 1000 === 0) process.stdout.write('.');
			intv = parseInt(v1, 2);
			v2 = (xors[i] ^ intv).toString(2);
			
			while (v2.length < 24) {
				v2 = '0' + v2;
			}

			if (!vertices[v2]) continue;

			if (vertices[v1].leader !== vertices[v2].leader) {
				mergeCount++;
				// Do the merge
				if ( Object.keys(leaders[vertices[v1].leader]).length > Object.keys(leaders[vertices[v2].leader]).length) {
					newLeader = vertices[v1].leader;
					oldLeader = vertices[v2].leader;
				} else {
					newLeader = vertices[v2].leader;
					oldLeader = vertices[v1].leader;
				}

				for (v in leaders[oldLeader]) {
					vertices[v].leader = newLeader;
					leaders[newLeader][v] = true;
				}

				delete leaders[oldLeader];
			}
		}
		process.stdout.write('\n');
		console.log('merge count ' + mergeCount);
	}
	console.log(Object.keys(leaders).length);
};

var start = function () {
	process.stdout.write('Filename: ');
	process.stdin.on('data', function (filename) {
		process.stdin.removeAllListeners('data');	
		getOnes(24);
		getTwos(24);
		xors = ones.concat(twos);
		xors = xors.reverse();
		read_file(filename.toString().split('\n')[0], function (err) {
			doit();
			process.stdin.on('data', start);
	 	});
	});
};

start();