import { IDisposable } from 'monaco-editor';
import { MonacoEditorApp } from './types';

/**
 * Инициализирует и добавляет редактор на страницу
 */
export const startMonacoHelper = async (args: {
    editorApp: MonacoEditorApp;
    htmlElement: HTMLElement;
}) => {
    const { editorApp, htmlElement } = args;

    await editorApp.init();
    await editorApp.createEditors(htmlElement);
};


/**
 * Уничтожает редактор и все его подписки
 */
export const destroyMonacoHelper = async (args: {
    editorApp: MonacoEditorApp;
}) => {
    const { editorApp } = args;

    // Явно уничтожаем модель, потому что монако иногда забывает делать это самостоятельно,
    // чем ломает существующий LSP-сервер
    editorApp.getModel()?.dispose();

    editorApp.disposeApp();
};

/**
 * Уничтожает, инцииализирует и добавляет монако на страницу
 */
export const restartMonacoHelper = async (args:
    & Parameters<typeof startMonacoHelper>[0]
    & Parameters<typeof destroyMonacoHelper>[0]
) => {
    const { editorApp, htmlElement } = args;

    await destroyMonacoHelper({ editorApp });
    await startMonacoHelper({ editorApp, htmlElement });
};
