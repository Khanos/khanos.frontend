import survey from "./state-of-devs-2026.json";

export type ChartRow = {
  id: string;
  label: string;
  count: number;
  percent: number;
  details?: { label: string; value: string }[];
};
export type ChartConfig = {
  id: string;
  title: string;
  n: number;
  rows: ChartRow[];
  note: string;
  source: string;
};

export const formatPercent = (value: number, lang: string = "en") =>
  new Intl.NumberFormat(lang, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value) + "%";
export const formatNumber = (value: number, lang: string = "en") =>
  new Intl.NumberFormat(lang).format(value);
export const formatMoney = (value: number, lang: string = "en") =>
  new Intl.NumberFormat(lang, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const formatRoundedMoney = (value: number, lang: string = "en") =>
  formatMoney(Math.round(value / 100) * 100, lang);

const labels = {
  en: {
    job_displacement: "Job displacement",
    slop_takeover: "Low-quality AI content",
    cognitive_impact: "Cognitive impact / reduced learning",
    security_issues: "Security issues",
    bad_management: "Bad management",
    burnout: "Burnout",
    excessive_overtime: "Work-life balance issues",
    boredom: "Boredom",
    job_insecurity: "Job insecurity",
    mental_health_issues: "Mental-health-related issues",
    underpaid_work: "Insufficient wages",
    reduced_motivation: "Reduced motivation",
    increased_cynicism: "Increased cynicism",
    emotionally_drained: "Emotionally drained",
    increased_procrastination: "Increased procrastination",
    hybrid: "Hybrid",
    up_to_employee: "Employee choice",
    fully_remote: "Fully remote",
    no_remote_work: "No remote work",
  },
  es: {
    job_displacement: "Desplazamiento laboral",
    slop_takeover: "Contenido de IA de baja calidad",
    cognitive_impact: "Efectos cognitivos / menor aprendizaje",
    security_issues: "Problemas de seguridad",
    bad_management: "Mala gestión",
    burnout: "Burnout",
    excessive_overtime: "Problemas de conciliación",
    boredom: "Aburrimiento",
    job_insecurity: "Inseguridad laboral",
    mental_health_issues: "Problemas relacionados con la salud mental",
    underpaid_work: "Remuneración insuficiente",
    reduced_motivation: "Menor motivación",
    increased_cynicism: "Mayor cinismo",
    emotionally_drained: "Agotamiento emocional",
    increased_procrastination: "Más procrastinación",
    hybrid: "Híbrido",
    up_to_employee: "A elección del empleado",
    fully_remote: "Totalmente remoto",
    no_remote_work: "Sin trabajo remoto",
  },
};

export function getSurveyCharts(language: "en" | "es") {
  const es = language === "es";
  const dictionary: Record<string, string> = labels[language];
  const selectionNote = es
    ? "Porcentaje de quienes respondieron esta pregunta. Varias selecciones permitidas; las categorías se solapan."
    : "Percent of this question's respondents. Multiple selections allowed; categories overlap.";
  const make = (
    id: string,
    title: string,
    series: typeof survey.risks,
    note = selectionNote,
  ): ChartConfig => ({
    id,
    title,
    n: series.n,
    rows: series.rows.map((row) => ({ ...row, label: dictionary[row.id] })),
    note,
    source: series.source,
  });
  return {
    code: {
      ...make(
        "code",
        es
          ? "Cuánto código dicen generar con IA"
          : "How much code respondents say comes from AI",
        survey.code,
        es
          ? "Estimaciones personales. Incluye código copiado de chatbots y escrito con herramientas de IA."
          : "Self-reported estimates. Includes chatbot copy-paste and code co-written with AI tools.",
      ),
      rows: survey.code.rows.map((row) => ({
        ...row,
        label: `${formatNumber(row.share, language)}% ${es ? "generado con IA" : "AI-generated"}`,
      })),
    },
    work: {
      id: "work",
      title: es
        ? "Mucho frontend; un grupo menor trabaja con IA/LLM"
        : "Lots of frontend; a smaller AI/LLM group",
      n: survey.workAreas.n,
      source: survey.workAreas.source,
      note: es
        ? "Áreas de trabajo con selecciones múltiples. Ingresos brutos anuales en USD, estimados a partir de tramos. Los grupos se solapan."
        : "Multiple-select work areas. Annual gross income in USD, estimated from salary bands. Groups overlap.",
      rows: survey.workAreas.rows.map((row) => ({
        ...row,
        label: row.id === "front_end_js" ? "Frontend JavaScript" : "AI / LLM",
        details: [
          {
            label: es ? "Mediana de ingresos" : "Median income",
            value: formatMoney(row.salaryMedian, language),
          },
          {
            label: es ? "Mediana de experiencia" : "Median experience",
            value: `${row.experienceMedian} ${es ? "años" : "years"}`,
          },
          {
            label: es
              ? "Registros ingresos / experiencia"
              : "Income / experience facet records",
            value: `${formatNumber(row.salaryFacetN, language)} / ${formatNumber(row.experienceFacetN, language)}`,
          },
        ],
      })),
    },
    risks: make(
      "risks",
      es
        ? "Lo que preocupa a los developers sobre la IA"
        : "What developers are worried about with AI",
      survey.risks,
      `${selectionNote} ${es ? "Son preocupaciones, no tasas de incidentes." : "Concerns, not incident rates."}`,
    ),
    problems: make(
      "problems",
      es
        ? "Problemas experimentados durante la carrera"
        : "Problems experienced during a career",
      survey.careerProblems,
    ),
    burnout: make(
      "burnout",
      es
        ? "Y cómo se siente el trabajo últimamente"
        : "And how work has felt recently",
      survey.burnout,
    ),
    remote: make(
      "remote",
      es
        ? "La flexibilidad remota sigue presente"
        : "Remote flexibility is still here",
      survey.remote,
      es
        ? "Las cuatro categorías principales suman el 100%. Los códigos de texto libre no se añaden como grupos separados."
        : "The four main categories sum to 100%. Additional freeform tags are not separate groups.",
    ),
  };
}
