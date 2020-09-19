import * as vscode from "vscode";
import * as fs from "fs";
import { PanelButton } from "../PanelButton";

export function getItems() : PanelButton[] {
    const pool = new Array();
    pool.push(new PanelButton("Settings Manager", "", undefined, undefined, () => {}));

    pool.push(new PanelButton("Open settings UI", "Open user settings in UI", undefined, pool[0], () => {
        vscode.commands.executeCommand("workbench.action.openSettings2");
    }));
    pool.push(new PanelButton("Open settings.json", "Open user settings.json file", undefined, pool[0], () => {
        vscode.commands.executeCommand("workbench.action.openSettingsJson");
    }));
    pool.push(new PanelButton("Open default settings", "Open default settings.json file", undefined, pool[0], () => {
        vscode.commands.executeCommand("workbench.action.openRawDefaultSettings");
    }));

    pool.push(new PanelButton("", "", undefined, pool[0], () => {}));

    pool.push(new PanelButton("Open keybindings UI", "Open user keybindings in UI", undefined, pool[0], () => {
        vscode.commands.executeCommand("workbench.action.openGlobalKeybindings");
    }));
    pool.push(new PanelButton("Open keybindings.json", "Open user keybindings.json file", undefined, pool[0], () => {
        vscode.commands.executeCommand("workbench.action.openGlobalKeybindingsFile");
    }));
    pool.push(new PanelButton("Open default keybindings", "Open default keybindings.json file", undefined, pool[0], () => {
        vscode.commands.executeCommand("workbench.action.openDefaultKeybindingsFile");
    }));

    pool.push(new PanelButton("", "", undefined, pool[0], () => {}));

    pool.push(new PanelButton("Keybindings cheatsheet", "Keybindings cheatsheet generated from your's keybindings.json", undefined, pool[0], () => {
        const panel = vscode.window.createWebviewPanel("Keybindings cheatsheet", "Keybindings cheatsheet", vscode.ViewColumn.One, { enableScripts: true });
        fs.readFile(vscode.env.appRoot + "/../../data/user-data/User/keybindings.json", "utf8", function (err, data) {
            if (err) throw err;

            var table: string = "";
            var toggle: boolean = false;

            var obj_str: string = "";
            var new_table: boolean = false;
            var bracket_counter: number = 0;
            data.split("\n").forEach(element => {
                element = element.trim();
                if (element == "//") {
                    new_table = true;
                    if (table != "")
                        table += "</table></td>";
                    if (!toggle && table != "")
                        table += "</tr>";
                    return;
                }
                if (new_table) {
                    new_table = false;
                    while (element.startsWith(" ") || element.startsWith("/"))
                        element = element.substr(1, element.length);
                    while (element.endsWith(" ") || element.endsWith("."))
                        element = element.substr(0, element.length - 1);
                    if (!toggle)
                        table += "<tr>";
                    toggle = !toggle;
                    table += "<td><table><caption>" + element + "</caption>";
                    return;
                }
                if (element[0] == "{" || bracket_counter != 0)
                    for (var i: number = 0; i < element.length; i++) {
                        if (element[i] == "{")
                            bracket_counter++;
                        if (element[i] == "}") {
                            bracket_counter--;
                            if (bracket_counter == 0 && obj_str.length != 0) {
                                obj_str += element[i];
                                var obj_json: any = JSON.parse(obj_str);
                                var comment_index: number = element.lastIndexOf("/");
                                if (comment_index != -1 && comment_index != element.length - 1 && comment_index > element.lastIndexOf("}"))
                                    table += "<tr><td>" + element.substr(comment_index + 1, element.length).trim();
                                else
                                    table += "<tr><td>Unknown";
                                table += "<br><span style=\"color: gray;\">" + obj_json["command"] + "</span></td>";
                                var key: string = "";
                                var word: string = "";
                                for (var k: number = 0; k < obj_json["key"].length; k++) {
                                    if (obj_json["key"][k] == "+" || obj_json["key"][k] == " ") {
                                        switch (word.toLowerCase()) {
                                            case "up":
                                                word = "↑";
                                                break;
                                            case "down":
                                                word = "↓";
                                                break;
                                            case "right":
                                                word = "→";
                                                break;
                                            case "left":
                                                word = "←";
                                                break;
                                            default:
                                                break;
                                        }
                                        key += "<kbd>" + word + "</kbd>" + obj_json["key"][k];
                                        word = "";
                                        continue;
                                    }
                                    word += obj_json["key"][k];
                                }
                                key += "<kbd>" + word + "</kbd>"
                                table += "<td>" + key + "<br>" + (obj_json["when"] ? obj_json["when"] : "Everywhere") + "</td></tr>"
                                obj_str = "";
                                break;
                            }
                        }
                        obj_str += element[i];
                    }
            });

            if (toggle)
                table += "</table></td><td><table></table></td></tr>";

            panel.webview.html += "<!DOCTYPE html>\n";
            panel.webview.html += "<html>\n";
            panel.webview.html += "<style>\n";
            panel.webview.html += "    table, th, td { border: 1px solid darkslategray; margin: 1px; border-collapse: collapse; width: 100%; table-layout: fixed; overflow: hidden; }\n";
            panel.webview.html += "    th, td { padding: 3px; width: 50%; }\n";
            panel.webview.html += "    caption { font-size: medium; font-weight: bold; padding: 3px; }\n";
            panel.webview.html += "</style>\n";
            panel.webview.html += "<head><h1>Keybindings cheatsheet</h1></head>\n";
            panel.webview.html += "<body><table>" + table + "</table></body>\n";
            panel.webview.html += "</html>\n";
        });
    }));

    return pool;
}
