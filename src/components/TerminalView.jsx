import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sectionNames, terminalCommands, terminalFiles } from '../data/terminalCommands';
import './terminal.css';

const themeNames = ['arch', 'matrix', 'cyberpunk', 'neon'];
const prompt = 'ryder2001@portfolio';
const fortunes = [
  'It works on my machine. Ship the machine.',
  'The best debugger is a good night of sleep.',
  'There are only two hard things: cache invalidation and naming things.',
  'Small commits. Clear logs. Fewer mysteries.',
  'A feature is a bug that got good documentation.',
];

const FASTFETCH = `      .--.           ryder2001@portfolio
     |o_o |          --------------------
     |:_/ |          Name       Varun Chauhan
    //   \\ \\         OS         Arch Linux / zsh
   (|     | )        Education  B.Tech CS @ SRMIST
  /'\\_   _/\`\\        Role       Developer Intern @ HustleGrad
  \\___)=(___/        Stack      Python · AI · Backend · Linux

Building AI agents, real-time systems, and useful software.
Type 'help' for commands. Tab completes. Esc or 'exit' leaves the shell.`;

// [text, delay-after-ms]
const BOOT_SEQUENCE = [
  ['[    0.000000] Linux version 6.9.7-arch1-1 (linux@archlinux) #1 SMP PREEMPT_DYNAMIC', 120],
  ['[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-linux root=UUID=portfolio rw quiet', 50],
  ['[    0.004211] BIOS-provided physical RAM map:', 40],
  ['[    0.004213] BIOS-e820: [mem 0x0000000000000000-0x000000000009ffff] usable', 30],
  ['[    0.031877] x86/fpu: Supporting XSAVE feature 0x001: x87 floating point registers', 30],
  ['[    0.112004] smpboot: CPU0: portfolio virtual core @ 3.40GHz', 40],
  ['[    0.224518] ACPI: Core revision 20240322', 30],
  ['[    0.391002] PCI: Using configuration type 1 for base access', 30],
  ['[    0.612930] NET: Registered PF_INET protocol family', 40],
  ['[    0.884100] EXT4-fs (vda1): mounted filesystem with ordered data mode', 90],
  ['[    1.020331] systemd[1]: systemd 256.2-1-arch running in system mode', 120],
  ['[    1.020884] systemd[1]: Hostname set to <portfolio>.', 80],
  ['[  OK  ] Created slice Slice /system/getty.', 40],
  ['[  OK  ] Reached target Local File Systems.', 50],
  ['[  OK  ] Finished Load Kernel Modules.', 40],
  ['[  OK  ] Mounted /home/ryder2001/projects.', 60],
  ['[  OK  ] Started Network Manager.', 90],
  ['[  OK  ] Reached target Network is Online.', 60],
  ['[  OK  ] Started Portfolio Project Indexer.', 110],
  ['[  OK  ] Started Skills Daemon (python, ai, backend, linux).', 100],
  ['[  OK  ] Started Resume Renderer.', 70],
  ['[  OK  ] Reached target Multi-User System.', 120],
  ['', 200],
  ['Arch Linux 6.9.7-arch1-1 (tty1)', 60],
  ['', 40],
  ['portfolio login: ryder2001', 380],
  ['Password: ', 420],
  ['Last login: from tty1', 50],
];

function makeCow(message) {
  const line = message || 'Moo. You found a hidden command.';
  const width = Math.min(Math.max(line.length, 3), 68);
  const border = '-'.repeat(width + 2);
  return ` ${border}\n< ${line.slice(0, width)} >\n ${border}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`;
}

function getFilesForPath(path) {
  if (path === '/portfolio') return ['about/', 'projects/', 'skills/', 'contact/', ...Object.keys(terminalFiles)];
  if (path === '/portfolio/projects' || path === '/portfolio/projects/') return ['Audio_Genre_Classification/', 'CardioFusionX/', 'Kitaab_Gyaani/', 'Minesweeper_Playing_Agent/', 'J.A.R.V.I.S./', 'Jam_bo/', 'projects.txt', 'jarvis.py'];
  const section = path.replace('/portfolio/', '').replace(/\/$/, '');
  if (sectionNames.includes(section)) return ['README.md'];
  return null;
}

