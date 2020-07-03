import * as vscode from 'vscode';

class PanelButton extends vscode.TreeItem {
    nested_original: PanelButton[];
    nested: PanelButton[];
    
    constructor(public readonly label: string, public readonly description_: string, nested: PanelButton[]) {
        super(label, vscode.TreeItemCollapsibleState.None);

        if (nested.length == 0) {
            this.collapsibleState = vscode.TreeItemCollapsibleState.None;
        } else {
            this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
        }

        this.description_ = description_;

        this.nested_original = nested;
        this.nested = new Array();
    }

    get tooltip(): string {
        return this.description_;
    }

    get description(): string {
        return this.description_;
    }

    setCollapsibleNone() {
        this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    }

    setCollapsibleCollapsed() {
        this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    }

    setCollapsibleExpanded() {
        this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    }
}

var panelButtonArray: PanelButton[] = new Array(
    new PanelButton('...', '', []),
    new PanelButton('Open settings.json', 'Open user settings.json file', []),
    new PanelButton('Open keybindings.json', 'Open user keybindings.json file', []),
    new PanelButton('Comment Markers', '-', [
        new PanelButton('Get Markers', '-', [])
    ]),
    new PanelButton('Test', '-', [
        new PanelButton('Test1', '-', [])
    ])
);

export class PanelProvider implements vscode.TreeDataProvider<PanelButton> {
    constructor(private workspaceRoot: string) {}

    getTreeItem(element: PanelButton): vscode.TreeItem {
        return element;
    }

    getChildren(element?: PanelButton): Thenable<PanelButton[]> {
        if (element) {
            return Promise.resolve(element.nested_original.concat(element.nested));
        } else {
            return Promise.resolve(panelButtonArray);
        }
    }

    private _onDidChangeTreeData: vscode.EventEmitter<PanelButton | undefined> = new vscode.EventEmitter<PanelButton | undefined>();
    readonly onDidChangeTreeData: vscode.Event<PanelButton | undefined> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }
}

/*
 ...........................................................
 .██...██..█████..███....██.██████..██......███████.██████..
 .██...██.██...██.████...██.██...██.██......██......██...██.
 .███████.███████.██.██..██.██...██.██......█████...██████..
 .██...██.██...██.██..██.██.██...██.██......██......██...██.
 .██...██.██...██.██...████.██████..███████.███████.██...██.
 ...........................................................
*/

export async function panelEventHandler(ref: { object: PanelButton }) {
    switch (ref.object.label) {
        case 'Open settings.json':
            {
                vscode.commands.executeCommand('workbench.action.openGlobalSettings');
            } break;
        case 'Open keybindings.json': 
            {
                vscode.commands.executeCommand('workbench.action.openGlobalKeybindingsFile');
            } break;
        case 'Comment Markers':
            {
                if (vscode.window.activeTextEditor?.document.languageId != 'cpp')
                    break;
                ref.object.nested = [];
                for (let i = 0; i < vscode.window.activeTextEditor.document.lineCount; ++i) {
                    const line = vscode.window.activeTextEditor.document.lineAt(i).text;
                    if (!line.includes('//'))
                        continue;
                    ref.object.nested.push(new PanelButton(line, '-', []));
                    ref.object.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
                }
            } break;
        default:
            break;
    }
}
