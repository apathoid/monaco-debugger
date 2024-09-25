import * as monaco from 'monaco-editor';
import { mergeServices, initServices } from 'monaco-languageclient/vscode/services';
import { MonacoEditorApp, MonacoEditorUserConfig } from './types';
// import 'vscode/localExtensionHost';
// import './features/debugger';

export const checkServiceConsistency = (userServices?: monaco.editor.IEditorOverrideServices) => {
    const haveThemeService = Object.keys(userServices ?? {}).includes('themeService');
    const haveTextmateService = Object.keys(userServices ?? {}).includes('textMateTokenizationFeature');
    const haveMarkersService = Object.keys(userServices ?? {}).includes('markersService');
    const haveViewsService = Object.keys(userServices ?? {}).includes('viewsService');

    // theme requires textmate
    if (haveThemeService && !haveTextmateService) {
        throw new Error('"theme" service requires "textmate" service. Please add it to the "userServices".');
    }

    // markers service requires views service
    if (haveMarkersService && !haveViewsService) {
        throw new Error('"markers" service requires "views" service. Please add it to the "userServices".');
    }

    // we end up here if no exceptions were thrown
    return true;
};


export const initVScodeServices = async (args: {
    editorApp: MonacoEditorApp;
    userConfig: MonacoEditorUserConfig;
}) => {
    const { editorApp, userConfig } = args;

    const specificServices = await editorApp.specifyServices() ?? {};
    mergeServices(specificServices, userConfig.wrapperConfig.serviceConfig?.userServices ?? {});

    await initServices({
        serviceConfig: userConfig.wrapperConfig.serviceConfig,
        caller: `monaco-editor (${userConfig.id})`,
        performChecks: checkServiceConsistency
    });
};
