import type {Parasha, Sefer} from '@/lib/content/types';

export const parashaBooks: Sefer[] = [
  {
    id: 'bereshit',
    title: {he: 'בראשית', en: 'Bereshit'},
    parashot: [
      {id: 'bereshit', order: 1, slug: {he: 'בראשית', en: 'bereshit'}, title: {he: 'בראשית', en: 'Bereshit'}},
      {id: 'noach', order: 2, slug: {he: 'נח', en: 'noach'}, title: {he: 'נח', en: 'Noach'}},
      {id: 'lech-lecha', order: 3, slug: {he: 'לך-לך', en: 'lech-lecha'}, title: {he: 'לך לך', en: 'Lech-Lecha'}},
      {id: 'vayera', order: 4, slug: {he: 'וירא', en: 'vayera'}, title: {he: 'וירא', en: 'Vayera'}},
      {id: 'chayei-sarah', order: 5, slug: {he: 'חיי-שרה', en: 'chayei-sarah'}, title: {he: 'חיי שרה', en: 'Chayei Sarah'}},
      {id: 'toldot', order: 6, slug: {he: 'תולדות', en: 'toldot'}, title: {he: 'תולדות', en: 'Toldot'}},
      {id: 'vayetze', order: 7, slug: {he: 'ויצא', en: 'vayetze'}, title: {he: 'ויצא', en: 'Vayetze'}},
      {id: 'vayishlach', order: 8, slug: {he: 'וישלח', en: 'vayishlach'}, title: {he: 'וישלח', en: 'Vayishlach'}},
      {id: 'vayeshev', order: 9, slug: {he: 'וישב', en: 'vayeshev'}, title: {he: 'וישב', en: 'Vayeshev'}},
      {id: 'miketz', order: 10, slug: {he: 'מקץ', en: 'miketz'}, title: {he: 'מקץ', en: 'Miketz'}},
      {id: 'vayigash', order: 11, slug: {he: 'ויגש', en: 'vayigash'}, title: {he: 'ויגש', en: 'Vayigash'}},
      {id: 'vayechi', order: 12, slug: {he: 'ויחי', en: 'vayechi'}, title: {he: 'ויחי', en: 'Vayechi'}}
    ]
  },
  {
    id: 'shemot',
    title: {he: 'שמות', en: 'Shemot'},
    parashot: [
      {id: 'shemot', order: 13, slug: {he: 'שמות', en: 'shemot'}, title: {he: 'שמות', en: 'Shemot'}},
      {id: 'vaera', order: 14, slug: {he: 'וארא', en: 'vaera'}, title: {he: 'וארא', en: 'Vaera'}},
      {id: 'bo', order: 15, slug: {he: 'בא', en: 'bo'}, title: {he: 'בא', en: 'Bo'}},
      {id: 'beshalach', order: 16, slug: {he: 'בשלח', en: 'beshalach'}, title: {he: 'בשלח', en: 'Beshalach'}},
      {id: 'yitro', order: 17, slug: {he: 'יתרו', en: 'yitro'}, title: {he: 'יתרו', en: 'Yitro'}},
      {id: 'mishpatim', order: 18, slug: {he: 'משפטים', en: 'mishpatim'}, title: {he: 'משפטים', en: 'Mishpatim'}},
      {id: 'terumah', order: 19, slug: {he: 'תרומה', en: 'terumah'}, title: {he: 'תרומה', en: 'Terumah'}},
      {id: 'tetzaveh', order: 20, slug: {he: 'תצוה', en: 'tetzaveh'}, title: {he: 'תצוה', en: 'Tetzaveh'}},
      {id: 'ki-tisa', order: 21, slug: {he: 'כי-תשא', en: 'ki-tisa'}, title: {he: 'כי תשא', en: 'Ki Tisa'}},
      {id: 'vayakhel', order: 22, slug: {he: 'ויקהל', en: 'vayakhel'}, title: {he: 'ויקהל', en: 'Vayakhel'}, doubleParashaGroup: 'vayakhel-pekudei'},
      {id: 'pekudei', order: 23, slug: {he: 'פקודי', en: 'pekudei'}, title: {he: 'פקודי', en: 'Pekudei'}, doubleParashaGroup: 'vayakhel-pekudei'}
    ]
  },
  {
    id: 'vayikra',
    title: {he: 'ויקרא', en: 'Vayikra'},
    parashot: [
      {id: 'vayikra', order: 24, slug: {he: 'ויקרא', en: 'vayikra'}, title: {he: 'ויקרא', en: 'Vayikra'}},
      {id: 'tzav', order: 25, slug: {he: 'צו', en: 'tzav'}, title: {he: 'צו', en: 'Tzav'}},
      {id: 'shemini', order: 26, slug: {he: 'שמיני', en: 'shemini'}, title: {he: 'שמיני', en: 'Shemini'}},
      {id: 'tazria', order: 27, slug: {he: 'תזריע', en: 'tazria'}, title: {he: 'תזריע', en: 'Tazria'}, doubleParashaGroup: 'tazria-metzora'},
      {id: 'metzora', order: 28, slug: {he: 'מצורע', en: 'metzora'}, title: {he: 'מצורע', en: 'Metzora'}, doubleParashaGroup: 'tazria-metzora'},
      {id: 'achrei-mot', order: 29, slug: {he: 'אחרי-מות', en: 'achrei-mot'}, title: {he: 'אחרי מות', en: 'Achrei Mot'}, doubleParashaGroup: 'achrei-mot-kedoshim'},
      {id: 'kedoshim', order: 30, slug: {he: 'קדושים', en: 'kedoshim'}, title: {he: 'קדושים', en: 'Kedoshim'}, doubleParashaGroup: 'achrei-mot-kedoshim'},
      {id: 'emor', order: 31, slug: {he: 'אמור', en: 'emor'}, title: {he: 'אמור', en: 'Emor'}},
      {id: 'behar', order: 32, slug: {he: 'בהר', en: 'behar'}, title: {he: 'בהר', en: 'Behar'}, doubleParashaGroup: 'behar-bechukotai'},
      {id: 'bechukotai', order: 33, slug: {he: 'בחוקותי', en: 'bechukotai'}, title: {he: 'בחוקותי', en: 'Bechukotai'}, doubleParashaGroup: 'behar-bechukotai'}
    ]
  },
  {
    id: 'bamidbar',
    title: {he: 'במדבר', en: 'Bamidbar'},
    parashot: [
      {id: 'bamidbar', order: 34, slug: {he: 'במדבר', en: 'bamidbar'}, title: {he: 'במדבר', en: 'Bamidbar'}},
      {id: 'nasso', order: 35, slug: {he: 'נשא', en: 'nasso'}, title: {he: 'נשא', en: 'Nasso'}},
      {id: 'behaalotcha', order: 36, slug: {he: 'בהעלותך', en: 'behaalotcha'}, title: {he: 'בהעלותך', en: 'Behaalotcha'}},
      {id: 'shelach', order: 37, slug: {he: 'שלח', en: 'shelach'}, title: {he: 'שלח', en: 'Shelach'}},
      {id: 'korach', order: 38, slug: {he: 'קרח', en: 'korach'}, title: {he: 'קרח', en: 'Korach'}},
      {id: 'chukat', order: 39, slug: {he: 'חקת', en: 'chukat'}, title: {he: 'חקת', en: 'Chukat'}, doubleParashaGroup: 'chukat-balak'},
      {id: 'balak', order: 40, slug: {he: 'בלק', en: 'balak'}, title: {he: 'בלק', en: 'Balak'}, doubleParashaGroup: 'chukat-balak'},
      {id: 'pinchas', order: 41, slug: {he: 'פינחס', en: 'pinchas'}, title: {he: 'פינחס', en: 'Pinchas'}},
      {id: 'matot', order: 42, slug: {he: 'מטות', en: 'matot'}, title: {he: 'מטות', en: 'Matot'}, doubleParashaGroup: 'matot-masei'},
      {id: 'masei', order: 43, slug: {he: 'מסעי', en: 'masei'}, title: {he: 'מסעי', en: 'Masei'}, doubleParashaGroup: 'matot-masei'}
    ]
  },
  {
    id: 'devarim',
    title: {he: 'דברים', en: 'Devarim'},
    parashot: [
      {id: 'devarim', order: 44, slug: {he: 'דברים', en: 'devarim'}, title: {he: 'דברים', en: 'Devarim'}},
      {id: 'vaetchanan', order: 45, slug: {he: 'ואתחנן', en: 'vaetchanan'}, title: {he: 'ואתחנן', en: 'Vaetchanan'}},
      {id: 'eikev', order: 46, slug: {he: 'עקב', en: 'eikev'}, title: {he: 'עקב', en: 'Eikev'}},
      {id: 'reeh', order: 47, slug: {he: 'ראה', en: 'reeh'}, title: {he: 'ראה', en: 'Reeh'}},
      {id: 'shoftim', order: 48, slug: {he: 'שופטים', en: 'shoftim'}, title: {he: 'שופטים', en: 'Shoftim'}},
      {id: 'ki-teitzei', order: 49, slug: {he: 'כי-תצא', en: 'ki-teitzei'}, title: {he: 'כי תצא', en: 'Ki Teitzei'}},
      {id: 'ki-tavo', order: 50, slug: {he: 'כי-תבוא', en: 'ki-tavo'}, title: {he: 'כי תבוא', en: 'Ki Tavo'}},
      {id: 'nitzavim', order: 51, slug: {he: 'נצבים', en: 'nitzavim'}, title: {he: 'נצבים', en: 'Nitzavim'}, doubleParashaGroup: 'nitzavim-vayelech'},
      {id: 'vayelech', order: 52, slug: {he: 'וילך', en: 'vayelech'}, title: {he: 'וילך', en: 'Vayelech'}, doubleParashaGroup: 'nitzavim-vayelech'},
      {id: 'haazinu', order: 53, slug: {he: 'האזינו', en: 'haazinu'}, title: {he: 'האזינו', en: 'Haazinu'}},
      {id: 'vezot-haberakhah', order: 54, slug: {he: 'וזאת-הברכה', en: 'vezot-haberakhah'}, title: {he: 'וזאת הברכה', en: 'Vezot Haberakhah'}}
    ]
  }
];

