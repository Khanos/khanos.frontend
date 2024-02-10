export type ProjectType = {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
}

export const projectsEng:ProjectType[] = [
  {
    title: "MercadoShops",
    description:
      "MercadoShops is MercadoLibre's e-commerce platform that empowers sellers to create their own online stores, offering tools for customization, payment processing, inventory management, and marketing.",
    link: "https://www.mercadolibre.com/",
    image: "../assets/img/projects/mercadolibre.png",
    imageAlt: "MercadoLibre",
    tags: ["javascript", "react",  "redux", "nodejs", "express", "sass", "jest", "github"],
  },
  {
    title: "DerfDice",
    description: "DerfDice is a tool designed for Game Masters, facilitating the generation of random items during storytelling sessions, enhancing creativity and streamlining the gaming experience.",
    tags: ["javascript", "nodejs", "express", "vue", "stripe", "heroku", "github"],
    link: "https://derfdice.com",
    image: "../assets/img/projects/derfdice.png",
    imageAlt: "DerfDice",
  },
  {
    title: "DM2, Data-Collector & I-BOARDS",
    description: "A solution that integrates seamlessly with major media buy channels like Facebook, Twitter, Instagram, and LinkedIn, providing real-time campaign performance insights. With (DM)², access a year's worth of metrics instantly. Empower your team to optimize campaigns with unparalleled functionality, customization, and performance reporting, all at their fingertips.",
    tags: ["javascript", "nodejs", "express", "jquery", "ganalytics", "gads", "facebook", "linkedin", "twitter", "mocha", "github"],
    link: "https://www.lookatme-ventures.com/",
    image: "../assets/img/projects/lookatme.png",
    imageAlt: "Look At Me Ventures",
  },
  {
    title: "My Portfolio",
    description: "This website is a showcase of my experience, skills, and projects. It was built using Astro (for now, it used to be in Angular, Vuejs, Vanilla Javascript, React with NextJs), TailwindCSS, and TypeScript, and is hosted on Heroku.",
    tags: ["typescript", "astro", "nextjs", "vue", "angular", "tailwindcss", "heroku", "github"],
    image: "../assets/img/projects/portfolio.png",
    imageAlt: "Epilef Rodriguez Portfolio",
    github: "https://github.com/Khanos/khanos.frontend",
  },
  {
    title: "My backend-lab",
    description: "A collection of backend projects, APIs, and microservices built using Node.js, Express, and other technologies. It's a playground for me to experiment with new ideas and technologies.",
    tags: ["javascript", "nodejs", "express", "mongodb", "sql", "jest", "heroku", "github"],
    image: "../assets/img/projects/backend.png",
    imageAlt: "Backend Lab",
    link: "https://khanos-backend.herokuapp.com/",
    github: "https://github.com/Khanos/khanos.backend",
  },
];

export const projectsEsp:ProjectType[] = [
  {
    title: "MercadoShops",
    description:
      "MercadoShops es la plataforma de comercio electrónico de MercadoLibre que permite a los vendedores crear sus propias tiendas en línea, ofreciendo herramientas para personalización, procesamiento de pagos, gestión de inventario y marketing.",
    link: "https://www.mercadolibre.com/",
    image: "../assets/img/projects/mercadolibre.png",
    imageAlt: "MercadoLibre",
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
    description: "Una solución que se integra perfectamente con los principales canales de compra de medios como Facebook, Twitter, Instagram y LinkedIn, proporcionando información en tiempo real sobre el rendimiento de las campañas. Con (DM)², acceda a un año de métricas al instante. Capacite a su equipo para optimizar campañas con una funcionalidad, personalización y generación de informes de rendimiento incomparables, todo al alcance de su mano.",
    tags: ["javascript", "nodejs", "express", "jquery", "ganalytics", "gads", "facebook", "linkedin", "twitter", "mocha", "github"],
    link: "https://www.lookatme-ventures.com/",
    image: "../assets/img/projects/lookatme.png",
    imageAlt: "Look At Me Ventures",
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