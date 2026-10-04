import { dev } from "astro";
import { startApiFixture, fixtureOrigin, owner, token } from './api-fixture.mjs';

// Always use an owned loopback fixture and synthetic credentials, never local secrets.
const fixture = await startApiFixture();
process.env.PUBLIC_BACKEND_API_URL = `${fixtureOrigin}/api/`;
process.env.URL_ADMIN_USERNAME = owner.username;
process.env.URL_ADMIN_PASSWORD = owner.password;
process.env.OWNER_API_TOKEN = token;
// Synthetic token can sign local client authorizations; Blob writes are intercepted.
process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_fixturestore_synthetic-test-blob-secret-0000000000';

// Use a separate foreground server: Astro's agent-aware CLI can detach or reuse
// the developer's server. Vercel server output cannot use `astro preview`.
const server = await dev({
  server: { host: "127.0.0.1", port: 4335 },
  devToolbar: { enabled: false },
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, async () => {
    await server.stop();
    await fixture.close();
    process.exit(0);
  });
}
