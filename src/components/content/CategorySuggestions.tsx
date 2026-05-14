import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {categories} from '@/lib/content/repository';
import {getVideosByCategory} from '@/lib/youtube/repository';

type CategorySuggestionsProps = {
  locale: Locale;
};

export function CategorySuggestions({locale}: CategorySuggestionsProps) {
  const suggestions = categories
    .filter((category) => category.id !== 'other')
    .filter((category) => getVideosByCategory(category.id).length > 0)
    .slice(0, 6);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {suggestions.map((category) => (
        <Link
          className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-950 transition hover:bg-amber-100"
          href={`/category/${category.slug.en}`}
          key={category.id}
        >
          {category.title[locale]}
        </Link>
      ))}
    </div>
  );
}
