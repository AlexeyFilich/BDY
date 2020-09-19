import * as vscode from "vscode";
import { PanelButton } from "../PanelButton";

export function getItems() : PanelButton[] {
    const pool = new Array();
    pool.push(new PanelButton("Comment Markers", "", undefined, undefined, () => {}));

    pool.push(new PanelButton("", "", undefined, pool[0], () => {}));

    return pool;
}
