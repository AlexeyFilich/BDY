import * as vscode from "vscode";
import * as path from "path";

export class PanelButton extends vscode.TreeItem {
    parent: PanelButton | undefined;
    exec_function: Function;

    constructor(public readonly label: string, public readonly tooltip_: string, icon: string | undefined, parent: PanelButton | undefined, exec_function: Function) {
        super(label, vscode.TreeItemCollapsibleState.None);

        if (parent)
            parent.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
        
        if (icon)
        this.iconPath = {    
            light: path.join(__filename, "..", "..", "resources", "light", icon),
            dark: path.join(__filename, "..", "..", "resources", "dark", icon)
        };
        
        this.parent = parent;
        this.exec_function = exec_function;
    }

    get tooltip(): string {
        return this.tooltip_;
    }

    execute() {
        vscode.commands.executeCommand("list.toggleSelection");
        this.exec_function();
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
