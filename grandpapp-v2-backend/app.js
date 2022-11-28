const process = require('node:process');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { response } = require('express');

process
    .on('uncaughtException', (code) => {
        console.log('Process uncaughtException event');
        console.log(code);
        process.exit(1);
    })
    .on('unhandledRejection', (code) => {
        console.log('Process exit event');
        console.log(code);
    })

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const headers = {
    "Content-Type": "text/event-stream",
    "Connection": "keep-alive",
    "Cache-Control": "no-cache",
};

// http://192.168.0.22:3001/listen
// http://Nicholass-MacBook-Pro.local:3000

const clients = [];

const updateAllClients = (update) => {
    clients.forEach((client) => {
        client.response.write(update)
    })
}

app.get('/listen', (req, res) => {
    console.log(`received request: ${JSON.stringify(req.headers)}\n`)
    
    const newClient = {
        id: Date.now(),
        response: res
    };
    console.log(`client added: ${newClient.id}`)
    clients.push(newClient);

    res.writeHead(200, headers)
    // send initial message to init connection
    res.write('update: connected\n\n')
    res.flushHeaders();

    req.on('close', () => {
        console.log(`disconnecting: ${newClient.id}`)
        const clientToCloseIndex = clients.findIndex(c => c.id === newClient.id);
        if (clientToCloseIndex >= 0) {
            const clientToClose = clients[clientToCloseIndex];
            clientToClose.response.end();
            clients.splice(clientToCloseIndex, 1);
        }
    });
});

app.get('/test', (req, res) => {
    res.send({ status: 418 })
})

app.post('/listen', (req, res) => {
    const body = req.body;
    console.log(`sending to clients: ${clients.length > 0}`)
    if (clients.length > 0) {
        console.log(body)
        updateAllClients(`data: ${JSON.stringify(body)}\n\n`)
    }
    res.send({ status: 200 })
});

// app.listen(3001, '0.0.0.0', () => {
app.listen(3001, '127.0.0.1', () => {
    console.log('app is listening on 3001');
});