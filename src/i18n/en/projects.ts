import type { ProjectType } from '../../types';

const projects:ProjectType[] = [
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

export default projects;