export default function NotFound() {
  return (
    <main className="min-h-[100dvh] bg-[#050505] px-6 py-16 text-slate-300">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-800 bg-[#0a0a0a] p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-rose-400">
          ROUTE NOT FOUND
        </p>
        <h1 className="mt-3 text-2xl font-bold text-white">The requested console path is unavailable.</h1>
        <p className="mt-2 text-sm text-slate-500">
          Return to the operations dashboard to resume live node monitoring.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-lg border border-indigo-400/50 bg-indigo-600 px-3 py-2 font-mono text-xs text-white transition hover:bg-indigo-500"
        >
          RETURN TO DASHBOARD
        </a>
      </div>
    </main>
  );
}