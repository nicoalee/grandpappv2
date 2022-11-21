const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')

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

let mainClient;

app.get('/listen', (req, res) => {
    console.log(`received request: ${JSON.stringify(req.body)}`)
    if (mainClient === undefined) {
        console.log('main client connected')
        res.writeHead(200, headers)
        mainClient = res;
        
        req.on('close', () => {
            console.log('main client disconnected')
            mainClient = undefined;
            res.end();
        });
    } else {
        res.writeHead(401)
    }
});

app.get('/test', (req, res) => {
    res.send({ status: 418 })
})

app.post('/listen', (req, res) => {
    const body = req.body;
    console.log(`sending to main client: ${mainClient !== undefined}`)
    if (mainClient) {
        console.log(body)
        mainClient.write(`data: ${JSON.stringify(body)}\n\n`);
    }
    res.send({ status: 200 })
});

app.listen(3001, () => {
    console.log('app is listening on 3001');
});