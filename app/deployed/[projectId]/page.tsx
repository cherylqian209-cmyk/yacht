interface DeployedPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function DeployedPage({ params }: DeployedPageProps) {
  const { projectId } = await params;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold">Yacht deployed page</h1>
        <p className="mt-3 text-slate-600">
          Deployment is active for project <span className="font-semibold">{projectId}</span>.
        </p>

        <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            aria-label="Email"
            type="email"
            placeholder="Enter your email"
            className="h-11 flex-1 rounded-lg border border-slate-300 px-4 text-slate-900 outline-none focus:border-slate-500"
          />
          <button
            type="button"
            className="h-11 rounded-lg bg-slate-900 px-5 font-medium text-white transition hover:bg-slate-700"
          >
            Join Waitlist
          </button>
        </div>
      </section>
    </main>
  );
}
