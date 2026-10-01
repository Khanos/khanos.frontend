import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import { generate, outputFile } from "./state-of-devs-data.mjs";

test("article data matches the original downloaded results, including denominators", async () => {
  const stored = JSON.parse(await readFile(outputFile, "utf8"));
  assert.deepEqual(stored, await generate());
  assert.equal(stored.respondents, 5463);
  assert.equal(stored.workAreas.n, 4868);
  assert.equal(stored.workAreas.rows[0].count, 4064);
  assert.equal(stored.workAreas.rows[1].count, 705);
  assert.equal(stored.spain.n, 140);
  assert.equal(stored.spain.median, 70000);
  for (const series of [
    stored.code,
    stored.workAreas,
    stored.risks,
    stored.careerProblems,
    stored.burnout,
    stored.remote,
  ]) {
    for (const row of series.rows)
      assert.equal(row.percent, (row.count / series.n) * 100);
  }
  assert.equal(
    stored.code.rows.reduce((sum, row) => sum + row.count, 0),
    stored.code.n,
  );
  // Additional remote freeform tags overlap the four exclusive main categories.
  // Including those tags in a stacked distribution would double-count answers.
  assert.equal(
    stored.remote.rows.reduce((sum, row) => sum + row.count, 0),
    stored.remote.n,
  );
});

test("both article languages omit personal attribution and use the verified data", async () => {
  for (const lang of ["en", "es"]) {
    const article = await readFile(
      new URL(
        `../src/content/posts/${lang}/6-state-of-devs-2026-ai-workflow.mdx`,
        import.meta.url,
      ),
      "utf8",
    );
    assert.match(article, /author: ""/);
    assert.match(article, /anonymous: true/);
    assert.doesNotMatch(
      article,
      /Epilef|Rodriguez|Madrid|my (?:salary|company|employer|family|career|work|projects)|—/i,
    );
    assert.match(article, /SurveyChart/);
  }
});
