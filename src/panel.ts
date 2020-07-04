import * as vscode from 'vscode';
import * as path from 'path';

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

        this.nested_original = nested;
        this.nested = new Array();
    }

    // iconPath = {
    //     light: path.join(__filename, '..', '..', 'resources', this.icon),
    //     dark: path.join(__filename, '..', '..', 'resources', this.icon)
    // }

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

let panelButtonArray: PanelButton[] = [
    new PanelButton('...', '', []),
    new PanelButton('Open settings.json', 'Open user settings.json file', []),
    new PanelButton('Open keybindings.json', 'Open user keybindings.json file', []),
    new PanelButton('Comment Markers', '-', [
        new PanelButton('Update Markers', '-', [])
    ]),
    new PanelButton('Test1', '-', []),
    new PanelButton('Test2', '-', []),
    new PanelButton('Test3', '-', []),
    new PanelButton('Test4', '-', [])
];

export class PanelProvider implements vscode.TreeDataProvider<PanelButton> {
    constructor(private workspaceRoot: string) {}

    getTreeItem(element: PanelButton): vscode.TreeItem {
        switch (element.label) {
            case 'Test1':
                element.iconPath = {    
                    light: path.join(__filename, '..', '..', 'resources', 'light', 'fix.svg'),
                    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'fix.svg')
                };
                break;
            case 'Test2':
                element.iconPath = {    
                    light: path.join(__filename, '..', '..', 'resources', 'light', 'note.svg'),
                    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'note.svg')
                };
                break;
            case 'Test3':
                element.iconPath = {    
                    light: path.join(__filename, '..', '..', 'resources', 'light', 'review.svg'),
                    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'review.svg')
                };
                break;
            case 'Test4':
                element.iconPath = {    
                    light: path.join(__filename, '..', '..', 'resources', 'light', 'todo.svg'),
                    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'todo.svg')
                };
                break;
            default:
                break;
        }
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

export function getButtonByName(name: string): PanelButton | undefined {
    return panelButtonArray.find(e => e.label === name);
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
    let button = ref.object;
    switch (button.label) {
        case 'Open settings.json':
            {
                vscode.commands.executeCommand('workbench.action.openGlobalSettings');
            } break;
        case 'Open keybindings.json': 
            {
                vscode.commands.executeCommand('workbench.action.openGlobalKeybindingsFile');
            } break;
        case 'Update Markers':
            button = getButtonByName('Comment Markers')!;
        case 'Comment Markers':
            {
                if (vscode.window.activeTextEditor?.document.languageId != 'cpp')
                    break;
                button.nested = [];
                for (let i = 0; i < vscode.window.activeTextEditor.document.lineCount; ++i) {
                    const line = vscode.window.activeTextEditor.document.lineAt(i).text;
                    if (!line.includes('//'))
                        continue;
                    button.nested.push(new PanelButton(line, '-', []));
                    button.setCollapsibleExpanded();
                }
            } break;
        default:
            break;
    }
}
