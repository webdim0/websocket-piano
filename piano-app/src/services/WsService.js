class WsService {
    
    static clientId = null;

    static _toClientId = null;

    static get toClientId() {
        return this._toClientId;
    };
    
    static set toClientId(id) {
        this._toClientId = id;
        if (this.onToClientId) {
            this.onToClientId(id);
        }
    };

    static webSocket = null;

    static onMessagePiano = null;

    static onMessageChat = null;

    static onToClientId = null;

    static async connect() {
        return new Promise((resolve, reject) => {
            if (this.clientId === null) {            
                this.webSocket = new WebSocket("ws://127.0.0.1:8000");
                //console.log(this.webSocket);
                this.webSocket.onmessage = message => {                    
                    const msg = JSON.parse(message.data);
                    //console.log(msg)
                    if (msg.port === 'system') {
                        const {command, clientId} = msg.body;
                        if (command === 'client-id') {
                            this.clientId = clientId;
                        }
                    } else if (msg.port === 'piano') {
                        if (this.onMessagePiano) {
                            this.onMessagePiano(msg);
                        }
                    } else if (msg.port === 'chat') {
                        if (this.onMessageChat) {
                            this.onMessageChat(msg);
                        }
                    }
                }
                this.webSocket.onerror = error => {
                    //console.log('WebSocket error!');
                    reject(false);
                }
                this.webSocket.onopen = event => {
                    //console.log('WebSocket opened!');
                    resolve(true);
                }
            }
        });        
    }

    static setListenerPiano(func) {        
        this.onMessagePiano = func;        
    }

    static setListenerChat(func) {        
        this.onMessageChat = func;        
    }

    static setListenerToClientId(func) {        
        this.onToClientId = func;        
    }

    static send({port, body, addressTo, addressFrom}) {
        //console.log(data + ' '+ this.clientId);
        const msg = {
            port: port,
            body: body,
            addressFrom: addressFrom,
            addressTo: addressTo,
        };
        this.webSocket.send(JSON.stringify(msg));
    }
}

export { WsService };