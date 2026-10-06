import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import ProjectDetailsModal from "../../src/components/ProjectDetailsModal.astro";
import ProjectCard from "../../src/components/ProjectCard.astro";
import type { LabProject, ProjectShowcase } from "../../src/types";
import { urlShowcase as en } from "../../src/i18n/en/project-showcases";
import { urlShowcase as es } from "../../src/i18n/es/project-showcases";

const project: LabProject = {
  title: "Test project",
  description: "A small project",
  image: "/lab/ovitals.svg",
  imageAlt: "Project cover",
  tags: ["TypeScript"],
  status: "Experiment",
  linkLabel: "Explore project",
  link: "https://example.com/project",
};
async function render(showcase: ProjectShowcase) {
  const container = await AstroContainer.create();
  return container.renderToString(ProjectDetailsModal, {
    props: {
      project: { title: project.title, showcase },
      lang: "en",
      id: "test-project",
    },
  });
}

describe("data-driven project showcases", () => {
  it("preserves normal project navigation and switches to a button only with showcase data", async () => {
    const container = await AstroContainer.create();
    const normal = await container.renderToString(ProjectCard, {
      props: { project, lang: "en", id: "regular" },
    });
    expect(normal).toContain('href="https://example.com/project"');
    expect(normal).toContain('target="_blank"');
    expect(normal).not.toContain("<dialog");
    const details = await container.renderToString(ProjectCard, {
      props: {
        project: { ...project, showcase: { summary: "Summary" } },
        lang: "en",
        id: "details",
      },
    });
    expect(details).toContain("data-showcase-trigger");
    expect(details).toContain('aria-haspopup="dialog"');
    expect(details).not.toContain('href="https://example.com/project"');
  });

  it("omits all empty optional sections", async () => {
    const html = await render({
      summary: "Only the summary",
      images: [],
      highlights: [],
      tech: [],
      links: [],
    });
    expect(html).toContain("Only the summary");
    expect(html).toContain('aria-labelledby="test-project-title"');
    expect(html).not.toContain("<section");
    expect(html).not.toContain("<figure");
    expect(html).not.toContain("showcase-status");
  });

  it.each([1, 2])(
    "supports %i images, captions, and meaningful alt text",
    async (count) => {
      const html = await render({
        summary: "Visual project",
        images: Array.from({ length: count }, (_, index) => ({
          src: `/test-${index}.png`,
          alt: `Preview ${index}`,
          ...(index === 0 ? { caption: "First preview" } : {}),
        })),
      });
      expect(html.match(/<figure/g)).toHaveLength(count);
      expect(html.match(/<figcaption/g)).toHaveLength(1);
      expect(html).toContain('alt="Preview 0"');
    },
  );

  it("renders configured sections and every link kind safely", async () => {
    const html = await render({
      summary: "Summary",
      description: "Overview text",
      purpose: "Purpose text",
      status: "experimental",
      highlights: [{ title: "Decision", description: "Trade-off" }],
      tech: ["TypeScript"],
      links: ["repository", "live", "article", "documentation"].map((type) => ({
        type: type as NonNullable<ProjectShowcase["links"]>[number]["type"],
        label: `${type} link`,
        url: `https://example.com/${type}`,
      })),
    });
    for (const text of [
      "Overview text",
      "Purpose text",
      "Decision",
      "Trade-off",
      "TypeScript",
      "Experimental",
    ])
      expect(html).toContain(text);
    expect(html.match(/target="_blank"/g)).toHaveLength(4);
    expect(html.match(/rel="noopener noreferrer"/g)).toHaveLength(4);
  });

  it("keeps URL Shortener data bilingual with verified repositories and no live-login link", () => {
    for (const showcase of [en, es]) {
      expect(showcase.status).toBe("private");
      expect(showcase.highlights).toHaveLength(4);
      expect(showcase.images).toHaveLength(1);
      expect(showcase.tech).toContain("Astro");
      expect(showcase.links?.map((link) => link.url)).toEqual([
        "https://github.com/Khanos/khanos.frontend",
        "https://github.com/Khanos/khanos.backend",
      ]);
      expect(showcase.links?.every((link) => link.type === "repository")).toBe(
        true,
      );
    }
  });
});
