import type { ProjectShowcase } from "../../types";
import UrlImage from "../../assets/img/lab-url.png";

export const urlShowcase: ProjectShowcase = {
  summary:
    "Personal link management with a private workspace and public short-link redirects.",
  status: "private",
  statusNote:
    "The management app requires owner authentication. This case study shares the implementation; issued short links can still be visited without signing in.",
  description:
    "Create, copy, list, and delete short links from an owner-only interface. An Astro route resolves each numeric code through the backend API and redirects visitors to its stored destination.",
  purpose:
    "A practical full-stack tool for turning long URLs into shareable links, with a clear boundary between private management and public resolution.",
  images: [
    {
      src: UrlImage,
      alt: "Earlier URL Shortener interface showing the URL input and saved-link table.",
      caption:
        "Earlier interface: URL creation and saved links. The current management workspace requires owner authentication.",
    },
  ],
  highlights: [
    {
      title: "Reliable short-code allocation",
      description:
        "Cryptographically random numeric codes, unique database indexes, and bounded collision retries. Submitting the exact same URL reuses its existing mapping.",
    },
    {
      title: "Private management, public redirects",
      description:
        "Owner authentication protects creation, listing, and deletion. Backend credentials stay on the server; visitors can resolve issued links without owner access.",
    },
    {
      title: "A small, explicit API",
      description:
        "An Express service persists URL mappings in MongoDB through Mongoose. Cursor pagination keeps the management list bounded.",
    },
    {
      title: "Validation and recovery",
      description:
        "HTTP(S) URL validation and response-contract checks guard the API boundary. The interface preserves input during failures and respects rate-limit cooldowns.",
    },
  ],
  tech: [
    "Astro",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "MongoDB",
    "Mongoose",
  ],
  links: [
    {
      label: "Frontend repository",
      url: "https://github.com/Khanos/khanos.frontend",
      type: "repository",
    },
    {
      label: "Backend repository",
      url: "https://github.com/Khanos/khanos.backend",
      type: "repository",
    },
  ],
};
