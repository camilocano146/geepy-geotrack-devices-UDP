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

// Catching the message event
server.on("message", (msg, rinfo) => {

	console.log("-----------start server.message-----------");

	// Displaying the client message
	console.log("Message in 50000 port: ");
	console.log(msg);

	// Displaying the client address
	console.log("IP: " + rinfo.address + "\n");

	// Exiting process
	process.exit();

	console.log("-----------end server.message-----------");

});

// Catching the listening event
server.on('listening', () => {
	console.log("-----------start server.listening-----------");

	// Getting address information
	// for the server
	const address = server.address();

	// Display the result
	console.log(`Server UDP listening in: ${address.port}`);
	console.log("-----------ends server.listening-----------");


});

// Binding server with port address
// by using bind() method
server.bind(50000, () => {

	// Setting the Send buffer size
	// by using setSendBufferSize() method
	server.setSendBufferSize(2000);

	// Getting the Send buffer size
	// by using getSendBufferSize() method
	const size = server.getSendBufferSize();

	// Display the result
	console.log(size);
});

server.listen(port, function() {
    console.log('Server API HTTP listening in: ' + port);
});

