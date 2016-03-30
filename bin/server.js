#!/usr/bin/env node

/**
 * This file is simply used as a websocket proxy so the TV doesn't
 * get an origin header which it considers invalid
 */

// Simple static server
var connect = require('connect')
var serveStatic = require('serve-static');
var http = require('http');
var finalhandler = require('finalhandler');
var WebSocket = require('websocket');
var WebSocketServer = WebSocket.server;
var WebSocketClient = WebSocket.client;

if (!process.env.TV_IP) {
  throw new Error('TV IP needs to be specified.');
}

var tvAddress = 'ws://' + process.env.TV_IP + ':3000';
var port = process.env.port || 3000;

var app = connect();
var server = http.createServer(app);
app.use(serveStatic('public', {
  index: ['index.html']
}));

// Creates a simple socket server instance
var wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

// Handles incoming socket server requests
wsServer.on('request', function(request) {
  var socketClient = new WebSocketClient();
  var clientConnection;
  var tvConnection;
  
  socketClient.on('connect', function(conn) {
    clientConnection = request.accept();
    tvConnection = conn;
    
    clientConnection.on('message', function(msg) {
      tvConnection.sendUTF(msg.utf8Data);
    });
    
    clientConnection.on('close', function() {
      tvConnection.close();
      tvConnection = null;
      clientConnection = null;
    });
    
    tvConnection.on('message', function(msg) {
      clientConnection.send(msg.utf8Data);
    });
  });
  
  socketClient.connect(tvAddress);
});

//create node.js http server and listen on port 
server.listen(port, function() {
  console.log('There you go, Remote listening on 127.0.0.1:'+port);
});
