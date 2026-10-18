import ExpOnject from "./experience.ts";
import ProjectsArray from './projects.ts';
import { urlShowcase } from './project-showcases';

const es =  {
  layouts: {
    home: {
      title: `Epilef Rodriguez | Ingeniero Full-Stack Senior`,
      description: `Ingeniero Full-Stack Senior en España, especializado en React, TypeScript, Node.js y aplicaciones web escalables para equipos internacionales.`,
    },
    blog: {
      title: `BlogTime 🤓`,
      description: `Blog personal de Epilef Rodriguez. Aquí puedes encontrar artículos sobre tecnología, programación y otros temas interesantes.`,
    },
    github: {
      title: `GitHub Search 🤓`,
      description: `Búsqueda personal de GitHub de Epilef Rodriguez. Aquí puedes encontrar commits recientes con palabras divertidas.`,
    },
    url: {
      title: `URL Shortener 🤓`,
      description: `Acortador de URL personal de Epilef Rodriguez. Aquí puedes acortar tus URLs.`,
    },
  },
  nav: {
    home: {
      title: 'Inicio',
      label: 'home',
    },
    writing: {
      title: 'Artículos',
      label: 'writing',
    },
    lab: {
      title: 'Lab',
      label: 'lab',
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
    writing: {
      title: 'Artículos técnicos',
      subtitle: 'Reflexiones, tutoriales y lecciones aprendidas sobre ingeniería de software, IA y el camino del desarrollador.',
      viewAll: 'Ver todos los artículos',
      readArticle: 'Leer artículo',
      readingTime: 'min de lectura',
      empty: 'Pronto habrá nuevos artículos.',
    },
    lab: {
      title: 'Developer Lab / Código abierto',
      label: 'Experimentos, prototipos y aventuras de ingeniería que vale la pena compartir.',
      liveSite: 'Ver sitio',
      opensInNewTab: 'se abre en una pestaña nueva',
      carouselLabel: 'Proyectos del Lab',
      carouselRole: 'carrusel',
      previous: 'Proyectos anteriores',
      next: 'Proyectos siguientes',
      range: 'Mostrando {first}–{last} de {total}',
      carouselHelp: 'Desliza para explorar. Usa los botones anterior y siguiente o las flechas izquierda y derecha; los botones vuelven al otro extremo al llegar al final.',
      openTool: 'Abrir herramienta',
      showcase: {
        view: 'Ver proyecto', close: 'Cerrar detalles del proyecto',
        overview: 'Descripción', purpose: 'Propósito', highlights: 'Detalles de implementación',
        tech: 'Tecnologías', images: 'Capturas', links: 'Enlaces del proyecto',
        statuses: { public: 'Aplicación pública', private: 'Aplicación privada', experimental: 'Experimental', archived: 'Archivado' },
      },
      github: {
        status: 'Experimento API',
        title: 'GitHub API Demo',
        imgAlt: 'Demo de la API de GitHub con controles de búsqueda de commits',
        description: 'Busca commits recientes de GitHub y explora una isla React conectada a su API.',
        linkLabel: 'Abrir experimento',
      },
      url: {
        status: 'Herramienta full-stack',
        title: 'Acortador de URL',
        imgAlt: 'Acortador de URL con entrada de enlaces y tabla de enlaces guardados',
        description: 'Gestiona enlaces como propietario. Los enlaces compartidos siguen siendo públicos.',
        linkLabel: 'Explorar proyecto',
        showcase: urlShowcase,
      },
      svgToComponent: {
        status: 'Utilidad dev',
        title: 'SVG a Componente',
        imgAlt: 'SVG a Componente con entrada de SVG y código de componente generado',
        description: 'Convierte SVGs en componentes React, Vue, Angular o Svelte en pocos pasos.',
        linkLabel: 'Convertir un SVG',
      },
      invoice: {
        title: 'Editor de facturas',
        imgAlt: 'Ilustración de un editor de facturas junto a una vista previa A4 con conceptos de ejemplo',
        status: 'Herramienta full-stack',
        description: 'Un editor de facturas bilingüe con vista previa A4, impresión y PDF desde el navegador, acceso con Google y facturas por cuenta en Postgres.',
        linkLabel: 'Ver repositorio',
      },
      ovitals: {
        title: 'oVitals',
        imgAlt: 'Ilustración de sensores Linux conectados a un gráfico de carga de CPU',
        status: 'Herramienta Linux',
        description: 'Un monitor GTK 4 para Omarchy que lee sensores de Linux directamente y adopta la paleta activa del escritorio.',
        linkLabel: 'Ver repositorio',
      },
      wallapibara: {
        title: 'Wallapibara',
        imgAlt: 'Ilustración de un patrón de fondo con formas equilibradas',
        status: 'UI generativa',
        description: 'Un generador de fondos venezolanos con distribución por semilla, equilibrio visual, colocación en mosaicos y exportación desde el navegador.',
        linkLabel: 'Ver repositorio',
      },
      pngToSvg: {
        title: 'PNG to SVG',
        imgAlt: 'Diagrama de píxeles PNG dentro de un contenedor SVG',
        status: 'Utilidad dev',
        description: 'Una CLI en Python para envolver PNGs en contenedores SVG y optimizarlos para flujos de assets web.',
        linkLabel: 'Ver repositorio',
      },
      localImageStudio: {
        title: 'Local Image Studio',
        imgAlt: 'Diagrama de controles locales conectados a ComfyUI y al historial SQLite',
        status: 'IA local',
        description: 'Un workspace local sobre ComfyUI con descubrimiento de modelos, adaptadores de workflows, controles de generación e historial en SQLite.',
        linkLabel: 'Ver repositorio',
      },
    },
    exp: {
      title: 'Experiencia profesional',
      label: 'experiencia',
      linkLabel: 'Web de la empresa',
      current: 'Mi trabajo actual abarca ingeniería full-stack para equipos internacionales: React, TypeScript, Node.js, integraciones de APIs, aplicaciones en producción y flujos de desarrollo asistidos por IA.',
      history: 'Trayectoria seleccionada',
    },
    projects: {
      title: 'Proyectos de ingeniería destacados',
      label: 'projects',
      intro: 'Contribuciones a productos en producción: interfaces de comercio y sistemas backend de datos.',
      problem: 'Problema', contribution: 'Mi contribución', impact: 'Resultado',
      projectLink: 'Web de la empresa', codeLink: 'Código fuente',
      technology: 'Tecnologías',
      archiveImage: 'Captura histórica del proyecto',
      projectsList: ProjectsArray,
    },
    expertise: {
      title: 'Especialidades técnicas',
      groups: [
        { title: 'Arquitectura frontend', detail: 'React, TypeScript, Next.js, Astro y componentes de interfaz reutilizables.' },
        { title: 'Backend y APIs', detail: 'Node.js, Express, integraciones de APIs, OAuth y recopilación asíncrona de datos.' },
        { title: 'Datos e infraestructura', detail: 'PostgreSQL, SQL, MongoDB, Docker y despliegues cloud con Vercel y Cloudflare.' },
        { title: 'Calidad y entrega', detail: 'Jest, Mocha, Vitest, Playwright, desarrollo guiado por pruebas y flujos asistidos por IA.' },
      ],
    },
    contact: { title: 'Construyamos algo útil', label: 'Contacto', skip: 'Saltar al contenido' },
    about: {
      title: 'Acerca de',
      label: 'acerca',
      personalImageAlt: 'Epilef Rodriguez',
      personalDescription: `
      <p>Soy <strong>Epilef Rodriguez</strong>, Ingeniero Full-Stack Senior en España. Trabajo con equipos internacionales y distribuidos.</p>
      <p>Disfruto convirtiendo requisitos complejos en software útil, compartiendo lo que aprendo y tomando un buen café. Hablemos de oportunidades de ingeniería senior, colaboración remota y los productos que construye tu equipo.</p>
      `
    },
  },
  hero: {
    title: 'Ingeniero Full-Stack Senior',
    profileAlt: 'Epilef Rodriguez',
    badge: 'Ingeniero Full-Stack',
    name: 'Epilef Rodriguez',
    technology: 'React · TypeScript · Node.js · Arquitectura de software',
    location: 'En España · Colaborando con equipos internacionales',
    bio: "Construyo aplicaciones web escalables y sistemas de software fiables, combinando una sólida experiencia en frontend con desarrollo backend, liderazgo técnico e ingeniería de producto.",
    contact: 'Contactar',
    work: 'Ver proyectos de ingeniería',
    folio: 'PROYECTOS / INGENIERÍA',
    portraitCaption: 'Ingeniero. Constructor. Siempre curioso.',
    resume: 'Solicitar CV',
    resumeSubject: 'Solicitud de currículum',
    socialLabel: 'Perfiles profesionales',
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
  experience: ExpOnject,
  blog: {
    linkLabel: 'Leer más',
    linkAriaLabel: 'Leer más sobre este artículo',
  },
  github: {
    placeholder: 'ej. queso',
    button: 'Buscar',
    fetchError: 'La búsqueda de GitHub no está disponible. Inténtalo de nuevo.',
    noResults: 'No se encontraron commits.',
    descriptionpt1: 'Busca palabras divertidas en commits recientes de GitHub.',
    descriptionpt2: 'El lenguaje inapropiado es opcional pero divertido.',
    workflowpt1: 'Hecho con ⚛️ React y la arquitectura de islas.',
    workflowpt2: 'El código del backend está disponible en ',
  },
  svgToComponent: {
    title: 'Convertidor de SVG a Componente',
    description: 'Convierte fácilmente tu código SVG en componentes React, Vue, Angular o Svelte.',
    svgInputLabel: 'Pega tu código SVG aquí',
    svgText: {
      placeholder: 'ej. <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/></svg>',
    },
    framework: {
      react: 'React',
      vue: 'Vue',
      angular: 'Angular',
      svelte: 'Svelte',
    },
    button: 'Convertir',
    copy: 'Copiar al portapapeles',
  },
  url: {
    placeholder: 'ej. https://www.epilef.rocks/',
    button: 'Acortar',
    description: 'Administración del propietario. Los enlaces cortos siguen siendo públicos.',
    loadMore: 'Cargar más',
    retry: 'Reintentar',
    loading: 'Cargando...',
    invalid: 'URL inválida',
    alreadyInList: 'Esta URL ya está en la lista',
    fetchError: 'No se pudo completar la operación del enlace. Inténtalo de nuevo.',
    rateLimited: 'Demasiadas solicitudes. Espera antes de intentarlo de nuevo.',
    rateLimitedRetry: 'Demasiadas solicitudes. Inténtalo de nuevo en {seconds} segundos.',
    uncertainWrite: 'No se pudo confirmar la operación. Actualiza la lista antes de intentarlo de nuevo.',
    privacy: 'Los enlaces cortos y sus destinos son públicos. No los uses para compartir URL confidenciales.',
    table: {
      header: {
        number: '#',
        short: 'Corto',
        original: 'Original',
        action: 'Acción',
      },
      noData: 'No hay datos',
      visit: 'Visitar',
      copy: 'Copiar',
      delete: 'Eliminar',
    }
  },
  configs: {
    theme: 'Tema',
    language: 'Idioma',
    light: 'Claro',
    dark: 'Oscuro',
    en: 'Inglés',
    es: 'Español',
  },
};

export default es;