export const parashot: Parasha[] = parashaBooks.flatMap((book) =>
  book.parashot.map((parasha) => ({
    ...parasha,
    book: book.title
  }))
);

export const doubleParashot: Parasha[] = [
  makeDoubleParasha('vayakhel-pekudei', ['vayakhel', 'pekudei'], 22.5),
  makeDoubleParasha('tazria-metzora', ['tazria', 'metzora'], 27.5),
  makeDoubleParasha('achrei-mot-kedoshim', ['achrei-mot', 'kedoshim'], 29.5),
  makeDoubleParasha('behar-bechukotai', ['behar', 'bechukotai'], 32.5),
  makeDoubleParasha('chukat-balak', ['chukat', 'balak'], 39.5),
  makeDoubleParasha('matot-masei', ['matot', 'masei'], 42.5),
  makeDoubleParasha('nitzavim-vayelech', ['nitzavim', 'vayelech'], 51.5)
];

export const routableParashot: Parasha[] = [...parashot, ...doubleParashot];

function makeDoubleParasha(
  id: string,
  combinedParashaIds: [string, string],
  order: number
): Parasha {
  const first = parashot.find((parasha) => parasha.id === combinedParashaIds[0]);
  const second = parashot.find((parasha) => parasha.id === combinedParashaIds[1]);

  if (!first || !second) {
    throw new Error(`Missing parasha for double parasha group: ${id}`);
  }

  return {
    id,
    order,
    slug: {
      he: `${first.slug.he}-${second.slug.he}`,
      en: `${first.slug.en}-${second.slug.en}`
    },
    title: {
      he: `${first.title.he}-${second.title.he}`,
      en: `${first.title.en}-${second.title.en}`
    },
    book: first.book,
    doubleParashaGroup: id,
    combinedParashaIds
  };
}
