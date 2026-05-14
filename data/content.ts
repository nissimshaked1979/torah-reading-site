import type {Category, ContentItem, Tag} from '@/lib/content/types';

export const categories: Category[] = [
  {
    id: 'parashat-hashavua',
    order: 1,
    slug: {he: 'פרשת-השבוע', en: 'parashat-hashavua'},
    title: {he: 'פרשת השבוע', en: 'Parashat Hashavua'},
    description: {
      he: 'קריאות לפרשות השבוע ולפרשות מחוברות.',
      en: 'Weekly Torah portions and double portions.'
    }
  },
  {
    id: 'tehillim',
    order: 2,
    slug: {he: 'תהילים', en: 'tehillim'},
    title: {he: 'תהילים', en: 'Tehillim'},
    description: {
      he: 'פרקי תהילים לקריאה ולשמיעה.',
      en: 'Selected Psalms readings.'
    }
  },
  {
    id: 'shir-hashirim',
    order: 3,
    slug: {he: 'שיר-השירים', en: 'shir-hashirim'},
    title: {he: 'שיר השירים', en: 'Shir Hashirim'},
    description: {
      he: 'קריאות שיר השירים.',
      en: 'Song of Songs readings.'
    }
  },
  {
    id: 'tefilot',
    order: 4,
    slug: {he: 'תפילות', en: 'tefilot'},
    title: {he: 'תפילות', en: 'Tefilot'},
    description: {
      he: 'תפילות, ברכות וקריאות נוספות.',
      en: 'Prayers, blessings, and related readings.'
    }
  },
  {
    id: 'holidays',
    order: 5,
    slug: {he: 'חגים', en: 'holidays'},
    title: {he: 'חגים ומועדים', en: 'Holidays'},
    description: {
      he: 'קריאות ותכנים למועדי ישראל.',
      en: 'Readings and content for Jewish holidays.'
    }
  },
  {
    id: 'haftarot',
    order: 6,
    slug: {he: 'הפטרות', en: 'haftarot'},
    title: {he: 'הפטרות', en: 'Haftarot'},
    description: {
      he: 'קריאות הפטרה והכנה להפטרות.',
      en: 'Haftarah readings and preparation.'
    }
  },
  {
    id: 'piyutim',
    order: 7,
    slug: {he: 'פיוטים', en: 'piyutim'},
    title: {he: 'פיוטים', en: 'Piyutim'},
    description: {
      he: 'פיוטים ומסורות שירה בנוסח ספרדי ירושלמי.',
      en: 'Piyutim and Sephardic Yerushalmi melodies.'
    }
  },
  {
    id: 'taamim',
    order: 8,
    slug: {he: 'טעמי-המקרא', en: 'taamei-hamikra'},
    title: {he: 'טעמי המקרא', en: 'Taamei Hamikra'},
    description: {
      he: 'לימוד טעמי המקרא, סימוני ידיים ולוחות טעמים.',
      en: 'Cantillation, taamim, hand signs, and trope learning.'
    }
  },
  {
    id: 'megillot',
    order: 9,
    slug: {he: 'מגילת-אסתר', en: 'megillat-esther'},
    title: {he: 'מגילת אסתר', en: 'Megillat Esther'},
    description: {
      he: 'קריאת מגילת אסתר ולימוד טעמי המגילה.',
      en: 'Megillat Esther readings and trope learning.'
    }
  },
  {
    id: 'other',
    order: 10,
    slug: {he: 'אחר', en: 'other'},
    title: {he: 'אחר', en: 'Other'},
    description: {
      he: 'תכנים יהודיים נוספים.',
      en: 'Additional Jewish reading content.'
    }
  }
];

export const tags: Tag[] = [
  {
    id: 'torah-reading',
    slug: {he: 'קריאת-תורה', en: 'torah-reading'},
    title: {he: 'קריאת תורה', en: 'Torah Reading'}
  },
  {
    id: 'weekly',
    slug: {he: 'שבועי', en: 'weekly'},
    title: {he: 'שבועי', en: 'Weekly'}
  },
  {
    id: 'psalms',
    slug: {he: 'תהילים', en: 'psalms'},
    title: {he: 'תהילים', en: 'Psalms'}
  },
  {
    id: 'prayer',
    slug: {he: 'תפילה', en: 'prayer'},
    title: {he: 'תפילה', en: 'Prayer'}
  },
  {
    id: 'holiday',
    slug: {he: 'חג', en: 'holiday'},
    title: {he: 'חג', en: 'Holiday'}
  }
];

