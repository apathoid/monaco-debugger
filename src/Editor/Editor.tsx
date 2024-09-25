import { EditorAppExtended } from 'monaco-editor-wrapper';
import React, { useEffect, useRef, useState } from 'react';
import { run } from '../utils';
import { MonacoEditorApp } from './types';
import { getUserConfig } from './user-config';

import { destroyMonacoHelper, restartMonacoHelper } from './helpers';
import { initVScodeServices } from './vscode';

import '@codingame/monaco-vscode-javascript-default-extension';
import '@codingame/monaco-vscode-julia-default-extension';

import './debugger';


export const Editor = React.memo(({
    id,
    code,
    filePath,
    language
}: {
    id: string;
    code: string;
    filePath: string;
    language: string;
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [editorApp, setEditorApp] = useState<MonacoEditorApp | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const editorAppRef = useRef(editorApp);
    editorAppRef.current = editorApp;

    const userConfig = getUserConfig({ id, code, filePath, language });

    useEffect(() => {
        setEditorApp(new EditorAppExtended(userConfig.id, userConfig));

        return () => {
            run(async () => {
                if (!editorAppRef.current) {
                    return;
                }

                await destroyMonacoHelper({ editorApp: editorAppRef.current });

                setIsMounted(false);
            });
        };
    }, []);

    useEffect(() => {
        run(async () => {
            if (isMounted || !editorApp) {
                return;
            }

            // Инициализируем сервисы vscode и подключаем подсветку синтаксиса
            await initVScodeServices({ editorApp, userConfig });

            if (!containerRef.current) {
                return;
            }

            // Добавляем редактор на страницу
            await restartMonacoHelper({ editorApp, htmlElement: containerRef.current });

            setIsMounted(true);
        });
    }, [isMounted, editorApp]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                border: '1px dashed lightgray'
            }}
        />
    );
});
