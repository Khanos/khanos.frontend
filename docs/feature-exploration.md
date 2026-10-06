# Feature exploration workflow

Use this workflow for new portfolio behavior, reusable UI, project showcases, or
tool interactions. Follow the repository's [discovery rules](../AGENTS.md#scope-and-discovery)
and [verification conventions](../AGENTS.md#verification).

## 1. Define the visitor flow

Translate the request into the current behavior, intended behavior, observable
acceptance conditions, and explicit scope limits. Identify whether the user wants
exploration, a specification, or implementation. Discovery-only requests end with
findings and a proposal; implementation requests continue through delivery.

Complete this step when the entry point and intended outcome are concrete enough
to test. Ask for missing information only when it materially affects that outcome.

## 2. Trace the existing feature

Inspect the route or section, data and types, presentation components, interactive
scripts or React islands, and any service or access boundary the flow reaches.
Use graph discovery and coverage checks as described in AGENTS.md, with direct
source reads for stale results and Astro-template relationships.

Complete this step with source paths explaining how the current flow works and
which layer owns the change. Distinguish verified behavior from assumptions;
identify backend evidence needed before making claims about a full-stack tool.

## 3. Find the reusable seam

Inspect the existing typography, spacing, theme colors, breakpoints, icons,
animation and reduced-motion patterns, and accessible interaction primitives.
Choose the smallest extension of the existing data model and components that
satisfies the acceptance conditions. Explain a new dependency only when existing
primitives cannot meet them.

For project showcases, read [Project showcases](project-showcases.md). Keep project
copy and optional sections in metadata, and retain normal navigation for projects
that have no showcase. Derive features and technology tags from current source and
package configuration. Verify repository URLs and public visibility, inspect
existing images, and label historical screenshots accurately. Keep owner access
and server-only credentials at their existing boundaries.

Complete this step with the owning components and data fields, optional states,
English/Spanish content needs, and the reason this design fits the existing site.

## 4. Make the proposal reviewable

Describe the proposed user flow, files expected to change, meaningful technical
decisions, and verification needed for each acceptance condition. Record open
questions and unverified claims alongside the decisions they affect. For an
exploration-only request, this proposal is the deliverable.

When implementation is requested, work on a feature branch and preserve the
agreed scope. Exercise the complete interaction, including surrounding behavior
that must continue working. Reusable components need evidence for missing optional
data as well as configured content; dialogs need keyboard, focus, closing, and
responsive checks.

## 5. Verify and report

Use the current scripts and repository verification guidance to select checks.
Run build, generated-runtime, and browser stages sequentially: build and development
servers share caches, so concurrent runs can invalidate browser results. Use the
owned test fixtures for browser checks and keep their requests independent of
production data.

Finish with the implemented or proposed behavior, source evidence, validation
results, remaining uncertainty, and delivery state. Commit, push, and PR creation
should match the user's requested delivery stage. Keep continuation guidance
discoverable from AGENTS.md when a feature establishes a reusable convention.
