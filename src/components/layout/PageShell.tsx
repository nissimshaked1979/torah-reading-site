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
        <p className="text-sm font-bold uppercase text-[#9a5a1b]">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-bold leading-tight text-[#071735] sm:text-4xl">
          {title}
        </h1>
        <p className="text-lg leading-8 text-[#34415f]">{description}</p>
      </div>
      {children}
    </section>
  );
}
