import * as os from 'os';
import * as pty from 'node-pty';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as ligatures from 'xterm-addon-ligatures';
import _debounce = require('lodash.debounce');

Terminal.applyAddon(fit);
Terminal.applyAddon(ligatures);

const term = new Terminal({
    fontFamily: 'Fira Code, Iosevka, monospace',
    fontSize: 12,
    experimentalCharAtlas: 'dynamic'
});

const terminalElem = document.getElementById('term')!;

term.open(terminalElem);
(term as any).enableLigatures();
(term as any).fit();

const ptyProc = pty.spawn(os.platform() === 'win32' ? 'powershell.exe' : process.env.SHELL || '/bin/bash', [], {
    cols: term.cols,
    rows: term.rows
});

const fitDebounced = _debounce(() => {
    (term as any).fit();
}, 17);

term.on('data', (data: string) => {
    ptyProc.write(data);
});

term.on('resize', size => {
    ptyProc.resize(
        Math.max(size ? size.cols : term.cols, 1),
        Math.max(size ? size.rows : term.rows, 1)
    );
});

ptyProc.on('data', data => {
    term.write(data);
});

window.onresize = () => {
    fitDebounced();
};
