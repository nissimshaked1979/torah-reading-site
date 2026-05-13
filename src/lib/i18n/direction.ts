import type {Locale} from '@/i18n/routing';

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'he' ? 'rtl' : 'ltr';
}
