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
    lab: {
      title: 'Code Stuff',
      label: 'Personal projects and experiments',
      blog: {
        title: 'Blog',
        imgAlt: 'Blog logo',
        description: `
        My personal blog is a space where I share my thoughts, experiences, and knowledge. I write about technology, programming, and other interesting topics. I also share tips and tricks that I've learned along the way. I hope you find it useful!`,
        linkLabel: 'know more',
      },
      github: {
        title: 'GitHub',
        imgAlt: 'GitHub logo',
        description: `
        I demonstrate a smooth workflow between frontend and backend. The backend interacts with GitHub's API, fetching commits that are displayed as cards on the frontend. Leveraging the Island architecture and powered by #ReactJs, this site is built with the Astro framework, enabling seamless integration and flexibility with various frontend technologies.`,
        linkLabel: 'know more',
      },
      url: {
        title: 'URL Shortener',
        imgAlt: 'URL Shortener logo',
        description: `
        My personal URL shortener is a space where you can shorten your URLs and share them with your friends. It's a simple tool that I built to practice my skills and have some fun. I hope you enjoy it!`,
        linkLabel: 'know more',
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
    bio: '<strong>Full-Stack Engineer</strong> with a robust command of diverse cutting-edge technologies and tools. Passionate about technology, hungry for knowledge, and a devoted aficionado of great coffee. My focus lies in <strong>sharing knowledge</strong>, <strong>continual growth</strong>, and embracing <strong>challenges</strong> while relishing the journey.',
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
    descriptionpt1: 'Search for fun words in recent GitHub commits.',
    descriptionpt2: 'Inappropriate language is optional but fun.',
    workflowpt1: 'Made using ⚛️ React and the island architecture.',
    workflowpt2: 'Backend code is available on ',
  },
  url: {
    placeholder: 'e.g. https://www.epilef.rocks/',
    button: 'Shorten',
    description: 'Shorten your URLs and share them with your friends.',
    loading: 'Loading...',
    invalid: 'Invalid URL',
    alreadyInList: 'This URL is already in the list',
    fetchError: 'Error fetching URL list',
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