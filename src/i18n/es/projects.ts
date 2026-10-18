import type { ProjectType } from '../../types';

const projects:ProjectType[] = [
  {
    title: "www.freedomdebtrelief.com",
    description:
      "Freedom Debt Relief es una empresa de liquidación de deudas que ayuda a los clientes a resolver sus deudas a través de la negociación y liquidación de deudas. El sitio web se construyó utilizando Nextjs, TailwindCss, Node.js, Express y jest, y se aloja en Cloudflare.",
    link: "https://www.freedomdebtrelief.com/",
    image: "../assets/img/projects/freedomdebtrelief.png",
    imageAlt: "Freedom Debt Relief",
    tags: ["react",  "nextJs", "nodejs", "express", "Tailwind", "jest", "bitbucket"]
  },
  {
    title: "MercadoShops",
    caseStudy: {
      category: "Comercio / Frontend",
      summary: "Personalización de tiendas e ingeniería del flujo de compra en la plataforma de comercio de MercadoLibre.",
      problem: "Los vendedores necesitaban tiendas personalizables y los flujos de compra requerían interfaces claras y una evaluación cuidadosa.",
      contribution: "Mejoré plantillas de MercadoShops y trabajé en la experiencia de compra, analizando métricas y documentando alternativas desde la implementación hasta el despliegue.",
      impact: "Entregué mejoras en las tiendas y los flujos de compra de la plataforma de comercio electrónico en producción de MercadoLibre.",
    },
    description:
      "MercadoShops es la plataforma de comercio electrónico de MercadoLibre que permite a los vendedores crear sus propias tiendas en línea, ofreciendo herramientas para personalización, procesamiento de pagos, gestión de inventario y marketing.",
    link: "https://www.mercadolibre.com/",
    image: "../assets/img/projects/mercadolibre.png",
    imageAlt: "Panel de MercadoShops con controles de personalización y configuración de tienda",
    tags: ["javascript", "react",  "redux", "nodejs", "express", "sass", "jest", "github"],
  },
  {
    title: "DerfDice",
    description: "DerfDice es una herramienta diseñada para Game Masters, facilitando la generación de elementos aleatorios durante sesiones de narración, mejorando la creatividad y agilizando la experiencia de juego.",
    tags: ["javascript", "nodejs", "express", "vue", "stripe", "heroku", "github"],
    link: "https://derfdice.com",
    image: "../assets/img/projects/derfdice.png",
    imageAlt: "DerfDice",
  },
  {
    title: "DM2, Data-Collector & I-BOARDS",
    caseStudy: {
      category: "Datos / Full-Stack",
      summary: "De APIs de marketing a información útil: recopilación automática de datos y un flujo compartido de informes de KPIs.",
      problem: "Era necesario recopilar datos de campañas de distintos servicios y hacerlos útiles para los informes.",
      contribution: "Lideré el desarrollo de Data-Collector e I-BOARDS: un servidor Node.js/Express de agregación de datos con desarrollo guiado por pruebas, tareas asíncronas, almacenamiento SQL y paneles de KPIs.",
      impact: "Reuní los datos de varios canales de marketing en un flujo de informes compartido, con recopilación automática y seguimiento de KPIs.",
    },
    description: "Una solución que se integra perfectamente con los principales canales de compra de medios como Facebook, Twitter, Instagram y LinkedIn, proporcionando información en tiempo real sobre el rendimiento de las campañas. Con (DM)², acceda a un año de métricas al instante. Capacite a su equipo para optimizar campañas con una funcionalidad, personalización y generación de informes de rendimiento incomparables, todo al alcance de su mano.",
    tags: ["javascript", "nodejs", "express", "jquery", "ganalytics", "gads", "facebook", "linkedin", "twitter", "mocha", "github"],
    link: "https://www.lookatme-ventures.com/",
    image: "../assets/img/projects/lookatme.png",
    imageAlt: "Panel de DM2 con KPIs de campañas, series temporales y desglose por canal",
  },
  {
    title: "Mi Portafolio",
    description: "Este sitio web es una muestra de mi experiencia, habilidades y proyectos. Fue construido usando Astro (por ahora, solía estar en Angular, Vuejs, Vanilla Javascript, React con NextJs), TailwindCSS y TypeScript, y está alojado en Heroku.",
    tags: ["typescript", "astro", "nextjs", "vue", "angular", "tailwindcss", "heroku", "github"],
    image: "../assets/img/projects/portfolio.png",
    imageAlt: "Epilef Rodriguez Portfolio",
    github: "https://github.com/Khanos/khanos.frontend",
  },
  {
    title: "Mi backend-lab",
    description: "Una cole ción de proyectos backend, APIs y microservicios construidos usando Node.js, Express y otras tecnologías. Es un espacio de juego para mí para experimentar con nuevas ideas y tecnologías.",
    tags: ["javascript", "nodejs", "express", "mongodb", "sql", "jest", "heroku", "github"],
    image: "../assets/img/projects/backend.png",
    imageAlt: "Backend Lab",
    link: "https://khanos-backend.herokuapp.com/",
    github: "https://github.com/Khanos/khanos.backend",
  },
];

export default projects;
