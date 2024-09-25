import { EditorAppClassic, EditorAppExtended, UserConfig } from 'monaco-editor-wrapper';


export type MonacoEditorAppClassic = EditorAppClassic;
export type MonacoEditorAppExtended = EditorAppExtended;
export type MonacoEditorApp = MonacoEditorAppClassic | MonacoEditorAppExtended;

export type MonacoEditorUserConfig = Omit<UserConfig, 'id' | 'languageClientConfig' | 'loggerConfig'> & {
    id: string;
};
