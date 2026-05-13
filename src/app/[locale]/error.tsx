'use client';

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({error, reset}: ErrorPageProps) {
  return (
    <section className="w-full rounded-lg border border-red-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase text-red-700">Error</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-950">
        Something went wrong
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">{error.message}</p>
      <button
        className="mt-5 rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-amber-900"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </section>
  );
}
