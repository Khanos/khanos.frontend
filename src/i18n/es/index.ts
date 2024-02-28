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
    workflowpt1: 'Esta sección fue hecha usando React y consultando un endpoint en mi propio backend.',
    workflowpt2: 'Chequea el código en',
  }
};

export default es;