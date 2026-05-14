import type {Locale} from '@/i18n/routing';
import {getDirection} from '@/lib/i18n/direction';

type SearchBarProps = {
  id?: string;
  locale: Locale;
  label: string;
  placeholder: string;
  buttonLabel: string;
  defaultValue?: string;
};

export function SearchBar({
  id = 'site-search',
  locale,
  label,
  placeholder,
  buttonLabel,
  defaultValue = ''
}: SearchBarProps) {
  return (
    <form
      action={`/${locale}/search`}
      aria-label={label}
      className="flex w-full max-w-md gap-2 md:min-w-80"
      role="search"
    >
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        className="min-w-0 flex-1 rounded-md border border-[#d8ad55]/40 bg-white px-3 py-2.5 text-base text-[#071735] shadow-sm outline-none transition placeholder:text-[#7c86a1] focus:border-[#d8ad55]"
        dir={getDirection(locale)}
        id={id}
        name="q"
        placeholder={placeholder}
        defaultValue={defaultValue}
        type="search"
      />
      <button
        aria-label={buttonLabel}
        className="rounded-md bg-[#d8ad55] px-4 py-2.5 text-sm font-bold text-[#071735] shadow-sm transition hover:bg-[#f1c66d]"
        type="submit"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
