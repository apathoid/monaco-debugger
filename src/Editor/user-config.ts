import * as monaco from 'monaco-editor';

import getConfigurationServiceOverride from '@codingame/monaco-vscode-configuration-service-override';
import getFilesServiceOverride from '@codingame/monaco-vscode-files-service-override';
import getDebugServiceOverride from '@codingame/monaco-vscode-debug-service-override';
import getOutputServiceOverride from '@codingame/monaco-vscode-output-service-override';
import getViewsServiceOverride from '@codingame/monaco-vscode-views-service-override';
import getStorageServiceOverride from '@codingame/monaco-vscode-storage-service-override';
import { MonacoEditorUserConfig } from './types';


export const getUserConfig = ({
    id,
    code,
    filePath,
    language
}: {
    id: string;
    code: string;
    filePath: string;
    language: string;
}): MonacoEditorUserConfig => {
    return {
        id,
        wrapperConfig: {
            serviceConfig: {
                workspaceConfig: {
                    workspaceProvider: {
                        open: async () => true,
                        trusted: true,
                        workspace: {
                            workspaceUri: monaco.Uri.file('/workspace')
                        }
                    },
                },
                userServices: {
                    ...getConfigurationServiceOverride(),

                    ...getFilesServiceOverride(),

                    ...getDebugServiceOverride(),
                    ...getOutputServiceOverride(),
                    ...getViewsServiceOverride(),
                    ...getStorageServiceOverride({
                        fallbackOverride: {
                            'workbench.activity.showAccounts': false
                        }
                    }),
                }
            },
            editorAppConfig: {
                useDiffEditor: false,
                $type: 'extended',
                languageId: language,
                code,
                codeUri: filePath,
                editorOptions: {
                    glyphMargin: true
                }
            }
        }
    };
};
