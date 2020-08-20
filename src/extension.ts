import * as vscode from 'vscode';
import { PanelProvider } from './PanelProvider';

// let statusBar: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext, context: vscode.ExtensionContext) {
    console.log('[Better Done Yourself] Starting.');

    const panelProvider = new PanelProvider(vscode.workspace.rootPath!);
    let panel = vscode.window.createTreeView('bdypanel', { treeDataProvider: panelProvider });

    panel.onDidChangeSelection(function(event) {
        if (event.selection.length != 0) {
            event.selection[0].execute();
        }
        panelProvider.refresh();
        panel.reveal(panelProvider.pool[0]);
    });

    // statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 9999999);
    // statusBar.text = "Hello!";
    // statusBar.show();
}

export function deactivate() {
    console.log('[Better Done Yourself] Bye.');
}
