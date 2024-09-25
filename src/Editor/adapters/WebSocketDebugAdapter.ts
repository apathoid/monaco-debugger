import * as vscode from 'vscode';


export class WebSocketDebugAdapter implements vscode.DebugAdapter {
    constructor (private api: typeof vscode, private websocket: WebSocket) {
        websocket.onmessage = (message) => {
            this._onDidSendMessage.fire(JSON.parse(message.data));
        };
    }

    _onDidSendMessage = new this.api.EventEmitter<vscode.DebugProtocolMessage>();
    onDidSendMessage = this._onDidSendMessage.event;

    handleMessage (message: vscode.DebugProtocolMessage): void {
        this.websocket.send(JSON.stringify(message));
    }

    dispose () {
        this.websocket.close();
    }
}
