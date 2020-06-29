import * as vscode from 'vscode';
import { ControlPanelProvider } from './ControlPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('[Better Done Yourself] Starting.');

    const controlPanelProvider = new ControlPanelProvider(vscode.workspace.rootPath!);
    var controlPanel = vscode.window.createTreeView('bdypanel', { treeDataProvider: controlPanelProvider });
    controlPanel.onDidChangeSelection(function(event) {
        if (event.selection.length != 0) {
            switch (event.selection[0].label) {
                case 'Open settings.json':
                    console.log('S');
                    vscode.commands.executeCommand('workbench.action.openGlobalSettings');
                    break;
                case 'Open keybindings.json': 
                    console.log('K');
                    vscode.commands.executeCommand('workbench.action.openGlobalKeybindingsFile');
                    break;
                default:
                    console.log('D');
                    break;
            }
        }
    });

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('bdy.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from BDY! Ale');
    });
}

export function deactivate() {
    console.log('[Better Done Yourself] Bye.');
}
