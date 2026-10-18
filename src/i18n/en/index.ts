import ExpOnject from "./experience.ts";
import ProjectsArray from './projects.ts';
import { urlShowcase } from './project-showcases';

const en =  {
  layouts: {
    home: {
      title: `Epilef Rodriguez | Senior Full-Stack Engineer`,
      description: `Senior Full-Stack Engineer based in Spain, specializing in React, TypeScript, Node.js, and scalable web applications for international teams.`,
    },
    blog: {
      title: `BlogTime 🤓`,
      description: `Epilef Rodriguez's personal blog. Here you can find articles about technology, programming, and other interesting topics.`,
    },
    github: {
      title: `GitHub Search 🤓`,
      description: `Epilef Rodriguez's personal GitHub search. Here you can find recent commits with fun words.`,
    },
    url: {
      title: `URL Shortener 🤓`,
      description: `Epilef Rodriguez's personal URL shortener. Here you can shorten your URLs.`,
    },
  },
  nav: {
    home: {
      title: 'Home',
      label: 'home',
    },
    writing: {
      title: 'Writing',
      label: 'writing',
    },
    lab: {
      title: 'Lab',
      label: 'lab',
    },
    exp: {
      title: 'Experience',
      label: 'experience',
    },
    projects: {
      title: 'Projects',
      label: 'projects',
    },
    about: {
      title: 'About',
      label: 'about',
    },
  },
  sections: {
    writing: {
      title: 'Technical Writing',
      subtitle: 'Thoughts, tutorials, and lessons learned about software engineering, AI, and the developer journey.',
      viewAll: 'View all posts',
      readArticle: 'Read article',
      readingTime: 'min read',
      empty: 'New articles are on the way.',
    },
    lab: {
      title: 'Developer Lab / Open Source',
      label: 'Experiments, prototypes, and engineering rabbit holes worth sharing.',
      liveSite: 'Live site',
      opensInNewTab: 'opens in a new tab',
      carouselLabel: 'Lab projects',
      carouselRole: 'carousel',
      previous: 'Previous projects',
      next: 'Next projects',
      range: 'Showing {first}–{last} of {total}',
      carouselHelp: 'Swipe or scroll to explore. Use the previous and next buttons or the left and right arrow keys; the buttons wrap back around at either end.',
      openTool: 'Open tool',
      showcase: {
        view: 'View project', close: 'Close project details',
        overview: 'Overview', purpose: 'Purpose', highlights: 'Implementation highlights',
        tech: 'Built with', images: 'Screenshots', links: 'Project links',
        statuses: { public: 'Public app', private: 'Private app', experimental: 'Experimental', archived: 'Archived' },
      },
      github: {
        status: 'API experiment',
        title: 'GitHub API Demo',
        imgAlt: 'GitHub API demo with commit search controls',
        description: 'Search recent GitHub commits and explore a React island backed by the GitHub API.',
        linkLabel: 'Open experiment',
      },
      url: {
        status: 'Full-stack tool',
        title: 'URL Shortener',
        imgAlt: 'URL Shortener with URL input and saved links',
        description: 'Manage short links as the owner. Shared short links remain public.',
        linkLabel: 'Explore project',
        showcase: urlShowcase,
      },
      svgToComponent: {
        status: 'Developer utility',
        title: 'SVG to Component',
        imgAlt: 'SVG to Component with markup input and generated component code',
        description: 'Turn SVGs into React, Vue, Angular, or Svelte components in a few steps.',
        linkLabel: 'Convert an SVG',
      },
      invoice: {
        title: 'Invoice Editor',
        imgAlt: 'Illustration of an invoice editor beside an A4 preview with sample line items',
        status: 'Full-stack tool',
        description: 'A bilingual invoice editor with live A4 preview, browser print/PDF export, Google sign-in, and account-scoped invoices in Postgres.',
        linkLabel: 'View repository',
      },
      ovitals: {
        title: 'oVitals',
        imgAlt: 'Illustrated Linux sensor signal feeding a CPU load chart',
        status: 'Native Linux tool',
        description: 'A GTK 4 hardware monitor for Omarchy that reads Linux sensors directly and follows the active desktop palette.',
        linkLabel: 'View repository',
      },
      wallapibara: {
        title: 'Wallapibara',
        imgAlt: 'Illustrated repeating wallpaper layout with balanced shapes',
        status: 'Generative UI',
        description: 'A Venezuelan-themed wallpaper generator with seeded layouts, visual balancing, tile-aware placement, and browser export.',
        linkLabel: 'View repository',
      },
      pngToSvg: {
        title: 'PNG to SVG',
        imgAlt: 'Diagram of PNG pixels embedded inside an SVG wrapper',
        status: 'Developer utility',
        description: 'A focused Python CLI for wrapping PNG assets in SVG containers and optimizing those wrappers for web pipelines.',
        linkLabel: 'View repository',
      },
      localImageStudio: {
        title: 'Local Image Studio',
        imgAlt: 'Diagram connecting local generation controls, ComfyUI, and SQLite history',
        status: 'Local AI',
        description: 'A local-first image workspace on top of ComfyUI with model discovery, workflow adapters, generation controls, and SQLite history.',
        linkLabel: 'View repository',
      },
    },
    exp: {
      title: 'Professional Experience',
      label: 'experience',
      linkLabel: 'Company website',
      current: 'My work today spans full-stack engineering for international teams: React, TypeScript, Node.js, API integrations, production applications, and AI-assisted developer workflows.',
      history: 'Selected roles',
    },
    projects: {
      title: 'Featured Engineering Work',
      label: 'projects',
      intro: 'Selected contributions to production products, from commerce interfaces to backend data pipelines.',
      problem: 'Problem', contribution: 'My contribution', impact: 'Impact',
      projectLink: 'Company website', codeLink: 'Source code',
      technology: 'Technologies',
      archiveImage: 'Historical project screenshot',
      projectsList: ProjectsArray,
    },
    expertise: {
      title: 'Technical Expertise',
      groups: [
        { title: 'Frontend architecture', detail: 'React, TypeScript, Next.js, Astro, and reusable UI components.' },
        { title: 'Backend & APIs', detail: 'Node.js, Express, API integrations, OAuth, and asynchronous data collection.' },
        { title: 'Data & infrastructure', detail: 'PostgreSQL, SQL, MongoDB, Docker, and cloud deployments with Vercel and Cloudflare.' },
        { title: 'Quality & delivery', detail: 'Jest, Mocha, Vitest, Playwright, test-driven development, and AI-assisted workflows.' },
      ],
    },
    contact: { title: 'Let’s build something useful', label: 'Contact', skip: 'Skip to content' },
    about: {
      title: 'About',
      label: 'about',
      personalImageAlt: 'Epilef Rodriguez',
      personalDescription: `
      <p>I’m <strong>Epilef Rodriguez</strong>, a Senior Full-Stack Engineer based in Spain, working with international and distributed teams.</p>
      <p>I enjoy turning complex requirements into useful software, sharing what I learn, and a good cup of coffee. Let’s talk about senior engineering roles, remote collaboration, and the products your team is building.</p>
      `
    },
  },
  hero: {
    title: 'Senior Full-Stack Engineer',
    profileAlt: 'Epilef Rodriguez',
    badge: 'Software Engineer',
    name: 'Epilef Rodriguez',
    technology: 'React · TypeScript · Node.js · Software Architecture',
    location: 'Based in Spain · Working with international teams',
    bio: "I build scalable web applications and reliable software systems, combining deep frontend expertise with backend development, technical leadership, and real-world product engineering.",
    contact: 'Contact Me',
    work: 'Explore engineering work',
    folio: 'SELECTED WORK / ENGINEERING',
    portraitCaption: 'Engineer. Builder. Curious by default.',
    resume: 'Request résumé',
    resumeSubject: 'Résumé request',
    socialLabel: 'Professional profiles',
    pills: {
      mail: 'Email',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      hackerank: 'HackerRank',
      instagram: 'Instagram',
    }
  },
  footer: {
    copy: 'Almost All rights reserved.',
    about: 'About',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
    mail: 'epilef.rodriguez@gmail.com',
  },
  experience: ExpOnject,
  blog: {
    linkLabel: 'Read more',
    linkAriaLabel: 'Read more about this article',
  },
  github: {
    placeholder: 'e.g. cheese',
    button: 'Search',
    fetchError: 'GitHub search is unavailable. Please try again.',
    noResults: 'No commits found.',
    descriptionpt1: 'Search for fun words in recent GitHub commits.',
    descriptionpt2: 'Inappropriate language is optional but fun.',
    workflowpt1: 'Made using ⚛️ React and the island architecture.',
    workflowpt2: 'Backend code is available on ',
  },
  svgToComponent: {
    title: 'SVG to Component Converter',
    description: 'Easily convert your SVG code into your SVGs to React/Vue/Angular/Svelte components.',
    svgInputLabel: 'Paste your SVG code here',
    svgText: {
      placeholder: 'e.g. <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/></svg>',
    },
    framework: {
      react: 'React',
      vue: 'Vue',
      angular: 'Angular',
      svelte: 'Svelte',
    },
    button: 'Convert',
    copy: 'Copy to clipboard',
  },
  url: {
    placeholder: 'e.g. https://www.epilef.rocks/',
    button: 'Shorten',
    description: 'Owner administration. Short links remain public.',
    loadMore: 'Load more',
    retry: 'Retry',
    loading: 'Loading...',
    invalid: 'Invalid URL',
    alreadyInList: 'This URL is already in the list',
    fetchError: 'Could not complete the URL operation. Please try again.',
    rateLimited: 'Too many requests. Please wait before trying again.',
    rateLimitedRetry: 'Too many requests. Try again in {seconds} seconds.',
    uncertainWrite: 'The operation could not be confirmed. Refresh the list before trying again.',
    privacy: 'Short links and their destinations are public. Do not use them to share confidential URLs.',
    table: {
      header: {
        number: '#',
        short: 'Short',
        original: 'Original',
        action: 'Action',
      },
      noData: 'No data',
      visit: 'Visit',
      copy: 'Copy',
      delete: 'Delete',
    }
  },
  configs: {
    theme: 'Theme',
    language: 'Language',
    light: 'Light',
    dark: 'Dark',
    en: 'English',
    es: 'Spanish',
  }
};

export default en;
