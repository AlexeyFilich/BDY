import * as vscode from 'vscode';
import { PanelProvider } from './panel';
import { panelEventHandler } from './panelEventHandler'

export function activate(context: vscode.ExtensionContext) {
    console.log('[Better Done Yourself] Starting.');

    const panelProvider = new PanelProvider(vscode.workspace.rootPath!);
    var panel = vscode.window.createTreeView('bdypanel', { treeDataProvider: panelProvider });
    panel.onDidChangeSelection(function(event) {
        if (event.selection.length != 0) {
            panelEventHandler(event.selection[0]);
        }
    });

    let disposable = vscode.commands.registerCommand('bdy.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from BDY! Ale');
    });
}

export function deactivate() {
    console.log('[Better Done Yourself] Bye.');
}
