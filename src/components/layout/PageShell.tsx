type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  children
}: PageShellProps) {
  return (
    <section className="flex w-full flex-col gap-8 sm:gap-10">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-bold uppercase text-amber-800">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>
        <p className="text-lg leading-8 text-slate-700">{description}</p>
      </div>
      {children}
    </section>
  );
}
