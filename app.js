var http = require('http');
var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:3000/mon');
var counter = 0;
var measurementStarted;
var samplingPeriod = 3000; //divide time into 3s slots and calculate average only for one period

ws.on('open', function() {
	measurementStarted = (new Date()).getTime();
	var subscriptionRequest = {
		type: 'subscription',
		value: [ "*"
			// {
			// 	name: 'cpu.idle_perc',
			// 	dimensions: {
			// 		hostname: 'tinypony-VirtualBox'
			// 	}
			// }, {
			// 	name: 'mem.usable_perc',
			// 	dimensions: {
			// 		hostname: 'tinypony-VirtualBox',
			// 	}
			// },	{
			// 	name: 'mem.usable_perc',
			// 	dimensions: {
			// 		hostname: 'tinypony-ThinkPad-T410',
			// 	}
			// },	{
			// 	name: 'cpu.idle_perc',
			// 	dimensions: {
			// 		hostname: 'tinypony-ThinkPad-T410'
			// 	}
			// }, {
			// 	name: 'net.in_bytes_sec',
			// 	dimensions: {
			// 		hostname: 'tinypony-VirtualBox',
			// 		device: 'enp0s3'
			// 	}
			// },	{
			// 	name: 'net.in_bytes_sec',
			// 	dimensions: {
			// 		hostname: 'tinypony-VirtualBox',
			// 		device: 'enp0s8'
			// 	}
			// }, 	{
			// 	name: 'net.out_bytes_sec',
			// 	dimensions: {
			// 		hostname: 'tinypony-VirtualBox',
			// 		device: 'enp0s3'
			// 	}
			// },	{
			// 	name: 'net.out_bytes_sec',
			// 	dimensions: {
			// 		hostname: 'tinypony-VirtualBox',
			// 		device: 'enp0s8'
			// 	}
			// }, 	{
			// 	name: 'net.in_bytes_sec',
			// 	dimensions: {
			// 		hostname: 'tinypony-ThinkPad-T410',
			// 		device: 'eth0'
			// 	}
			// },	{
			// 	name: 'net.out_bytes_sec',
			// 	dimensions: {
			// 		hostname: 'tinypony-ThinkPad-T410',
			// 		device: 'eth0'
			// 	}
			// },
		]
	};

	ws.send(JSON.stringify(subscriptionRequest));
});

ws.on('message', function(m) {
   counter++;
});

setInterval(function() {
	var now = (new Date).getTime();
	var period = now - measurementStarted;
   	var throughput = counter / (period/ 1000);

   	console.log('throughput: ' + throughput + ' metrics/s');

   	if(period > samplingPeriod) {
   		measurementStarted = now;
   		counter = 0;
   	}
}, 1000);

//Lets define a port we want to listen to
const PORT = 3001; 

//We need a function which handles requests and send response
function handleRequest(request, response) {}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){ });

module.exports = ws;