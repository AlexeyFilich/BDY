import * as vscode from "vscode";
import { PanelButton } from "./PanelButton";

import * as SettingsManager from "./Managers/SettingsManager";
import * as MarkerManager from "./Managers/MarkerManager";

export class PanelProvider implements vscode.TreeDataProvider<PanelButton> {
    pool: PanelButton[];

    constructor(private workspaceRoot: string) {
        this.pool = new Array(
            new PanelButton("...", "", undefined, undefined, () => {}),
        );
        this.addButtonToPool(SettingsManager.getItems());
        this.addButtonToPool(MarkerManager.getItems());
    }

    addButtonToPool(element: PanelButton | PanelButton[]) {
        if (element instanceof PanelButton)
            this.pool.push(element);
        else
            element.forEach(element => {
                this.pool.push(element)
            });
    }

    removeButtonFromPool(element: PanelButton) {
        const index = this.pool.indexOf(element, 0);
        if (index > -1)
            this.pool.splice(index, 1);
    }

    getTreeItem(element: PanelButton): vscode.TreeItem {
        return element;
    }

    getChildren(element?: PanelButton): Thenable<PanelButton[]> {
        if (element)
            return Promise.resolve(this.pool.filter(item => item.parent === element));
        else
            return Promise.resolve(this.pool.filter(item => item.parent === undefined));
        
    }

    getParent(element: PanelButton): vscode.ProviderResult<PanelButton> | undefined {
        return element.parent;
    }

    private _onDidChangeTreeData: vscode.EventEmitter<PanelButton | undefined> = new vscode.EventEmitter<PanelButton | undefined>();
    readonly onDidChangeTreeData: vscode.Event<PanelButton | undefined> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }
}
