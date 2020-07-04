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

    setIcon(light: string, dark: string) {
        this.iconPath = {    
            light: path.join(__filename, '..', '..', 'resources', 'light', light),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', dark)
        };
    }
}   

let panelButtonArray: PanelButton[] = [
    new PanelButton('...', '', []),
    new PanelButton('Open settings.json', 'Open user settings.json file', []),
    new PanelButton('Open keybindings.json', 'Open user keybindings.json file', []),
    new PanelButton('Comment Markers', '-', [
        new PanelButton('Update Markers', '-', [])
    ])
];

export class PanelProvider implements vscode.TreeDataProvider<PanelButton> {
    constructor(private workspaceRoot: string) {}

    getTreeItem(element: PanelButton): vscode.TreeItem {
        switch (element.label) {
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

// FIX!
export function getButtonByName(name: string): PanelButton | undefined {
    function findNested(array: PanelButton[]): PanelButton | undefined {
        for (let i = 0; i < array.length; i++) {
            if (array[i].label === name) {
                return array[i];
            }    
        }
        for (let i = 0; i < array.length; i++) {
            let temp = findNested([...array[i].nested_original, ...array[i].nested]);
            if (temp) {
                return temp;
            }
        }
        return undefined;
    }
    return findNested(panelButtonArray);
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
        case '...':
            {
                console.log(getButtonByName('Comment Markers'));
                console.log(getButtonByName('Update Markers'));
            } break;
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
                    const line = vscode.window.activeTextEditor.document.lineAt(i).text.trim();
                    if (line.toUpperCase().startsWith('// NOTE ') || (line.toUpperCase().startsWith('// NOTE:'))) {
                        let temp = new PanelButton(line.slice(8).trim(), 'Note on line ' + (i + 1), []);
                        temp.setIcon('note.svg', 'note.svg');
                        button.nested.push(temp);
                    }
                    if (line.toUpperCase().startsWith('// TODO ') || (line.toUpperCase().startsWith('// TODO:'))) {
                        let temp = new PanelButton(line.slice(8).trim(), 'Todo on line ' + (i + 1), []);
                        temp.setIcon('todo.svg', 'todo.svg');
                        button.nested.push(temp);
                    }
                    if (line.toUpperCase().startsWith('// FIX ') || (line.toUpperCase().startsWith('// FIX:'))) {
                        let temp = new PanelButton(line.slice(7).trim(), 'Fix on line ' + (i + 1), []);
                        temp.setIcon('fix.svg', 'fix.svg');
                        button.nested.push(temp);
                    }
                    if (line.toUpperCase().startsWith('// REVIEW ') || (line.toUpperCase().startsWith('// REVIEW:'))) {
                        let temp = new PanelButton(line.slice(10).trim(), 'Review on line ' + (i + 1), []);
                        temp.setIcon('review.svg', 'review.svg');
                        button.nested.push(temp);
                    }
                }
            } break;
        default:
            break;
    }
}
