import { projects } from '../data/projects.js'

const BASE = 'https://t91a60.github.io/NikodemBoryczka'

const techKeywords = [
  'Python', 'Flask', 'FastAPI', 'React', 'PostgreSQL', 'Docker',
  'Redis', 'JavaScript', 'TypeScript', 'PWA', 'Linux', 'Git',
]

function profilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${BASE}/#profile`,
    url: BASE,
    name: 'Nikodem Boryczka — AI Developer & Software Engineer',
    description: 'Interactive Ubuntu desktop-inspired portfolio of Nikodem Boryczka, an AI Developer and Software Engineer from Silesia, Poland.',
    about: {
      '@id': `${BASE}/#person`,
    },
    mainEntity: {
      '@id': `${BASE}/#person`,
    },
    hasPart: [
      {
        '@type': 'WebPageElement',
        name: 'Terminal',
        description: 'Interactive terminal emulator with 20+ commands simulating Ubuntu desktop environment',
        url: `${BASE}/#terminal`,
      },
      {
        '@type': 'WebPageElement',
        name: 'Projects',
        description: 'Open-source portfolio projects including OSP Logbook, AlkoRater, Gather, and UPM Ultras',
        url: `${BASE}/#projects`,
      },
      {
        '@type': 'WebPageElement',
        name: 'About',
        description: 'Biography, skills, tech stack, and contact information for Nikodem Boryczka',
        url: `${BASE}/#about`,
      },
      {
        '@type': 'WebPageElement',
        name: 'Skills',
        description: `Technical skills: ${techKeywords.join(', ')}`,
        url: `${BASE}/#skills`,
      },
    ],
  }
}

function speakableSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE}/#speakable`,
    url: BASE,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.about-description', '.terminal-output', '.project-highlights'],
    },
  }
}

function softwareSourceCodeSchemas() {
  return projects.map(p => ({
    '@context': 'https://schema.org',
    '@type': ['SoftwareSourceCode', 'CreativeWork'],
    '@id': `${p.link}#code`,
    name: p.title,
    description: p.description,
    url: p.link,
    codeRepository: p.link,
    programmingLanguage: p.tech.filter(t => ['Python', 'JavaScript', 'TypeScript', 'HTML', 'CSS'].includes(t)),
    runtimePlatform: p.tech.filter(t => ['Docker', 'PWA', 'iOS'].includes(t)),
    operatingSystem: 'Linux, macOS, Windows',
    applicationCategory: p.id === 'gather' ? 'API' : 'WebApplication',
    author: {
      '@type': 'Person',
      '@id': `${BASE}/#person`,
      name: 'Nikodem Boryczka',
    },
    keywords: p.tech.join(', '),
    isBasedOn: {
      '@type': 'CreativeWork',
      url: p.link,
      description: `GitHub repository: ${p.link}`,
    },
    citation: [
      {
        '@type': 'CreativeWork',
        url: p.link,
        name: `${p.title} — GitHub Repository`,
      },
    ],
  }))
}

export function generateSupplementaryJsonLd() {
  return [
    profilePageSchema(),
    speakableSchema(),
    ...softwareSourceCodeSchemas(),
  ]
}
