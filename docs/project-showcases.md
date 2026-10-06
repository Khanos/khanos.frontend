# Project showcases

Lab cards use `ProjectCard.astro` and the existing `ProjectType` model, extended
with optional `showcase: ProjectShowcase`. `LabProject` adds the Lab's card labels,
status and imported-cover support. The carousel still owns scrolling and controls.

A card with `showcase` renders an accessible details button. A card without it
keeps its existing link. Showcase presence takes precedence over `link` or
`github`; `liveHref` remains an optional separate card link. URL Shortener has
no live link and no `/url` destination in its card configuration.

`ProjectDetailsModal.astro` renders data, using native `dialog.showModal()` for
focus containment, background isolation, Escape and focus return. Its custom
element owns open/close listeners and scroll locking, and cleans up on Astro
navigation. Desktop width is capped at 1024px; below 640px it fills the viewport.
Images form a simple vertical sequence. Missing or empty optional sections are
omitted. No UI or carousel dependency was added.

## Add another showcase

Add `showcase` to that project's translated Lab metadata in both
`src/i18n/en/index.ts` and `src/i18n/es/index.ts`. Rich copy can live in the
corresponding `project-showcases.ts` file, as URL Shortener does:

```ts
showcase: {
  summary: 'A concise one-line summary.',
  description: 'What the project does.',
  purpose: 'What problem it addresses.',
  status: 'experimental',
  statusNote: 'Optional explanation of access or project status.',
  highlights: [{ title: 'Technical decision', description: 'Reason and outcome.' }],
  tech: ['TypeScript'],
  images: [{ src: '/your-existing-image.webp', alt: 'Describe the image', caption: 'Optional caption' }],
  links: [{ label: 'Repository', url: 'https://github.com/your-account/your-repo', type: 'repository' }],
}
```

The example paths are placeholders. Verify assets, links and claims before
publishing. Imported Astro image metadata also works as `images[].src`.
`links[].type` accepts `repository`, `live`, `article` and `documentation`; only
configured links render, in new tabs with `noopener noreferrer`. Set the card's
translated `linkLabel` to “Explore project” or an equivalent label. Use a unique
`id` when rendering `ProjectCard` or `ProjectDetailsModal` outside this carousel.
Neither component needs project-specific code.

## URL Shortener content evidence

The English and Spanish showcases use the existing `src/assets/img/lab-url.png`.
It shows the earlier public interface and is explicitly captioned as historical.
A current authenticated-workspace screenshot was not created.

Both source repositories were confirmed public through GitHub metadata:
`https://github.com/Khanos/khanos.frontend` and
`https://github.com/Khanos/khanos.backend`.

Content comes from the current frontend URL components, services, owner boundary
and numeric redirect route, plus backend URL service, schema, router and package
configuration. These verify creation/copy/list/delete, owner access, public
redirects, random numeric codes, exact URL reuse, unique indexes, bounded retries,
cursor pagination, HTTP(S) validation, response checks and error/rate-limit
recovery. The stack is Astro, React, TypeScript, Tailwind CSS, Node.js, Express,
MongoDB and Mongoose. No analytics, unverified deployment claims or private-app
live link are included.

## Verification

- `pnpm test`: component rendering, absent/empty optional data, one/multiple
  images, all link kinds, normal navigation and bilingual showcase data.
- `pnpm test:e2e`: existing carousel regression coverage and showcase interactions,
  keyboard/focus/Escape, background isolation, close/backdrop behavior,
  scroll restoration, Astro navigation, responsive sizing and light/dark rendering.
- `pnpm build`: Astro/TypeScript checks and server build.
- `pnpm test:runtime`: generated Vercel-handler checks with synthetic responses.

The repository has no lint script or installed lint tool; its existing ESLint
configuration references Next.js. This feature does not change lint tooling.
