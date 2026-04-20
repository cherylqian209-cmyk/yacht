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
          Deployment stub is active for project <span className="font-semibold">{projectId}</span>.
        </p>
      </section>
    </main>
  );
}
