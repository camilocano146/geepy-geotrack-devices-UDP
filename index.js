'use strict';

const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const http = require('http');
// Importing dgram module
var dgram = require('dgram');
var port = process.env.PORT || 3001;
var portUDP = 60000;

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
var serverUDP = dgram.createSocket({type: 'udp4', reuseAddr: true}, () => {
	console.log("server in port 50000 was create");
});

// Catching the message event
serverUDP.on("message", async (msg, rinfo) => {

	console.log("-----------start serverUDP.message-----------");
	let ProccessUDPMessage = require("./processors/udpProcessor");
	// Displaying the client address
	

	await ProccessUDPMessage.proccessUDPMessage(msg, rinfo);

	// Exiting process
	//process.exit();

	console.log("-----------end serverUDP.message----------- \n");

});

// Catching the listening event
serverUDP.on('listening', () => {

	console.log("-----------start serverUDP.listening-----------");

	// Getting address information
	// for the server
	const address = serverUDP.address();

	// Display the result
	console.log(`Server UDP listening in port: ${address.port}`);
	console.log("-----------end serverUDP.listening----------- \n");

});

// Binding server with port address
// by using bind() method
serverUDP.bind(portUDP, () => {

	console.log("-----------start serverUDP.bind-----------");
	// Setting the Send buffer size
	// by using setSendBufferSize() method
	serverUDP.setSendBufferSize(2000);

	// Getting the Send buffer size
	// by using getSendBufferSize() method
	const size = serverUDP.getSendBufferSize();

	// Display the result
	console.log("Buffer size: " + size);
	console.log("-----------end serverUDP.listening----------- \n");
});

server.listen(port, function() {
	console.log("-----------start server.listen-----------");
    console.log('Server API HTTP listening in: ' + port);
	console.log("-----------end server.listen-----------\n");
});

