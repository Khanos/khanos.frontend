import { expEng, expEsp } from '../data/experience'
import { projectsEng, projectsEsp } from '../data/projects';

export const languages = {
  en: 'English',
  es: 'Español',
};

export let defaultLang: "en" | "es" = 'en';

export function setDefaultLang(lang: "en" | "es") {
  defaultLang = lang;
};

export const ui = {
  en: {
    layouts: {
      home: {
        title: `Khanos && Chill 🤓`,
        description: `Epilef Rodriguez's personal website. Here you can find information about my experience, projects, and contact details.`,
      },
      blog: {
        title: `BlogTime 🤓`,
        description: `Epilef Rodriguez's personal blog. Here you can find articles about technology, programming, and other interesting topics.`,
      },
    },
    nav: {
      home: {
        title: 'Home',
        label: 'home',
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
        title: 'Laboratory',
        label: 'Personal Lab',
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
        }
      },
      exp: {
        title: 'Experience',
        label: 'experience',
        linkLabel: 'know more',
      },
      projects: {
        title: 'Projects',
        label: 'projects',
        projectsList: projectsEng,
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
    experience: expEng,
  },
  es: {
    layouts: {
      home: {
        title: `Khanos && Chill 🤓`,
        description: `Sitio web personal de Epilef Rodriguez. Aquí puedes encontrar información sobre mi experiencia, proyectos y detalles de contacto.`,
      },
      blog: {
        title: `BlogTime 🤓`,
        description: `Blog personal de Epilef Rodriguez. Aquí puedes encontrar artículos sobre tecnología, programación y otros temas interesantes.`,
      },
    },
    nav: {
      home: {
        title: 'Inicio',
        label: 'home',
      },
      exp: {
        title: 'Experiencia',
        label: 'experience',
      },
      projects: {
        title: 'Proyectos',
        label: 'projects',
      },
      about: {
        title: 'Acerca de',
        label: 'about',
      },
      contact: {
        title: 'Contacto',
        label: 'contact',
      },
    },
    sections: {
      lab: {
        title: 'Laboratorio',
        label: 'Laboratorio Personal',
        blog: {
          title: 'Blog',
          imgAlt: 'Logo del blog',
          description: `
          Mi blog personal es un espacio donde comparto mis pensamientos, experiencias y conocimientos. Escribo sobre tecnología, programación y otros temas interesantes. También comparto consejos y trucos que he aprendido en el camino. ¡Espero que te resulte útil!`,
          linkLabel: 'saber más',
        },
        github: {
          title: 'GitHub',
          imgAlt: 'Logo de GitHub',
          description: `
          Demuestro un flujo de trabajo entre frontend y backend. El backend interactúa con la API de GitHub, buscando commits que luego se muestran como tarjetas en el frontend. Aprovechando la arquitectura Island y potenciado por #ReactJs (este sitio está construido con #Astro) permitiendo una integración perfecta y flexibilidad con varias tecnologías frontend.`,
          linkLabel: 'saber más',
        }
      },
      exp: {
        title: 'Experiencia',
        label: 'experiencia',
        linkLabel: 'saber más',
      },
      projects: {
        title: 'Proyectos',
        label: 'proyectos',
        projectsList: projectsEsp,
      },
      about: {
        title: 'Acerca de',
        label: 'acerca',
        personalImageAlt: 'Epilef Rodriguez',
        personalDescription: `
        <p>Trabajo como <strong>Ingeniero Frontend</strong> en <strong>MercadoLibre</strong>, enfocado en mejorar la experiencia del usuario durante pasos cruciales del flujo de compra. Realizo un <strong>análisis exhaustivo de métricas</strong> y exploro diversas estrategias, documentando hallazgos para optimizar las tasas de completación de formularios, supervisando el proceso de implementación desde la codificación hasta el despliegue. Además, contribuí a refinar plantillas personalizadas para la <strong>división MercadoShops</strong>.</p>
        <p>Como <strong>Desarrollador Frontend</strong>, lideré la creación de la aplicación <strong>DerfDice</strong>, siguiendo las mejores prácticas de UI/UX y priorizando un diseño minimalista para una óptima experiencia de usuario. Elaboré diversos paneles de control para mostrar creativamente datos, utilizando tecnologías de vanguardia como <strong>React, Vue.js, Angular, Astro, jQuery</strong> y <strong>KnockOut</strong>.</p>
        <p>Transicionando al desarrollo backend, construí la <strong>herramienta DataCollector</strong>, integrando varios protocolos de seguridad para obtener valiosos insights de plataformas de marketing digital. Almacenando datos en <strong>bases de datos SQL</strong> y utilizando trabajos asíncronos para la automatización, adopté un enfoque de <strong>desarrollo dirigido por pruebas</strong>, centrándome principalmente en <strong>Node.js, Express, Sails.js, SQL</strong> y <strong>NoSQL</strong>.</p>
        <p>Como <strong>Ingeniero</strong>, desarrollé una <strong>herramienta de simulación de Monte Carlo</strong> para pronósticos de distribución probabilística, aprovechando tecnologías de código abierto como <strong>Python y R</strong>, junto con <strong>QooxDoo</strong>. A pesar de encontrar requisitos faltantes, demostré mi formación matemática entregando el proyecto de manera eficiente.</p>
        <p>¡Listo para emprender el próximo capítulo de mi trayectoria profesional! ✨</p>
        `
      },
    },
    hero: {
      title: 'Hola, soy Epilef Rodriguez',
      profileAlt: 'Epilef Rodriguez',
      badge: 'Ingeniero Full-Stack',
      bio: '<strong>Ingeniero Full-Stack</strong> con un sólido dominio de diversas tecnologías y herramientas de vanguardia. Apasionado por la tecnología, hambriento de conocimiento y un devoto aficionado del buen café. Mi enfoque radica en <strong>compartir conocimientos</strong>, <strong>crecimiento continuo</strong> y abrazar <strong>desafíos</strong> mientras disfruto del viaje.',
      pills: {
        mail: 'Correo',
        linkedin: 'LinkedIn',
        github: 'GitHub',
        hackerank: 'HackerRank',
        instagram: 'Instagram',
      }
    },
    footer: {
      copy: 'Casi Todos los derechos reservados.',
      about: 'Acerca de',
      privacy: 'Privacidad',
      terms: 'Términos',
      contact: 'Contacto',
      mail: 'epilef.rodriguez@gmail.com',
    },
    experience: expEsp,
  },
} as const;