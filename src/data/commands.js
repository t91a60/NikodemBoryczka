import { getHistory } from '../lib/terminalHistory.js'

const neofetchData = {
  uptime: Math.floor(Math.random() * 999),
  usedRam: Math.floor(Math.random() * 8 + 12),
  totalRam: Math.floor(Math.random() * 4 + 28),
}

export const autoCompleteMap = [
  'help', 'projects', 'about', 'contact', 'clear',
  'history', 'echo', 'whoami', 'ls', 'date', 'neofetch',
  'pwd', 'uname', 'uptime', 'cal', 'banner', 'sudo', 'ping',
]

export const commands = {
  help: () =>
    '\x1b[33mAvailable commands:\x1b[0m\n' +
    '  \x1b[32mhelp\x1b[0m       Show this message\n' +
    '  \x1b[32mprojects\x1b[0m   List projects\n' +
    '  \x1b[32mabout\x1b[0m      About me\n' +
    '  \x1b[32mcontact\x1b[0m    Contact info\n' +
    '  \x1b[32mclear\x1b[0m      Clear terminal\n' +
    '  \x1b[32mhistory\x1b[0m    Command history\n' +
    '  \x1b[32mecho\x1b[0m       Print text\n' +
    '  \x1b[32mwhoami\x1b[0m     Display current user\n' +
    '  \x1b[32mls\x1b[0m         List directory\n' +
    '  \x1b[32mdate\x1b[0m       Current date\n' +
    '  \x1b[32mneofetch\x1b[0m   System info\n' +
    '  \x1b[32mpwd\x1b[0m        Print working directory\n' +
    '  \x1b[32muname\x1b[0m      System info\n' +
    '  \x1b[32muptime\x1b[0m     How long system has been running\n' +
    '  \x1b[32mcal\x1b[0m        Calendar\n' +
    '  \x1b[32mbanner\x1b[0m     Display a banner\n' +
    '  \x1b[32msudo\x1b[0m       Execute as root\n' +
    '  \x1b[32mping\x1b[0m       Ping a host\n' +
    '  \x1b[32mps\x1b[0m         Process list\n' +
    '  \x1b[32mopen\x1b[0m       Open project details',

  whoami: 'nikodem',
  date: () => new Date().toLocaleString('en-US'),
  pwd: '/home/nikodem',
  uname: 'Linux dev-desktop 6.8.0-generic #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
  uptime: () => {
    const h = Math.floor(neofetchData.uptime / 24)
    const m = neofetchData.uptime % 24
    return `${h} day${h !== 1 ? 's' : ''}, ${m} hour${m !== 1 ? 's' : ''}`
  },
  cal: () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const first = new Date(year, month, 1).getDay()
    const days = new Date(year, month + 1, 0).getDate()
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const header = `    ${months[month]} ${year}`
    const weeks = ['Su Mo Tu We Th Fr Sa']
    let line = ' '.repeat(first * 3)
    for (let d = 1; d <= days; d++) {
      line += `${d}`.padStart(2) + ' '
      if ((d + first) % 7 === 0) { weeks.push(line); line = '' }
    }
    if (line.trim()) weeks.push(line)
    return header + '\n' + weeks.join('\n')
  },
  banner: () =>
    '\x1b[1;33m  __  __     _         _                      _      \x1b[0m\n' +
    '\x1b[1;33m |  \\/  |   (_)       | |                    | |     \x1b[0m\n' +
    '\x1b[1;33m | \\  / | __ _  ___ | |__   ___  _ __ ___ | |__   \x1b[0m\n' +
    '\x1b[1;33m | |\\/| |/ _` |/ __|| \'_ \\ / _ \\| \'_ ` _ \\| \'_ \\  \x1b[0m\n' +
    '\x1b[1;33m | |  | | (_| |\\__ \\| | | | (_) | | | | | | |_) | \x1b[0m\n' +
    '\x1b[1;33m |_|  |_|\\__,_||___/|_| |_|\\___/|_| |_| |_|_.__/  \x1b[0m',

  ls: '\x1b[36mDocuments/\x1b[0m  \x1b[36mProjects/\x1b[0m  \x1b[36mAbout/\x1b[0m  \x1b[36mContact/\x1b[0m  \x1b[33mREADME.md\x1b[0m  \x1b[32mportfolio.tar.gz\x1b[0m',

  about: () =>
    '\x1b[1;37mNikodem Boryczka\x1b[0m\n' +
    '\x1b[33mAI Developer & Software Engineer\x1b[0m\n' +
    'Student, Programming Technical School (AI)\n' +
    'Silesia, Poland\n' +
    '\nOpen-source builder. I build things that work.',

  contact: () =>
    '\x1b[34mgithub\x1b[0m  \x1b[36mt91a60\x1b[0m\n' +
    '\x1b[34memail\x1b[0m   \x1b[36mt91a60\x1b[33m@\x1b[36mgmail.com\x1b[0m',

  projects: () =>
    '\x1b[1;33mProjects:\x1b[0m\n' +
    '  \x1b[32mOSP Logbook\x1b[0m    \x1b[36mFlask\x1b[0m/\x1b[36mPostgreSQL\x1b[0m/\x1b[36mDocker\x1b[0m\n' +
    '  \x1b[32mAlkoRater\x1b[0m      \x1b[36mPWA\x1b[0m/\x1b[36mJavaScript\x1b[0m/\x1b[36miOS\x1b[0m\n' +
    '  \x1b[32mGather\x1b[0m        \x1b[36mFastAPI\x1b[0m/\x1b[36mPostgreSQL\x1b[0m/\x1b[36mRedis\x1b[0m\n' +
    '  \x1b[32mUPM Ultras\x1b[0m     \x1b[36mHTML\x1b[0m/\x1b[36mCSS\x1b[0m/\x1b[36mStatic Site\x1b[0m\n' +
    'Type \x1b[33mopen <name>\x1b[0m for details.',

  history: () => {
    const h = getHistory()
    return h.length
      ? h.map((c, i) => `${String(i + 1).padStart(3)}  ${c}`).join('\n')
      : '\x1b[90mno commands in history\x1b[0m'
  },

  neofetch: () =>
    '\x1b[1;33m          .-/+ooo+/--.            \x1b[0m\x1b[1;37mnikodem@dev-desktop\x1b[0m\n' +
    '\x1b[33m      .:+ooooooooooo+/-          \x1b[0m\x1b[34mOS:\x1b[0m \x1b[36mUbuntu 24.04 LTS x86_64\x1b[0m\n' +
    '\x1b[33m    .+ooooooooooooooooo/.        \x1b[0m\x1b[34mHost:\x1b[0m \x1b[36mDev Machine v2.4\x1b[0m\n' +
    '\x1b[33m   /oooooooooooooooooooo+.       \x1b[0m\x1b[34mKernel:\x1b[0m \x1b[36mLinux 6.8.0-generic\x1b[0m\n' +
    '\x1b[33m  :ooooooooooooooooooooooo:      \x1b[0m\x1b[34mUptime:\x1b[0m \x1b[36m' + neofetchData.uptime + ' hours\x1b[0m\n' +
    '\x1b[32m -/ooooooooooooooooooooooo/-     \x1b[0m\x1b[34mDE:\x1b[0m \x1b[36mGNOME 46\x1b[0m\n' +
    '\x1b[32m:ooooooooooooooooooooooooooo:    \x1b[0m\x1b[34mShell:\x1b[0m \x1b[35mdev-portfolio 1.0\x1b[0m\n' +
    '\x1b[32m:ooooooooooooooooooooooooooo:    \x1b[0m\x1b[34mTerminal:\x1b[0m \x1b[36m/dev/tty1\x1b[0m\n' +
    '\x1b[32m -/ooooooooooooooooooooooo/-     \x1b[0m\x1b[34mCPU:\x1b[0m \x1b[36mAMD Ryzen 7 (16) @ 4.2GHz\x1b[0m\n' +
    '\x1b[33m  :ooooooooooooooooooooooo:      \x1b[0m\x1b[34mMemory:\x1b[0m \x1b[36m' + neofetchData.usedRam + 'GB / ' + neofetchData.totalRam + 'GB\x1b[0m\n' +
    '\x1b[33m   /oooooooooooooooooooo+.       \x1b[0m\x1b[34mStack:\x1b[0m \x1b[36mPython Flask React PWA\x1b[0m\n' +
    '\x1b[33m    .+ooooooooooooooooo/.        \x1b[0m\n' +
    '\x1b[33m      .:+ooooooooooo+/-          \x1b[0m\x1b[35mMade with love by t91a60\x1b[0m\n' +
    '\x1b[33m          .-/+ooo+/--.            \x1b[0m',

  open: (args) => {
    const name = (args || '').toLowerCase().trim()
    const projectMap = {
      'osp-logbook': '\x1b[1;33mOSP Logbook\x1b[0m\n\x1b[34mStack:\x1b[0m Flask, PostgreSQL, Docker, PWA, Python\n\x1b[34mAbout:\x1b[0m Modern web application for tracking departures, refueling, and maintenance for OSP fire brigade units.\n\x1b[34mLink:\x1b[0m \x1b[36mhttps://github.com/t91a60/osp-logbook\x1b[0m',
      'alkorater': '\x1b[1;33mAlkoRater\x1b[0m\n\x1b[34mStack:\x1b[0m PWA, JavaScript, iOS, Service Worker, CSS\n\x1b[34mAbout:\x1b[0m Premium iOS PWA for rating and cataloging alcohols.\n\x1b[34mLink:\x1b[0m \x1b[36mhttps://github.com/t91a60/alko-rater\x1b[0m',
      'gather': '\x1b[1;33mGather\x1b[0m\n\x1b[34mStack:\x1b[0m FastAPI, PostgreSQL, Redis, Docker, Python, JWT\n\x1b[34mAbout:\x1b[0m Event/Social REST API with layered architecture.\n\x1b[34mLink:\x1b[0m \x1b[36mhttps://github.com/t91a60/Gather\x1b[0m',
      'upm-ultras': '\x1b[1;33mUPM Ultras\x1b[0m\n\x1b[34mStack:\x1b[0m HTML, CSS, JavaScript, Static Site\n\x1b[34mAbout:\x1b[0m Official website of Ultras Polonia Mi\u0119dzyrzecze.\n\x1b[34mLink:\x1b[0m \x1b[36mhttps://github.com/t91a60/upm-ultras\x1b[0m',
    }
    if (name && projectMap[name]) return projectMap[name]
    if (name) return `\x1b[91mProject not found\x1b[0m: ${name}. Try \x1b[33mprojects\x1b[0m to list all.`
    return '\x1b[33mUsage:\x1b[0m open <project-name>. Try \x1b[33mprojects\x1b[0m to list all.'
  },
}

export const bootLines = [
  { text: 'EFI boot: starting Ubuntu 24.04 LTS', color: '--color-text-dim', delay: 150 },
  { text: 'kernel: Linux 6.8.0-generic #1 SMP PREEMPT_DYNAMIC', color: '--color-accent-purple', delay: 250 },
  { text: 'kernel: CPU: AMD Ryzen 7 - 8 cores / 16 threads', color: '--color-accent-purple', delay: 200 },
  { text: 'init: Starting GNOME Display Manager (pid 42)', color: '--color-success', delay: 300 },
  { text: 'systemd: Started User Manager for UID 1000', color: '--color-text-dim', delay: 200 },
  { text: 'gdm-pam: pam_unix(gdm-password:session) - session opened', color: '--color-accent-purple', delay: 250 },
  { text: '\x1b[32m\u2713\x1b[0m Welcome to Ubuntu 24.04 LTS - \x1b[33mnikodem@dev-desktop\x1b[0m', color: '--color-text', delay: 400 },
]
