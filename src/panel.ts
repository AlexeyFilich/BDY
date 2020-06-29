import * as vscode from 'vscode';

class PanelButton extends vscode.TreeItem {
    constructor(public readonly label: string, public readonly description_: string, public readonly nested: PanelButton[]) {
        super(label, vscode.TreeItemCollapsibleState.None   );
        if (nested.length == 0) {
            this.collapsibleState = vscode.TreeItemCollapsibleState.None;
        } else {
            this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
        }
        this.description_ = description_;
        this.nested = nested;
    }

    get tooltip(): string {
        return this.description_;
    }

    get description(): string {
        return this.description_;
    }
}

var panelButtonArray: PanelButton[] = new Array(
    new PanelButton('...', '...', []),
    new PanelButton('Open settings.json', 'Open user settings.json file', []),
    new PanelButton('Open keybindings.json', 'Open user keybindings.json file', []),
    new PanelButton('Nested', 'Nested', [
        new PanelButton('N1', 'N1', []),
        new PanelButton('N2', 'N2', []),
        new PanelButton('N3', 'N3', [])
    ])
);

export class PanelProvider implements vscode.TreeDataProvider<PanelButton> {
    constructor(private workspaceRoot: string) {}

    getTreeItem(element: PanelButton): vscode.TreeItem {
        return element;
    }

    getChildren(element?: PanelButton): Thenable<PanelButton[]> {
        if (element) {
            return Promise.resolve(element.nested);
        } else {
            return Promise.resolve(panelButtonArray);
        }
    }
}
