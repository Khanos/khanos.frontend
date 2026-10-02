import ExpOnject from "./experience.ts";
import ProjectsArray from './projects.ts';

const en =  {
  layouts: {
    home: {
      title: `Khanos && Chill 🤓`,
      description: `Epilef Rodriguez's personal website. Here you can find information about my experience, projects, and contact details.`,
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
      title: 'Latest Writing',
      subtitle: 'Thoughts, tutorials, and lessons learned about software engineering, AI, and the developer journey.',
      viewAll: 'View all posts',
      readArticle: 'Read article',
      readingTime: 'min read',
      empty: 'New articles are on the way.',
    },
    lab: {
      title: 'Lab',
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
        linkLabel: 'Owner login',
      },
      svgToComponent: {
        status: 'Developer utility',
        title: 'SVG to Component',
        imgAlt: 'SVG to Component with markup input and generated component code',
        description: 'Turn SVGs into React, Vue, Angular, or Svelte components in a few steps.',
        linkLabel: 'Convert an SVG',
      },
      invoice: {
        title: 'Khanos Invoice',
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
      title: 'Experience',
      label: 'experience',
      linkLabel: 'know more',
    },
    projects: {
      title: 'Projects',
      label: 'projects',
      projectsList: ProjectsArray,
    },
    about: {
      title: 'About',
      label: 'about',
      personalImageAlt: 'Epilef Rodriguez',
      personalDescription: `
      <p>I work as a <strong>Frontend Engineer</strong> at <strong>MercadoLibre</strong>, focusing on enhancing the user experience during crucial steps of the purchasing flow. Conducting <strong>in-depth metric analysis</strong> and exploring various approaches, I documented findings to optimize form completion rates, overseeing the implementation process from coding to deployment. Additionally, I contributed to refining personalized templates for the <strong>MercadoShops division</strong>.</p>
      <p>As a <strong>Frontend Developer</strong>, I spearheaded the creation of the <strong>DerfDice application</strong>, adhering to UI/UX best practices and prioritizing minimalist design for optimal user experience. Crafting diverse dashboards to creatively showcase data, I utilized cutting-edge technologies such as <strong>React, Vue.js, Angular, Astro, jQuery,</strong> and <strong>KnockOut</strong>.</p>
      <p>Transitioning to backend development, I built the <strong>DataCollector tool</strong>, integrating various security protocols to retrieve valuable insights from digital marketing platforms. Storing data in <strong>SQL databases</strong> and utilizing asynchronous jobs for automation, I adopted a <strong>test-driven development approach</strong>, focusing primarily on <strong>Node.js, Express, Sails.js, SQL,</strong> and <strong>NoSQL</strong>.</p>
      <p>As an <strong>Engineer</strong>, I developed a <strong>Monte Carlo simulation tool</strong> for probabilistic distribution forecasting, leveraging open-source technologies like <strong>Python and R</strong>, along with <strong>QooxDoo</strong>. Despite encountering missing requirements, I showcased my mathematical background by delivering the project efficiently.</p>
      <p>Eager for new challenges and ready to embark on the next chapter of my career journey. ✨</p>
      `
    },
  },
  hero: {
    title: 'Hello, I\'m Epilef Rodriguez',
    profileAlt: 'Epilef Rodriguez',
    badge: 'Software Engineer',
    bio: 'Experienced <strong>Engineer</strong> proficient in diverse modern technologies. Enthusiastic about <strong>technology</strong>, committed to continuous <strong>learning</strong>, and passionate about great <strong>coffee</strong>. Dedicated to sharing knowledge, embracing challenges, and enjoying the journey of growth.',
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
