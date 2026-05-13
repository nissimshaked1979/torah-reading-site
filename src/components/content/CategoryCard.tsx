import {Link} from '@/i18n/navigation';

type CategoryCardProps = {
  title: string;
  description: string;
  href: string;
};

export function CategoryCard({title, description, href}: CategoryCardProps) {
  return (
    <Link
      aria-label={title}
      className="group block h-full rounded-lg border border-amber-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
      href={href}
    >
      <article className="flex h-full flex-col gap-3">
        <h2 className="text-xl font-bold leading-snug text-slate-950 group-hover:text-amber-950">
          {title}
        </h2>
        <p className="text-base leading-7 text-slate-600">{description}</p>
      </article>
    </Link>
  );
}
