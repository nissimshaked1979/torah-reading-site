import {Link} from '@/i18n/navigation';

type CategoryCardProps = {
  title: string;
  description: string;
  href: string;
  icon?: string;
  tone?: string;
};

export function CategoryCard({
  title,
  description,
  href,
  icon = '✦',
  tone = 'from-[#fdf7e8] to-white'
}: CategoryCardProps) {
  return (
    <Link
      aria-label={title}
      className={`group block h-full rounded-xl border border-[#d8ad55]/30 bg-gradient-to-br ${tone} p-5 shadow-[0_12px_32px_rgba(28,37,65,0.08)] transition hover:-translate-y-1 hover:border-[#d8ad55] hover:shadow-[0_18px_42px_rgba(28,37,65,0.14)]`}
      href={href}
    >
      <article className="flex h-full flex-col gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#071735] text-lg font-bold text-[#f1c66d] shadow-sm">
          {icon}
        </span>
        <h2 className="text-xl font-bold leading-snug text-[#071735] group-hover:text-[#8f3f2d]">
          {title}
        </h2>
        <p className="text-base leading-7 text-[#34415f]">{description}</p>
      </article>
    </Link>
  );
}
