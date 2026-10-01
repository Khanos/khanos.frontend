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
pnpm install --frozen-lockfile
```

Then, start the development server:

```sh
pnpm dev
```

## Building

To build the project for production, run:

```sh
pnpm build
```

This will create a dist directory with the built assets.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
## Testing

Use the pinned `pnpm@9.15.9` package manager and Node.js 24:

```sh
pnpm install --frozen-lockfile
pnpm test                          # writing utility unit tests
pnpm test:watch                    # unit tests while editing
pnpm exec playwright install chromium  # one-time browser download
pnpm test:e2e                      # homepage browser tests
pnpm build                        # Astro typecheck and production build
```

The same scripts can be run with `npm run` after installing with pnpm. The
legacy `package-lock.json` predates the current Astro dependencies; use the
maintained `pnpm-lock.yaml` for installs. Vitest covers publication dates,
latest-post selection, excerpt cleanup, and reading-time estimates. Playwright
covers homepage hierarchy, article routes, English/Spanish content, navigation
active states, and responsive layout at 1440px, 768px, and 375px.

Browser tests start and stop an isolated Astro development server on
`127.0.0.1:4335`; leave that port free. They block external requests such as
analytics and do not rely on the backend. They verify development rendering;
the separate build checks production compilation, not a deployed Vercel runtime.

GitHub Actions runs unit tests, the build, and Chromium browser tests on pull
requests and pushes to `master`. Failed browser tests upload traces and
screenshots; test output is ignored by Git.
