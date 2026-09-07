# khanos.frontend

My portfolio: experience, skills and projects. Live at
**[khanos-frontend.vercel.app](https://khanos-frontend.vercel.app)**.

Built with Astro, TypeScript and Tailwind CSS, with React used for the interactive islands and
deployed to Vercel through `@astrojs/vercel`. The build handles image optimization (`sharp`), HTML
compression, a generated sitemap and `robots.txt`.

It has been through Angular, Vue, vanilla JavaScript and Next.js before landing here. Roughly the
same content each time — rebuilding it is how I get a feel for a framework's edges rather than its
tutorial.

## Project Structure

- `src/components`: This directory contains all the Astro components used in the project.
- `src/data`: This directory contains TypeScript files that export data used in the project.
- `src/pages`: This directory contains the Astro pages of the portfolio.
- `public`: This directory contains static files served by the portfolio.

## Getting Started

First, install the dependencies:

```sh
npm install
```

Then, start the development server:

```sh
npm run dev
```

## Building

To build the project for production, run:

```sh
npm run build
```

This will create a dist directory with the built assets.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.