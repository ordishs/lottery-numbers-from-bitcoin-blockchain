var WebSocket = require('ws');
var ws = new WebSocket('wss://ws.blockchain.info/inv');

var numbers = {};
var iterations = 0;

ws.on('open', function open() {
	ws.send(JSON.stringify({
		"op": "unconfirmed_sub"
	}));
});

ws.on('message', function(data, flags) {
	processHash(JSON.parse(data).x.hash);
});

function processHash(hash) {
	console.log(hash);
	var b = new Buffer(hash, 'hex');

	for (var i = 0; i < b.length; i++) {
		var number = (b[i] % 36) + 1;
		numbers[number] = (numbers[number] || 0) + 1;
 	}

	iterations++;
	if (iterations === 10) {
		iterations = 0;
		printTop6();
	}
}

function printTop6() {
	var list = [];
	for (var key in numbers) {
		list.push([key, numbers[key]]);
	}

	list.sort(function(a, b) {
		return b[1] - a[1];
	});

	var winners = [];
	for (var i = 0; i < 6; i++) {
		winners.push(+list[i][0]);
	}

	console.log(winners.sort(function(a,b) {
		return a - b;
	}));

	numbers = {};
}
