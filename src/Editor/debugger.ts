import * as vscode from 'vscode';
import { registerExtension } from 'vscode/extensions';
import { FILE_PATH, LANG, SEND_DEBUG_FILES, TCP_URI, USE_WS, WS_URI } from '../constants';
import { TCPDebugAdapter } from './adapters/TCPDebugAdapter';
import { WebSocketDebugAdapter } from './adapters/WebSocketDebugAdapter';


const { getApi, registerFileUrl } = registerExtension(
    {
        name: 'debug.jl',
        publisher: 'engee',
        version: '1.0.0',
        engines: {
            vscode: '*',
        },
        browser: 'extension.js',
        contributes: {
            debuggers: [
                {
                    type: LANG,
                    label: `${LANG} debugger`,
                    languages: [LANG],
                },
            ],
            breakpoints: [
                {
                    language: LANG,
                },
            ],
        },
    },
    1,
);

registerFileUrl('./extension.js', 'data:text/javascript;base64,' + window.btoa('// nothing'));

getApi().then((debugApi) => {
    (window as any).debugApi = debugApi;

    debugApi.debug.registerDebugAdapterDescriptorFactory(LANG, {
        async createDebugAdapterDescriptor() {
            const files: Record<string, string> = {
                [FILE_PATH]: new TextDecoder().decode(await debugApi.workspace.fs.readFile(debugApi.Uri.file(FILE_PATH)))
            };

            let adapter: WebSocketDebugAdapter | TCPDebugAdapter | null = null;

            if (USE_WS) {
                const websocket = new WebSocket(WS_URI);

                await new Promise((resolve, reject) => {
                    websocket.onopen = resolve;
                    websocket.onerror = () => reject(new Error('Unable to connect to debugger server'));
                });

                if (SEND_DEBUG_FILES) {
                    websocket.send(JSON.stringify({ main: FILE_PATH, files }));
                }

                adapter = new WebSocketDebugAdapter(debugApi, websocket);
            } else {
                adapter = new TCPDebugAdapter(debugApi);

                if (SEND_DEBUG_FILES) {
                    fetch(TCP_URI, {
                        method: 'POST',
                        body: JSON.stringify({ main: FILE_PATH, files }),
                    });
                }
            }

            adapter.onDidSendMessage((message: any) => {
                if (message.type === 'event' && message.event === 'output') {
                    console.log('OUTPUT', message.body.output);
                }
            });

            return new debugApi.DebugAdapterInlineImplementation(adapter);
        },
    });

    // debugApi.debug.onDidStartDebugSession((e) => {
    //     console.log('session started: ', e);
    // });
    // debugApi.debug.onDidChangeBreakpoints((e) => {
    //     console.log('breaks changed: ', debugApi.window.activeTextEditor?.document.uri, e);
    // });
});
