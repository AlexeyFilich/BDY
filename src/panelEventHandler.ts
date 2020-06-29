import * as vscode from 'vscode';

interface EventButton {
    label: string;
    description_: string;
}

export function panelEventHandler(object: EventButton) {
    // console.log(object.label);
    switch (object.label) {
        case 'Open settings.json':
            vscode.commands.executeCommand('workbench.action.openGlobalSettings');
            break;
        case 'Open keybindings.json': 
            vscode.commands.executeCommand('workbench.action.openGlobalKeybindingsFile');
            break;
        default:
            break;
    }
}