export const contentItems: ContentItem[] = [
  {
    id: 'parasha-bereshit-reading',
    slug: {he: 'קריאת-פרשת-בראשית', en: 'parashat-bereshit-reading'},
    kind: 'parasha',
    categoryId: 'parashat-hashavua',
    title: {he: 'קריאת פרשת בראשית', en: 'Parashat Bereshit Reading'},
    description: {
      he: 'קריאה לדוגמה לפרשת בראשית.',
      en: 'Sample reading for Parashat Bereshit.'
    },
    parashaId: 'bereshit',
    tagIds: ['torah-reading', 'weekly'],
    status: 'published',
    videos: [
      {
        id: 'video-bereshit-1',
        youtubeId: 'VIDEO_BERESHIT_001',
        title: {he: 'בראשית - קריאה', en: 'Bereshit - Reading'}
      }
    ]
  },
  {
    id: 'parasha-noach-reading',
    slug: {he: 'קריאת-פרשת-נח', en: 'parashat-noach-reading'},
    kind: 'parasha',
    categoryId: 'parashat-hashavua',
    title: {he: 'קריאת פרשת נח', en: 'Parashat Noach Reading'},
    description: {
      he: 'קריאה לדוגמה לפרשת נח.',
      en: 'Sample reading for Parashat Noach.'
    },
    parashaId: 'noach',
    tagIds: ['torah-reading', 'weekly'],
    status: 'published',
    videos: [
      {
        id: 'video-noach-1',
        youtubeId: 'VIDEO_NOACH_001',
        title: {he: 'נח - קריאה', en: 'Noach - Reading'}
      }
    ]
  },
  {
    id: 'parasha-vayakhel-pekudei-reading',
    slug: {
      he: 'קריאת-פרשת-ויקהל-פקודי',
      en: 'parashat-vayakhel-pekudei-reading'
    },
    kind: 'parasha',
    categoryId: 'parashat-hashavua',
    title: {
      he: 'קריאת פרשת ויקהל-פקודי',
      en: 'Parashat Vayakhel-Pekudei Reading'
    },
    description: {
      he: 'קריאה לדוגמה לפרשה מחוברת.',
      en: 'Sample reading for a double parasha.'
    },
    parashaId: 'vayakhel-pekudei',
    tagIds: ['torah-reading', 'weekly'],
    status: 'published',
    videos: [
      {
        id: 'video-vayakhel-pekudei-1',
        youtubeId: 'VIDEO_VAYAKHEL_PEKUDEI_001',
        title: {
          he: 'ויקהל-פקודי - קריאה',
          en: 'Vayakhel-Pekudei - Reading'
        }
      }
    ]
  },
  {
    id: 'tehillim-23',
    slug: {he: 'תהילים-כג', en: 'tehillim-23'},
    kind: 'tehillim',
    categoryId: 'tehillim',
    title: {he: 'תהילים כג', en: 'Psalm 23'},
    description: {
      he: 'קריאת מזמור לדוד.',
      en: 'Reading of Psalm 23.'
    },
    tagIds: ['psalms'],
    status: 'published',
    videos: [
      {
        id: 'video-tehillim-23',
        youtubeId: 'VIDEO_TEHILLIM_023',
        title: {he: 'תהילים כג', en: 'Psalm 23'}
      }
    ]
  },
  {
    id: 'tehillim-121',
    slug: {he: 'תהילים-קכא', en: 'tehillim-121'},
    kind: 'tehillim',
    categoryId: 'tehillim',
    title: {he: 'תהילים קכא', en: 'Psalm 121'},
    tagIds: ['psalms'],
    status: 'published',
    videos: [
      {
        id: 'video-tehillim-121',
        youtubeId: 'VIDEO_TEHILLIM_121',
        title: {he: 'תהילים קכא', en: 'Psalm 121'}
      }
    ]
  },
  {
    id: 'shir-hashirim-chapter-1',
    slug: {he: 'שיר-השירים-פרק-א', en: 'shir-hashirim-chapter-1'},
    kind: 'shir_hashirim',
    categoryId: 'shir-hashirim',
    title: {he: 'שיר השירים פרק א', en: 'Shir Hashirim Chapter 1'},
    tagIds: [],
    status: 'published',
    videos: [
      {
        id: 'video-shir-hashirim-1',
        youtubeId: 'VIDEO_SHIR_HASHIRIM_001',
        title: {he: 'שיר השירים א', en: 'Shir Hashirim 1'}
      }
    ]
  },
  {
    id: 'shir-hashirim-full',
    slug: {he: 'שיר-השירים-מלא', en: 'shir-hashirim-full'},
    kind: 'shir_hashirim',
    categoryId: 'shir-hashirim',
    title: {he: 'שיר השירים המלא', en: 'Full Shir Hashirim'},
    tagIds: [],
    status: 'published',
    videos: [
      {
        id: 'video-shir-hashirim-full',
        youtubeId: 'VIDEO_SHIR_HASHIRIM_FULL',
        title: {he: 'שיר השירים המלא', en: 'Full Shir Hashirim'}
      }
    ]
  },
  {
    id: 'tefilat-haderech',
    slug: {he: 'תפילת-הדרך', en: 'tefilat-haderech'},
    kind: 'tefilot',
    categoryId: 'tefilot',
    title: {he: 'תפילת הדרך', en: 'Tefilat Haderech'},
    tagIds: ['prayer'],
    status: 'published',
    videos: [
      {
        id: 'video-tefilat-haderech',
        youtubeId: 'VIDEO_TEFILAT_HADERECH',
        title: {he: 'תפילת הדרך', en: 'Tefilat Haderech'}
      }
    ]
  },
  {
    id: 'shema-yisrael',
    slug: {he: 'שמע-ישראל', en: 'shema-yisrael'},
    kind: 'tefilot',
    categoryId: 'tefilot',
    title: {he: 'שמע ישראל', en: 'Shema Yisrael'},
    tagIds: ['prayer'],
    status: 'published',
    videos: [
      {
        id: 'video-shema-yisrael',
        youtubeId: 'VIDEO_SHEMA_YISRAEL',
        title: {he: 'שמע ישראל', en: 'Shema Yisrael'}
      }
    ]
  },
  {
    id: 'pesach-reading',
    slug: {he: 'קריאה-לפסח', en: 'pesach-reading'},
    kind: 'holiday',
    categoryId: 'holidays',
    title: {he: 'קריאה לפסח', en: 'Pesach Reading'},
    tagIds: ['holiday'],
    status: 'published',
    videos: [
      {
        id: 'video-pesach-reading',
        youtubeId: 'VIDEO_PESACH_001',
        title: {he: 'קריאה לפסח', en: 'Pesach Reading'}
      }
    ]
  },
  {
    id: 'rosh-hashanah-reading',
    slug: {he: 'קריאה-לראש-השנה', en: 'rosh-hashanah-reading'},
    kind: 'holiday',
    categoryId: 'holidays',
    title: {he: 'קריאה לראש השנה', en: 'Rosh Hashanah Reading'},
    tagIds: ['holiday'],
    status: 'published',
    videos: [
      {
        id: 'video-rosh-hashanah',
        youtubeId: 'VIDEO_ROSH_HASHANAH_001',
        title: {he: 'ראש השנה', en: 'Rosh Hashanah'}
      }
    ]
  },
  {
    id: 'birkat-hakohanim',
    slug: {he: 'ברכת-כהנים', en: 'birkat-hakohanim'},
    kind: 'other',
    categoryId: 'other',
    title: {he: 'ברכת כהנים', en: 'Birkat Hakohanim'},
    tagIds: ['prayer'],
    status: 'published',
    videos: [
      {
        id: 'video-birkat-hakohanim',
        youtubeId: 'VIDEO_BIRKAT_HAKOHANIM',
        title: {he: 'ברכת כהנים', en: 'Birkat Hakohanim'}
      }
    ]
  },
  {
    id: 'haftarah-introduction',
    slug: {he: 'מבוא-להפטרה', en: 'haftarah-introduction'},
    kind: 'haftarot',
    categoryId: 'haftarot',
    title: {he: 'מבוא להפטרה', en: 'Haftarah Introduction'},
    tagIds: ['torah-reading'],
    status: 'published',
    videos: [
      {
        id: 'video-haftarah-intro',
        youtubeId: 'VIDEO_HAFTARAH_INTRO',
        title: {he: 'מבוא להפטרה', en: 'Haftarah Introduction'}
      }
    ]
  }
];
