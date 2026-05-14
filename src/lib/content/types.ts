import type {Locale} from '@/i18n/routing';

export type LocalizedText = Record<Locale, string>;

export type LocalizedSlug = Record<Locale, string>;

export type ContentKind =
  | 'parasha'
  | 'tehillim'
  | 'shir_hashirim'
  | 'tefilot'
  | 'haftarot'
  | 'holiday'
  | 'other'
  | 'video';

export type ContentStatus = 'draft' | 'published';

export type CategoryId =
  | 'parashat-hashavua'
  | 'tehillim'
  | 'shir-hashirim'
  | 'tefilot'
  | 'haftarot'
  | 'holidays'
  | 'other';

export type Tag = {
  id: string;
  slug: LocalizedSlug;
  title: LocalizedText;
};

export type Category = {
  id: string;
  slug: LocalizedSlug;
  title: LocalizedText;
  description?: LocalizedText;
  order: number;
};

export type Parasha = {
  id: string;
  order: number;
  slug: LocalizedSlug;
  title: LocalizedText;
  book: LocalizedText;
  doubleParashaGroup?: string;
  combinedParashaIds?: [string, string];
};

export type Sefer = {
  id: string;
  title: LocalizedText;
  parashot: Array<Omit<Parasha, 'book'>>;
};

export type VideoSummary = {
  id: string;
  youtubeId: string;
  title: LocalizedText;
  description?: LocalizedText;
  thumbnailUrl?: string;
  durationSeconds?: number;
};

export type ContentItem = {
  id: string;
  slug: LocalizedSlug;
  kind: ContentKind;
  categoryId: CategoryId;
  title: LocalizedText;
  description?: LocalizedText;
  parashaId?: string;
  tagIds: string[];
  videos: VideoSummary[];
  status: ContentStatus;
  publishedAt?: string;
};

export type ContentSummary = {
  id: string;
  slug: string;
  kind: ContentKind;
  title: LocalizedText;
  description?: LocalizedText;
  status: ContentStatus;
};
