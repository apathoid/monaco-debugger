import { FILE_PATH, LANG } from './constants';
import { Editor } from './Editor/Editor';


function App() {
    return (
        <div style={{ height: '350px', width: '100%', padding: '20px', boxSizing: 'border-box' }}>
            <button
                type="button"
                style={{
                    marginBottom: '20px'
                }}
                onClick={() => {
                    (window as any).debugApi.debug.startDebugging(undefined, {
                        name: 'deb',
                        type: LANG,
                        request: 'launch'
                    });
                }
            }>
                start debugging
            </button>

            <Editor
                id="some-unique-id"
                language={LANG}
                filePath={FILE_PATH}
                code={`function fn() {\n\treturn 1;\n}\n\nfn();\n`}
            />
        </div>
    );
}

export default App;
