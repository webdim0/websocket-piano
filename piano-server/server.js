import {WebSocketServer} from 'ws';
import {v4 as uuid} from 'uuid';

const clients = {};

const wss = new WebSocketServer({port: 8000});

console.log('Server started!');

wss.on('connection', (ws) => {
    const clientId = uuid();
    clients[clientId] = ws;

    console.log(`New client ${clientId}`);
    let message = {
        port: 'system',
        body: {command: 'client-id', clientId: clientId},
        addressFrom: clientId,
        addressTo: clientId,
    };
    ws.send(JSON.stringify(message));

    ws.on('message', (rawMessage) => {
        const message = JSON.parse(rawMessage);
        //console.log(message);
        const { addressTo } = message;
        
        if (clients[addressTo]) {
            clients[addressTo].send(JSON.stringify(message));            
        }        
    })

    ws.on('close', () => {
        delete clients[clientId];
        console.log(`Client is closed ${clientId}`)
    })
})

process.on('SIGINT', () => {
    wss.close();
    process.exit();
})