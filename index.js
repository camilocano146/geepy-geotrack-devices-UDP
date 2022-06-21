'use strict';

const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const http = require('http');
// Importing dgram module
var dgram = require('dgram');
var port = process.env.PORT || 3001;

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: false
}));

app.use(bodyParser.json({ limit: "50mb" }));

//Rutas
var routes = require('./routes/routes');
app.use('/', routes);

app.use(express.static('public'));

// server http
const server = http.createServer(app);

// servers UDP
var server50000 = dgram.createSocket("udp4", () => {
	console.log("server in port 50000 is created");
});
var server4100 = dgram.createSocket("udp4", () => {
	console.log("server in port 50000 is created");
});

// Catching the message event
server50000.on("message", function (msg) {

	// Displaying the client message
	process.stdout.write("UDP String in 50000 port: " + msg + "\n");

	// Exiting process
	process.exit();

});

// Catching the message event
server4100.on("message", function (msg) {

	// Displaying the client message
	process.stdout.write("UDP String in 4100 port: " + msg + "\n");

	// Exiting process
	process.exit();

});

// Catching the listening event
server50000.on('listening', () => {

	// Getting address information
	// for the server
	const address = server50000.address();

	// Display the result
	console.log(`server listening ${address.address}:${address.port}`);

});

// Catching the listening event
server4100.on('listening', () => {

	// Getting address information
	// for the server
	const address = server4100.address();

	// Display the result
	console.log(`server listening ${address.address}:${address.port}`);

});

// Binding server with port address
// by using bind() method
server50000.bind(50000, () => {

	// Setting the Send buffer size
	// by using setSendBufferSize() method
	server50000.setSendBufferSize(2000);

	// Getting the Send buffer size
	// by using getSendBufferSize() method
	const size = server50000.getSendBufferSize();

	// Display the result
	console.log(size);
});
// Binding server with port address
// by using bind() method
server4100.bind(4100, () => {

	// Setting the Send buffer size
	// by using setSendBufferSize() method
	server4100.setSendBufferSize(2000);

	// Getting the Send buffer size
	// by using getSendBufferSize() method
	const size = server4100.getSendBufferSize();

	// Display the result
	console.log(size);
});



server.listen(port, function() {
    console.log('Servidor API HTTP en: ' + port);
});