function formatDuration(startedAt) {
  const seconds = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
}

function getCompletion(value) {
  const lastSpace = value.lastIndexOf(' ');
  const prefix = lastSpace < 0 ? '' : value.slice(0, lastSpace + 1);
  const query = value.slice(lastSpace + 1).toLowerCase();
  const cmd = value.slice(0, lastSpace).trim();
  if (lastSpace >= 0 && !['cd', 'cat', 'open'].includes(cmd)) return null;
  const candidates = lastSpace >= 0
    ? (cmd === 'cat' ? Object.keys(terminalFiles) : sectionNames.map((name) => `${name}/`))
    : [...terminalCommands.flatMap((item) => [item.name, ...(item.aliases || [])]), 'exit'];
  const matches = [...new Set(candidates)].filter((item) => item.startsWith(query));
  if (!matches.length) return null;
  const completed = matches.length === 1 ? matches[0] : matches.reduce((shared, item) => {
    let i = 0;
    while (i < shared.length && i < item.length && shared[i] === item[i]) i += 1;
    return shared.slice(0, i);
  });
  return { value: `${prefix}${completed}`, matches };
}

export default function TerminalView({ setActiveTab, onOpenResume, onExit }) {
  const [phase, setPhase] = useState('boot'); // boot | shell
  const [bootLines, setBootLines] = useState([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [theme, setTheme] = useState('arch');
  const [currentPath, setCurrentPath] = useState('/portfolio');
  const inputRef = useRef(null);
  const screenRef = useRef(null);
  const startedAt = useRef(Date.now());
  const timer = useRef(null);

  const enterShell = useCallback(() => {
    window.clearTimeout(timer.current);
    setPhase('shell');
    setHistory((h) => (h.length ? h : [{ command: 'fastfetch', cwd: '/portfolio', output: FASTFETCH }]));
  }, []);

  const exitShell = () => (onExit ? onExit() : setActiveTab(sectionNames[0]));

  // Boot sequencer
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      enterShell();
      return undefined;
    }
    let i = 0;
    setBootLines([]);
    const next = () => {
      if (i >= BOOT_SEQUENCE.length) {
        timer.current = window.setTimeout(enterShell, 450);
        return;
      }
      const [text, delay] = BOOT_SEQUENCE[i];
      setBootLines((l) => [...l, text]);
      i += 1;
      timer.current = window.setTimeout(next, delay);
    };
    timer.current = window.setTimeout(next, 350);
    return () => window.clearTimeout(timer.current);
  }, [enterShell]);

  // Skip boot with any key
  useEffect(() => {
    if (phase !== 'boot') return undefined;
    const skip = () => enterShell();
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, [phase, enterShell]);

  // Esc leaves, anywhere
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && phase === 'shell') exitShell(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    const el = screenRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history, bootLines, phase]);

  useEffect(() => { if (phase === 'shell') inputRef.current?.focus(); }, [phase]);

  const print = (output, extra = {}) => ({ output, ...extra });
  const resolveCommand = (name) => terminalCommands.find((e) => e.name === name || e.aliases?.includes(name));

  const runCommand = (rawValue) => {
    const value = rawValue.trim();
    if (!value) {
      setHistory((p) => [...p, { command: '', cwd: currentPath, output: '' }]);
      setInput('');
      return;
    }
    const parts = value.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    const typedName = parts[0].toLowerCase();
    const args = parts.slice(1).map((p) => p.replace(/^["']|["']$/g, ''));
    const cwd = currentPath;

    if (typedName === 'exit' || typedName === 'quit' || typedName === 'logout') {
      setHistory((p) => [...p, { command: value, cwd, output: 'logout' }]);
      window.setTimeout(exitShell, 350);
      setInput('');
      return;
    }

    const entry = resolveCommand(typedName);
    let result;

    if (!entry) {
      result = print(`zsh: command not found: ${typedName}\nType 'help' to see available commands.`);
    } else {
      const arg = args[0] || '';
      const action = entry.action;
      switch (action) {
        case 'help': {
          const fun = new Set(['cowsay', 'matrix', 'hehe', 'fortune', 'hack', 'sl', 'coffee', 'ping']);
          const fmt = (c) => `${c.name}${c.aliases?.length ? ` (${c.aliases.join(', ')})` : ''}\n  ${c.usage}\n  ${c.description}`;
          result = print([
            'PORTFOLIO COMMANDS',
            ...terminalCommands.filter((c) => c.name !== 'help' && !fun.has(c.name)).map(fmt),
            'exit\n  exit\n  Leave the shell (or press Esc)',
            '',
            'FUN COMMANDS',
            ...terminalCommands.filter((c) => fun.has(c.name)).map(fmt),
          ].join('\n'));
          break;
        }
        case 'fastfetch': result = print(FASTFETCH); break;
        case 'ls': {
          const target = arg ? (arg.startsWith('/') ? arg : `${currentPath}/${arg}`).replace(/\/+/g, '/') : currentPath;
          const files = getFilesForPath(target);
          result = files ? print(files.join('    ')) : print(`ls: cannot access '${arg}': No such directory`);
          break;
        }
        case 'pwd': result = print(currentPath); break;
        case 'whoami': result = print('varun · software developer · computer science student'); break;
        case 'uname': result = print('Linux portfolio 6.9.7-arch1-1 x86_64 GNU/Linux'); break;
        case 'date': result = print(new Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeStyle: 'long' }).format(new Date())); break;
        case 'uptime': result = print(`Portfolio session active for ${formatDuration(startedAt.current)}.`); break;
        case 'history':
          result = print(commandHistory.length ? commandHistory.map((c, i) => `${String(i + 1).padStart(3)}  ${c}`).join('\n') : 'No commands in history yet.');
          break;
        case 'echo': result = print(args.join(' ')); break;
        case 'cat': {
          const fileName = (arg.split('/').pop() || '').toLowerCase();
          if (terminalFiles[fileName]) result = print(terminalFiles[fileName]);
          else if (fileName.endsWith('.pdf')) { onOpenResume(); result = print('Opening the resume viewer…'); }
          else result = print(`cat: ${arg || 'missing filename'}: No such file. Run 'ls' to browse available files.`);
          break;
        }
        case 'cd': {
          let dest = arg || '/portfolio';
          if (dest === '..') dest = '/portfolio';
          if (!dest.startsWith('/')) dest = `${currentPath}/${dest}`;
          dest = dest.replace(/\/+/g, '/').replace(/\/$/, '') || '/portfolio';
          if (dest === '/portfolio' || sectionNames.some((s) => dest === `/portfolio/${s}`)) {
            setCurrentPath(dest);
            const section = dest.slice('/portfolio/'.length);
            if (sectionNames.includes(section)) setActiveTab(section);
            result = print('');
          } else result = print(`cd: no such directory: ${arg}`);
          break;
        }
        case 'open':
          if (sectionNames.includes(entry.target || arg)) {
            setActiveTab(entry.target || arg);
            result = print(`Opening ${entry.target || arg}…`);
          } else result = print(`open: choose a section: ${sectionNames.join(', ')}`);
          break;
        case 'resume': onOpenResume(); result = print('Opening Varun Chauhan’s resume…'); break;
        case 'github': result = print('github.com/RydertHuGlIfE', { link: 'https://github.com/RydertHuGlIfE' }); break;
        case 'email': result = print('varunchauhan2001dma@gmail.com', { link: 'mailto:varunchauhan2001dma@gmail.com' }); break;
        case 'theme': {
          if (arg && themeNames.includes(arg)) { setTheme(arg); result = print(`Theme set to ${arg}.`); }
          else if (!arg) {
            const nt = themeNames[(themeNames.indexOf(theme) + 1) % themeNames.length];
            setTheme(nt);
            result = print(`Theme switched to ${nt}. Available: ${themeNames.join(', ')}.`);
          } else result = print(`Unknown theme: ${arg}. Choose: ${themeNames.join(', ')}.`);
          break;
        }
        case 'matrix':
          setTheme('matrix');
          result = print('Wake up, developer...\nMATRIX MODE ENABLED\n[####################] 100%  READY');
          break;
        case 'cowsay': result = print(makeCow(args.join(' '))); break;
        case 'redirect':
          result = print('Opening the requested video…', { redirect: entry.url });
          window.location.assign(entry.url);
          break;
        case 'fortune': result = print(fortunes[Math.floor(Math.random() * fortunes.length)]); break;
        case 'hack':
          result = print('INITIALIZING MOVIE HACKER SEQUENCE...\n[SIMULATION] Scanning imaginary firewall...\n[SIMULATION] Compiling dramatic green text...\nACCESS GRANTED TO: your next portfolio section\nRelax. Nothing was accessed or changed.');
          break;
        case 'train':
          result = print('      ====        ________                 ___________\n  _D _|  |_______/        \\__I_I_____===__|_________|\n   |(_)---  |   H\\________/ |   |        =|___ ___|\n   /     |  |   H  |  |     |   |         ||_| |_||\n  |      |  |   H  |__--------------------| [___] |\n  | ________|___H__/__|_____/[][]~\\_______|       |\n  |/ |   |-----------I_____I [][] []  D   |=======|__');
          break;
        case 'coffee':
          result = print(' ( (\n  ) )\n........\n|      |]\n\\      /\n `----\'\nCoffee compiled. Take a sip, then ship a feature.');
          break;
        case 'ping':
          result = print(`PING ${arg || 'portfolio.local'} (simulation):\n64 bytes: seq=1 time=12ms\n64 bytes: seq=2 time=9ms\n64 bytes: seq=3 time=11ms\n3 packets transmitted, 3 received. This is a UI simulation.`);
          break;
        case 'clear': setHistory([]); setInput(''); return;
        case 'print': result = print(entry.output || ''); break;
        default: result = print(`Command action '${action}' is not supported.`);
      }
    }

    setCommandHistory((p) => [...p, value]);
    setHistory((p) => [...p, { command: value, cwd, ...result }]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); setHistory([]); return; }
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      setHistory((p) => [...p, { command: `${input}^C`, cwd: currentPath, output: '' }]);
      setInput('');
      return;
    }
    if (e.key === 'Enter') { e.preventDefault(); runCommand(input); }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!commandHistory.length) return;
      const n = historyIndex < 0 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(n);
      setInput(commandHistory[n]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < 0) return;
      const n = historyIndex + 1;
      setHistoryIndex(n >= commandHistory.length ? -1 : n);
      setInput(n >= commandHistory.length ? '' : commandHistory[n]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const c = getCompletion(input);
      if (!c) return;
      if (c.value === input && c.matches.length > 1) {
        setHistory((p) => [...p, { command: input, cwd: currentPath, output: c.matches.join('    ') }]);
      } else setInput(c.value);
    }
  };

  const renderBootLine = (line, i) => {
    const ok = line.startsWith('[  OK  ]');
    return (
      <div className="tty-line" key={i}>
        {ok ? <><span className="tty-bracket">[</span><span className="tty-ok">  OK  </span><span className="tty-bracket">]</span>{line.slice(8)}</> : line || '\u00A0'}
      </div>
    );
  };

  const PromptLine = ({ cwd }) => (
    <span className="tty-prompt">
      <span className="tty-user">{prompt}</span><span className="tty-sep">:</span>
      <span className="tty-path">{cwd.replace('/portfolio', '~')}</span><span className="tty-sep">$</span>
    </span>
  );

  return (
    <section
      className={`tty tty--${theme}`}
      ref={screenRef}
      onClick={() => { if (phase === 'boot') enterShell(); else inputRef.current?.focus(); }}
    >
      {phase === 'boot' && (
        <>
          {bootLines.map(renderBootLine)}
          <div className="tty-line tty-skip">press any key to skip</div>
        </>
      )}

      {phase === 'shell' && (
        <>
          {history.map((item, i) => (
            <div className="tty-entry" key={i}>
              <div className="tty-line"><PromptLine cwd={item.cwd} /> <span className="tty-cmd">{item.command}</span></div>
              {item.output && <pre className="tty-out">{item.output}</pre>}
              {item.link && <a className="tty-link" href={item.link} target={item.link.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{item.link}</a>}
            </div>
          ))}
          <form className="tty-line tty-input" onSubmit={(e) => { e.preventDefault(); runCommand(input); }}>
            <PromptLine cwd={currentPath} />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Terminal input"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              autoFocus
            />
          </form>
        </>
      )}
    </section>
  );
}