import type {Locale} from '@/i18n/routing';
import {getParashaBySlug, parashot} from '@/lib/content/repository';
import type {Parasha} from '@/lib/content/types';

import calendarOverrides from '../../../data/calendar-overrides.json';

type CalendarOverrides = {
  currentParashaSlug?: string | null;
  dateOverrides?: Record<string, string>;
};

type CalendarProvider = {
  getParashaForDate: (date: Date) => Parasha | undefined;
};

const overrides = calendarOverrides as CalendarOverrides;
const knownIsraelAnchor = {
  date: '2026-05-16',
  parashaSlug: 'bamidbar'
};

const cycleParashot = parashot
  .sort((a, b) => a.order - b.order);

const internalCalendarProvider: CalendarProvider = {
  getParashaForDate(date) {
    const shabbat = getUpcomingShabbat(date);
    const overrideSlug = overrides.dateOverrides?.[formatDateKey(shabbat)];
    const override = overrideSlug ? getParashaBySlug(overrideSlug) : undefined;

    if (override) {
      return override;
    }

    return getParashaFromAnchor(shabbat);
  }
};

export function getCurrentParasha(date = new Date()): Parasha {
  const manualOverride = getManualCurrentParasha();

  return (
    manualOverride ??
    internalCalendarProvider.getParashaForDate(date) ??
    fallbackParasha()
  );
}

export function getNextParasha(parasha = getCurrentParasha()): Parasha {
  return getAdjacentParasha(parasha, 1);
}

export function getPreviousParasha(parasha = getCurrentParasha()): Parasha {
  return getAdjacentParasha(parasha, -1);
}

export function getParashaForDate(date: Date): Parasha {
  return internalCalendarProvider.getParashaForDate(date) ?? fallbackParasha();
}

export function getParashaDisplayName(
  parasha: Parasha,
  locale: Locale
): string {
  return parasha.title[locale];
}

function getManualCurrentParasha(): Parasha | undefined {
  const envOverride = process.env.CURRENT_PARASHA_SLUG;
  const overrideSlug = envOverride || overrides.currentParashaSlug;

  return overrideSlug ? getParashaBySlug(overrideSlug) : undefined;
}

function getParashaFromAnchor(date: Date): Parasha | undefined {
  const anchorDate = parseDateKey(knownIsraelAnchor.date);
  const anchor = getParashaBySlug(knownIsraelAnchor.parashaSlug);

  if (!anchor) {
    return undefined;
  }

  const anchorIndex = cycleParashot.findIndex((parasha) => parasha.id === anchor.id);
  const weeksFromAnchor = Math.floor(
    (stripTime(date).getTime() - stripTime(anchorDate).getTime()) /
      (7 * 24 * 60 * 60 * 1000)
  );
  const index =
    (anchorIndex + weeksFromAnchor + cycleParashot.length * 20) %
    cycleParashot.length;

  return cycleParashot[index];
}

function getAdjacentParasha(parasha: Parasha, direction: 1 | -1): Parasha {
  const index = cycleParashot.findIndex((item) => item.id === parasha.id);

  if (index === -1) {
    return direction === 1 ? cycleParashot[0] : cycleParashot.at(-1) ?? parasha;
  }

  return (
    cycleParashot[(index + direction + cycleParashot.length) % cycleParashot.length] ??
    parasha
  );
}

function getUpcomingShabbat(date: Date): Date {
  const copy = stripTime(date);
  const day = copy.getDay();
  const daysUntilShabbat = (6 - day + 7) % 7;
  copy.setDate(copy.getDate() + daysUntilShabbat);
  return copy;
}

function fallbackParasha(): Parasha {
  return getParashaBySlug('bereshit') ?? cycleParashot[0];
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDateKey(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
