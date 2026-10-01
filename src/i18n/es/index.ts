import ExpOnject from "./experience.ts";
import ProjectsArray from './projects.ts';

const es =  {
  layouts: {
    home: {
      title: `Khanos && Chill 🤓`,
      description: `Sitio web personal de Epilef Rodriguez. Aquí puedes encontrar información sobre mi experiencia, proyectos y detalles de contacto.`,
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
      title: 'Últimos artículos',
      subtitle: 'Reflexiones, tutoriales y lecciones aprendidas sobre ingeniería de software, IA y el camino del desarrollador.',
      viewAll: 'Ver todos los artículos',
      readArticle: 'Leer artículo',
      readingTime: 'min de lectura',
      empty: 'Pronto habrá nuevos artículos.',
    },
    lab: {
      title: 'Lab',
      label: 'Experimentos, prototipos y aventuras de ingeniería que vale la pena compartir.',
      opensInNewTab: 'se abre en una pestaña nueva',
      carouselLabel: 'Proyectos del Lab',
      carouselRole: 'carrusel',
      previous: 'Proyectos anteriores',
      next: 'Proyectos siguientes',
      range: 'Mostrando {first}–{last} de {total}',
      carouselHelp: 'Desliza para explorar. Usa los botones anterior y siguiente o las flechas izquierda y derecha; los botones vuelven al otro extremo al llegar al final.',
      openTool: 'Abrir herramienta',
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
        description: 'Un pequeño laboratorio full-stack para acortar, guardar y compartir enlaces.',
        linkLabel: 'Acortar un enlace',
      },
      svgToComponent: {
        status: 'Utilidad dev',
        title: 'SVG a Componente',
        imgAlt: 'SVG a Componente con entrada de SVG y código de componente generado',
        description: 'Convierte SVGs en componentes React, Vue, Angular o Svelte en pocos pasos.',
        linkLabel: 'Convertir un SVG',
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
      title: 'Experiencia',
      label: 'experiencia',
      linkLabel: 'saber más',
    },
    projects: {
      title: 'Proyectos',
      label: 'proyectos',
      projectsList: ProjectsArray,
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
    bio: '<strong>Ingeniero</strong> experimentado en diversas tecnologías modernas. Entusiasta de la <strong>tecnología</strong>, comprometido con el <strong>aprendizaje</strong> continuo y apasionado por un excelente <strong>café</strong>. Dedicado a compartir conocimientos, enfrentar desafíos y disfrutar del viaje del crecimiento.',
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
    description: 'Acorta tus URLs con un click.',
    loading: 'Cargando...',
    invalid: 'URL inválida',
    alreadyInList: 'Esta URL ya está en la lista',
    fetchError: 'Error al obtener la lista de URL',
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