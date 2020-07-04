import * as vscode from 'vscode';
import { PanelProvider, panelEventHandler } from './panel';
// import { panelEventHandler } from './panelEventHandler'

let statusBar: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext, context: vscode.ExtensionContext) {
    console.log('[Better Done Yourself] Starting.');

    const panelProvider = new PanelProvider(vscode.workspace.rootPath!);
    let panel = vscode.window.createTreeView('bdypanel', { treeDataProvider: panelProvider });
    panel.onDidChangeSelection(function(event) {
        if (event.selection.length != 0) {
            panelEventHandler({ object: event.selection[0]});
        }
        panelProvider.refresh();
    });

    // statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 9999999);
    // statusBar.text = "Hello!";
    // statusBar.show();
}

export function deactivate() {
    console.log('[Better Done Yourself] Bye.');
}
