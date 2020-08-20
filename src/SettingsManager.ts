import { PanelButton } from './PanelButton'

export function getItems() : PanelButton[] {
    const pool = new Array();
    pool.push(new PanelButton('Settings Manager', '', undefined, () => {}));
    pool.push(new PanelButton('Testnest', 'testtest', pool[0], () => {}));

    return pool;
}
