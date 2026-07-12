export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            TraderAdd API
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Coming Soon API</h1>
          <p className="text-muted">
            Public metadata for health checks and beta waitlist requests.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Endpoints</h2>
          <div className="space-y-3 text-sm text-muted">
            <p>
              <code className="text-white">GET /api/health</code> returns service health.
            </p>
            <p>
              <code className="text-white">POST /api/waitlist</code> accepts JSON with an
              email address and forwards it to the configured server-side waitlist backend.
            </p>
            <p>
              <code className="text-white">GET /openapi.yaml</code> exposes the machine-readable
              API description.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
