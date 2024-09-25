import * as vscode from 'vscode';
import { TCP_URI } from '../../constants';
import { run } from '../../utils';


export class TCPDebugAdapter implements vscode.DebugAdapter {
    constructor (private api: typeof vscode) {
    }

    _onDidSendMessage = new this.api.EventEmitter<vscode.DebugProtocolMessage>();
    onDidSendMessage = this._onDidSendMessage.event;

    handleMessage (message: vscode.DebugProtocolMessage): void {
        run(async () => {
            let msg = message;

            // if ((message as any).command === 'initialize') {
            //     msg = {
            //         seq: 1,
            //         type: 'request',
            //         command: 'initialize',
            //         arguments: {
            //             adapterID: '1246',
            //             supportsProgressReporting: true,
            //         },
            //     };
            // }

            console.log('MESSAGE: ', msg);

            const response = await fetch(TCP_URI, {
                method: 'POST',
                body: JSON.stringify(msg)
            });

            const responseData = await response.json();

            console.log('RESPONSE: ', responseData);
            this._onDidSendMessage.fire(JSON.parse(responseData));
        });
    }

    dispose () {}
}
