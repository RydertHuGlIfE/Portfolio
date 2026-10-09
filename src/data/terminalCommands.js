// Add commands to this list to extend the portfolio shell.
// For a custom response, set action: 'print' and write the response in output.
// Built-in actions: help, clear, fastfetch, ls, pwd, whoami, uname, date, uptime,
// history, echo, cat, cd, open, resume, github, email, theme, cowsay, matrix,
// redirect, fortune, hack, train, coffee, ping.
export const terminalCommands = [
  { name: 'help', aliases: ['?'], description: 'Show all available commands', usage: 'help', action: 'help' },
  { name: 'fastfetch', aliases: ['neofetch'], description: 'Show Varun’s portfolio system profile', usage: 'fastfetch', action: 'fastfetch' },
  { name: 'ls', aliases: ['dir'], description: 'List files and portfolio sections', usage: 'ls [path]', action: 'ls' },
  { name: 'tree', description: 'Show the portfolio project tree', usage: 'tree', action: 'print', output: 'portfolio/\n├── about/\n├── projects/\n│   ├── J.A.R.V.I.S.\n│   ├── RL Minesweeper\n│   ├── Jam_bo\n│   └── Kitaab Gyaani\n├── skills/\n├── contact/\n└── resume.pdf' },
  { name: 'pwd', description: 'Print the current virtual directory', usage: 'pwd', action: 'pwd' },
  { name: 'whoami', description: 'Show the current user', usage: 'whoami', action: 'whoami' },
  { name: 'uname', description: 'Show system information', usage: 'uname -a', action: 'uname' },
  { name: 'date', description: 'Show the current local date and time', usage: 'date', action: 'date' },
  { name: 'uptime', description: 'Show how long this session has been open', usage: 'uptime', action: 'uptime' },
  { name: 'history', description: 'Show commands entered in this session', usage: 'history', action: 'history' },
  { name: 'echo', description: 'Print a line of text', usage: 'echo <text>', action: 'echo' },
  { name: 'cat', description: 'Read a file from the virtual portfolio', usage: 'cat <file>', action: 'cat' },
  { name: 'cd', description: 'Navigate to a portfolio section', usage: 'cd <home|about|projects|skills|contact>', action: 'cd' },
  { name: 'projects', aliases: ['portfolio'], description: 'List the featured portfolio projects', usage: 'projects', action: 'print', output: '01  Audio Genre Classification\n02  CardioFusionX\n03  Kitaab Gyaani\n04  Minesweeper Playing Agent\n05  J.A.R.V.I.S.\n06  Jam_bo\n\nUse `open projects` to view project details.' },
  { name: 'open', description: 'Open a portfolio section', usage: 'open <about|projects|skills|contact>', action: 'open' },
  { name: 'skills', description: 'Jump to the skill tree', usage: 'skills', action: 'open', target: 'skills' },
  { name: 'about', description: 'Jump to experience and education', usage: 'about', action: 'open', target: 'about' },
  { name: 'contact', description: 'Jump to contact details', usage: 'contact', action: 'open', target: 'contact' },
  { name: 'resume', description: 'Open the resume PDF viewer', usage: 'resume', action: 'resume' },
  { name: 'github', description: 'Show the GitHub profile', usage: 'github', action: 'github' },
  { name: 'email', description: 'Show the contact email', usage: 'email', action: 'email' },
  { name: 'stack', description: 'List the primary technology stack', usage: 'stack', action: 'print', output: 'Python · C++ · HTML\nFlask · FastAPI · MongoDB · SQLite\nMachine Learning · Reinforcement Learning · REST APIs\nGit · GitHub · Linux · Automation' },
  { name: 'experience', description: 'Summarize recent experience', usage: 'experience', action: 'print', output: 'Software Developer Intern @ HustleGrad · Jan 2026–Present\nTechnical Member @ Geekroom · Jan 2026–Present\nTechnical Member @ CSI · Nov 2025–Present' },
  { name: 'education', description: 'Show current education', usage: 'education', action: 'print', output: 'B.Tech, Computer Science\nSRM Institute of Science and Technology · 2024–Present' },
  { name: 'theme', description: 'Switch terminal colors', usage: 'theme [arch|matrix|cyberpunk|neon]', action: 'theme' },
  { name: 'matrix', aliases: ['hackermode'], description: 'Engage the green terminal aesthetic', usage: 'matrix', action: 'matrix' },
  { name: 'cowsay', aliases: ['cow'], description: 'Make a cow say something', usage: 'cowsay <message>', action: 'cowsay' },
  { name: 'hehe', description: 'Open a very important video', usage: 'hehe', action: 'redirect', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { name: 'fortune', description: 'Get a tiny developer fortune', usage: 'fortune', action: 'fortune' },
  { name: 'hack', description: 'Run a completely fictional hacker sequence', usage: 'hack', action: 'hack' },
  { name: 'sl', aliases: ['train'], description: 'A tiny train crosses the terminal', usage: 'sl', action: 'train' },
  { name: 'coffee', description: 'Brew a virtual coffee', usage: 'coffee', action: 'coffee' },
  { name: 'ping', description: 'Ping the portfolio (simulation)', usage: 'ping [host]', action: 'ping' },
  { name: 'clear', aliases: ['cls'], description: 'Clear the terminal screen', usage: 'clear', action: 'clear' },
];

// Add files here to make them available to `cat <file>` and `ls`.
export const terminalFiles = {
  'about.txt': `VARUN CHAUHAN\nComputer Science student at SRMIST and Software Developer Intern at HustleGrad.\nInterested in AI agents, backend systems, real-time software, and Linux automation.`,
  'developer.json': `{
  "name": "Varun Chauhan",
  "role": "Software Developer Intern @ HustleGrad",
  "education": "B.Tech Computer Science @ SRMIST",
  "location": "Meerut, India",
  "github": "github.com/RydertHuGlIfE",
  "email": "varunchauhan2001dma@gmail.com"
}`,
  'projects.txt': `Audio Genre Classification — CNN-based eight-genre audio classifier.\nCardioFusionX — ECG research workspace with 12-lead classification models.\nKitaab Gyaani — collaborative AI study space for PDFs.\nMinesweeper Playing Agent — language model trained with SFT and GRPO.\nJ.A.R.V.I.S. — voice-driven desktop assistant with tools and Piper TTS.\nJam_bo — real-time synchronized media listening rooms.`,
  'skills.txt': `Languages: Python, C++, HTML\nFrameworks: Flask, FastAPI\nDatabases: MongoDB, SQLite\nTools: Git, GitHub, Linux\nConcepts: Machine Learning, OOP, REST APIs, Automation, Data Structures, System Design`,
  'jarvis.py': `# J.A.R.V.I.S. — AI desktop assistant\n# Python · Groq Cloud / LLaMA 3.3-70b · Piper neural TTS\n# Voice recognition · tool calling · Linux desktop automation\n\nprint("J.A.R.V.I.S. online. Listening for wake word...")`,
  'resume.txt': `Varun Chauhan\nB.Tech Computer Science @ SRMIST · 2024–Present\nSoftware Developer Intern @ HustleGrad · Jan 2026–Present\n\nRun ` + '`resume`' + ` to open the PDF viewer.`,
  'readme.md': `PORTFOLIO TERMINAL\nA small interactive shell for exploring Varun’s work.\n\nStart with: help\nList projects: projects\nBrowse files: ls\nRead a file: cat projects.txt\nNavigate: open projects\nTry a gag: cowsay hello`,
};

export const sectionNames = ['home', 'about', 'projects', 'skills', 'contact'];
