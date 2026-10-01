import { dev } from "astro";

// Use a separate foreground server: Astro's agent-aware CLI can detach or reuse
// the developer's server. Vercel server output cannot use `astro preview`.
const server = await dev({
  server: { host: "127.0.0.1", port: 4335 },
  devToolbar: { enabled: false },
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, async () => {
    await server.stop();
    process.exit(0);
  });
}
