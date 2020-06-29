import * as vscode from 'vscode';
import * as path from 'path';

//  workbench.action.openGlobalSettings
//  workbench.action.openGlobalKeybindingsFile

export class ControlPanelProvider implements vscode.TreeDataProvider<PanelButton> {
    constructor(private workspaceRoot: string) {}

    getTreeItem(element: PanelButton): vscode.TreeItem {
        return element;
    }

    getChildren(element?: PanelButton): Thenable<PanelButton[]> {
        if (!this.workspaceRoot) {
            // vscode.window.showInformationMessage('No item in empty workspace');
            // return Promise.resolve([]);
        }

        if (element) {
            if ((element.label != 'Open settings.json') && (element.label != 'Open keybindings.json')) {
                return Promise.resolve([new PanelButton('Test', 'DD', vscode.TreeItemCollapsibleState.None)]);
            }
            return Promise.resolve([]);
        } else {
            return Promise.resolve([
                new PanelButton('Open settings.json', 'Open user settings.json file', vscode.TreeItemCollapsibleState.None),
                new PanelButton('Open keybindings.json', 'Open user keybindings.json file', vscode.TreeItemCollapsibleState.None),
                new PanelButton('TestA', 'Da', vscode.TreeItemCollapsibleState.Expanded),
                new PanelButton('TestB', 'Db', vscode.TreeItemCollapsibleState.Expanded),
                new PanelButton('TestC', 'Dc', vscode.TreeItemCollapsibleState.Expanded)
            ]);
        }
    }
}

class PanelButton extends vscode.TreeItem {
    description_ = "";

    constructor(public readonly label: string, description_: string, public readonly collapsible_state: vscode.TreeItemCollapsibleState) {
        super(label, collapsible_state);
        this.description_ = description_;
    }

    get tooltip(): string {
        return this.description_;
    }

    get description(): string {
        return this.description_;
    }

    // iconPath = {}
}
