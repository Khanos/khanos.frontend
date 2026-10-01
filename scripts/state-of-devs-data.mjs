import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";

export const sourceFile = fileURLToPath(
  new URL(
    "../../stateofdevs-scraper/data/stateofdevs-2026-en-US/results.json",
    import.meta.url,
  ),
);
export const outputFile = fileURLToPath(
  new URL("../src/data/state-of-devs-2026.json", import.meta.url),
);

export function extractSurvey(snapshot) {
  const question = (page, section, id) => {
    const field =
      snapshot.pages[`/en-US/${page}/`].surveys.state_of_devs.devs2026[section][
        id
      ];
    const edition = field.combined.allEditions.find(
      (entry) => entry.editionId === "devs2026",
    );
    if (!edition) throw new Error(`Missing 2026 edition: ${id}`);
    return edition;
  };
  const bucket = (edition, id) => {
    const entry = edition.buckets.find((entry) => entry.id === id);
    if (!entry) throw new Error(`Missing bucket: ${id}`);
    return entry;
  };
  const percent = (count, n) => (count / n) * 100;
  const series = (page, section, id, ids) => {
    const edition = question(page, section, id);
    const n = edition.completion.count;
    return {
      n,
      source: `https://2026.stateofdevs.com/page-data/en-US/${page}/page-data.json`,
      question: id,
      rows: ids.map((id) => {
        const entry = bucket(edition, id);
        return { id, count: entry.count, percent: percent(entry.count, n) };
      }),
    };
  };
  const codeEdition = question("ai", "ai_usage", "ai_generated_code_balance");
  const code = series(
    "ai",
    "ai_usage",
    "ai_generated_code_balance",
    Array.from({ length: 9 }, (_, i) => String(i)),
  );
  code.rows.forEach((row) => {
    row.share = bucket(codeEdition, row.id).value;
  });
  const areas = series("workplace", "workplace", "work_areas", [
    "front_end_js",
    "ai_llm",
  ]);
  const experience = question(
    "workplace",
    "workplace",
    "work_areas_vs_years_of_experience_vs_yearly_salary_1",
  );
  const salaries = question(
    "workplace",
    "workplace",
    "work_areas_vs_years_of_experience_vs_yearly_salary_2",
  );
  areas.rows.forEach((row) => {
    const exp = bucket(experience, row.id);
    const salary = bucket(salaries, row.id);
    row.experienceMedian = exp.percentilesByFacet.p50;
    row.experienceFacetN = exp.count;
    row.salaryMedian = salary.percentilesByFacet.p50;
    row.salaryFacetN = salary.count;
  });
  const likely = (id) => {
    const values = series("career", "career", id, ["3", "4"]);
    return {
      n: values.n,
      count: values.rows.reduce((sum, row) => sum + row.count, 0),
      percent: values.rows.reduce((sum, row) => sum + row.percent, 0),
    };
  };
  const spain = bucket(
    question("workplace", "user_info", "country_vs_yearly_salary"),
    "ESP",
  );
  return {
    respondents: snapshot.survey.totalRespondents,
    code: {
      ...code,
      mean: codeEdition.average,
      median: codeEdition.percentiles.p50,
      highShare: code.rows
        .filter((row) => row.share >= 75)
        .reduce((sum, row) => sum + row.percent, 0),
    },
    workAreas: {
      ...areas,
      toolingExperienceMedian: bucket(experience, "tooling").percentilesByFacet
        .p50,
    },
    risks: series("ai", "ai_usage", "ai_risks", [
      "job_displacement",
      "slop_takeover",
      "cognitive_impact",
      "security_issues",
    ]),
    careerProblems: series("career", "career", "career_issues", [
      "bad_management",
      "burnout",
      "excessive_overtime",
      "boredom",
      "job_insecurity",
      "mental_health_issues",
      "underpaid_work",
    ]),
    burnout: series("workplace", "workplace", "workplace_burnout", [
      "reduced_motivation",
      "increased_cynicism",
      "emotionally_drained",
      "increased_procrastination",
    ]),
    remote: series("workplace", "workplace", "remote_work_policy", [
      "hybrid",
      "up_to_employee",
      "fully_remote",
      "no_remote_work",
    ]),
    security: {
      jobs: likely("job_security"),
      careers: likely("career_security"),
    },
    spain: {
      n: spain.count,
      mean: spain.averageByFacet,
      p25: spain.percentilesByFacet.p25,
      median: spain.percentilesByFacet.p50,
      p75: spain.percentilesByFacet.p75,
    },
  };
}

export async function generate() {
  const raw = await readFile(sourceFile, "utf8");
  return {
    ...extractSurvey(JSON.parse(raw)),
    snapshotSha256: createHash("sha256").update(raw).digest("hex"),
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const generated = JSON.stringify(await generate(), null, 2) + "\n";
  if (process.argv.includes("--check")) {
    if (
      !isDeepStrictEqual(
        JSON.parse(await readFile(outputFile, "utf8")),
        JSON.parse(generated),
      )
    )
      throw new Error(
        "Survey data is stale; run node scripts/state-of-devs-data.mjs",
      );
    console.log("All article data matches the downloaded source snapshot.");
  } else {
    await writeFile(outputFile, generated);
    console.log("Extracted article data from the local survey snapshot.");
  }
}
