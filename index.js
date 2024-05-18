const ws = require("ws");
const fs = require("fs");
const http = require("http");
var os = require('os');
var axios = require("axios");
var ip = os.networkInterfaces()['Беспроводная сеть'][1]['address']
const HOST = ip;
const PORT = 8004;


function broadcastMessage(message) {
    wss.clients.forEach((client) => {
            client.send(message, { binary: false });
    })};


const server = http.createServer((req, res) => {
    let body = '';
    if( req.method === 'POST' && req.url === '/receive') {
        req.on('data', (chunk) => {
            body += chunk;
          });
        req.on('end', () => {
        // Весь запрос получен, можно обработать тело запроса
        console.log('Тело запроса:', JSON.parse(body));
    
        broadcastMessage(body)
    
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end();
        });}
    else{
        res.writeHead(200);
        res.end(index);
    }
    
});

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
});

const wss = new ws.WebSocketServer({ server });

const users = [];

wss.on("connection", (websocketConnection, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`[open] Connected ${ip}`);


    websocketConnection.on("message", (message) => {
        console.log("[message] Received: " + message);

		users.push(message);
        axios.post('http://192.168.31.235:8001/send',JSON.parse(message))
    });

    websocketConnection.on("close", () => {
        console.log(`[close] Disconnected ${ip}`);
    });
});