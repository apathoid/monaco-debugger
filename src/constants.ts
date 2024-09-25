export const LANG: string = 'julia';

// Использовать websocket
export const USE_WS = LANG === 'javascript';
// Нужно ли передавать первым запросом файлы, участвующие в дебаггинге
export const SEND_DEBUG_FILES = LANG === 'javascript';

export const WS_URI = 'ws://localhost:5555';
export const TCP_URI = 'http://localhost:36780';

export const FILE_PATH = LANG === 'javascript' ? '/workspace/file.js' : '/workspace/file.jl';
