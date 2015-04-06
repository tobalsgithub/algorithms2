var fs = require('fs');

var read_file = function (filepath, method, cb) {
	var array = [];

	fs.readFile(filepath, function (err, data) {
		var dataArray = data.toString().split('\n');

		for (var i = 1; i < dataArray.length; i++) {
			array[i-1] = {
				weight: parseInt(dataArray[i].split(' ')[0]),
				length: parseInt(dataArray[i].split(' ')[1]),
			};

			if (method === 'sub') {
				array[i-1].compare = array[i-1].weight - array[i-1].length;
			} else {
				array[i-1].compare = array[i-1].weight / array[i-1].length;
			}
		}


		cb(null, array);
	});
};

var sort = function (array) {
	return array.sort(function (a, b) {
		if (a.compare === b.compare) {
			return b.weight - a.weight;
		} else {
			return b.compare - a.compare;
		}
	});
};

var run = function (array) {
	var total = 0, time = 0, job;

	for (var i = 0; i < array.length; i++) {
		job = array[i];
		time += job.length;
		console.log(job);
		console.log(job.weight);
		console.log(time);
		total = total + (time * job.weight);
		console.log(total);
	} 

	return total;
};

var start = function () {
	process.stdout.write('Filename: ');
	process.stdin.on('data', function (filename) {
		process.stdin.removeAllListeners('data');
		process.stdout.write('Method: ');
		process.stdin.on('data', function (method) {
			process.stdin.removeAllListeners('data');
			read_file(filename.toString().split('\n')[0], method.toString().split('\n')[0], function (err, array) {
				array = sort(array);
				console.log(run(array));
				process.stdin.on('data', start);
			});
		});
	});
};

start();

