/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '@vercel/analytics/astro' {
  const Analytics: any;
  export default Analytics;
}

declare module '@vercel/analytics/dist/astro/index.astro' {
  const Analytics: any;
  export default Analytics;
}
