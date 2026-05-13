import type {CategoryId} from '@/lib/content/types';

export type YouTubeVideoTitle = {
  source: string;
  he: string;
  en: string;
};

export type YouTubeThumbnail = {
  url: string;
  width?: number;
  height?: number;
};

export type YouTubeVideo = {
  videoId: string;
  title: YouTubeVideoTitle;
  slug?: {
    he?: string;
    en?: string;
  };
  description: string;
  publishedAt: string;
  duration: string;
  thumbnails: Record<string, YouTubeThumbnail>;
  watchUrl: string;
  embedUrl: string;
  category: CategoryId;
  subcategory?: string | null;
  parashaSlug: string | null;
  tags: string[];
  nusach?: string | null;
  displayOrder: number | null;
  featured?: boolean;
  hidden?: boolean;
  classification: {
    automaticCategory: CategoryId;
    matchedKeywords: string[];
    manualOverrideApplied: boolean;
  };
};

export type ManualVideoOverride = {
  category?: CategoryId;
  subcategory?: string | null;
  title?: {
    he?: string;
    en?: string;
  };
  slug?: {
    he?: string;
    en?: string;
  };
  parashaSlug?: string | null;
  tags?: string[];
  nusach?: string | null;
  displayOrder?: number | null;
  featured?: boolean;
  hidden?: boolean;
};

export type ManualOverridesFile = {
  videos?: Record<string, ManualVideoOverride>;
};
