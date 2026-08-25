// One-off generator for the seed video/picture entries (committed content).
// Editorial workflow afterwards happens in Decap CMS (/admin/).
import { writeFileSync, mkdirSync } from 'node:fs';

const y = (v) => JSON.stringify(v);

const videos = [
  {
    slug: 'lemon-potatoes',
    order: 1,
    tag: 'Sides',
    tagEl: 'Κομματάκια',
    posterAlt: 'Placeholder poster: crispy lemon potatoes in a warm pan.',
    posterAltEl: 'Προσωρινή αφίσα: τραγανές πατάτες λεμόνου σε ζεστό τηγάνι.',
    en: [
      'Lemon Potatoes',
      'Crispy, glossy, aggressively lemony — the Sunday roast side that started it all.',
    ],
    el: [
      'Πατάτες λεμόνου',
      'Τραγανές, γυαλιστερές, αρκετά λεμονάτες — το συνοδευτικό της Κυριακής που ξεκίνησε όλα.',
    ],
    tr: 'Placeholder transcript: intro, potatoes going into the pan, the crisp flip, final squeeze of lemon.',
    trEl: 'Προσωρινή απομαγνητοφώνηση: εισαγωγή, πατάτες στο τηγάνι, η αναποδιά, το τελικό λεμόνι.',
  },
  {
    slug: 'village-salad',
    order: 2,
    tag: 'Healthy',
    tagEl: 'Υγιεινό',
    posterAlt: 'Placeholder poster: a village salad with tomatoes, cucumber and feta.',
    posterAltEl: 'Προσωρινή αφίσα: χωριάτικη σαλάτα με ντομάτα, αγγούρι και φέτα.',
    en: [
      'Village Salad',
      'Tomatoes that actually taste like tomatoes, thick feta, no lettuce — obviously.',
    ],
    el: [
      'Χωριάτικη σαλάτα',
      'Ντομάτες που πραγματικά έχουν γεύση ντομάτας, χοντρή φέτα, χωρίς μαρούλι — προφανώς.',
    ],
    tr: 'Placeholder transcript: chopping, salt over the tomatoes, the feta slab, final olive oil pour.',
    trEl: 'Προσωρινή απομαγνητοφώνηση: κόψιμο, αλάτι στις ντομάτες, η φέτα, το ελαιόλαδο.',
  },
  {
    slug: 'baklava',
    order: 3,
    tag: 'Dessert',
    tagEl: 'Γλυκό',
    posterAlt: 'Placeholder poster: a stack of baklava layers with syrup.',
    posterAltEl: 'Προσωρινή αφίσα: στρώσεις μπακλαβά με σιρόπι.',
    en: [
      'Baklava Stack',
      'Forty layers of phyllo, one very serious nut filling, an unreasonably good syrup.',
    ],
    el: [
      'Μπακλαβάς',
      'Σαράντα στρώσεις φύλλου, μια πολύ σομπά γέμιση με ξηρούς καρπούς, ένα εξαιρετικό σιρόπι.',
    ],
    tr: 'Placeholder transcript: layering phyllo, nut filling, cutting diamonds, syrup pour.',
    trEl: 'Προσωρινή απομαγνητοφώνηση: στρώσεις φύλλου, γέμιση, κόψιμο ρόμβων, σιρόπι.',
  },
  {
    slug: 'souvlaki',
    order: 4,
    tag: 'Grill',
    tagEl: 'Ψητό',
    posterAlt: 'Placeholder poster: pork souvlaki skewers over charcoal.',
    posterAltEl: 'Προσωρινή αφίσα: σουβλάκια χοιρινό πάνω σε κάρβουνο.',
    en: [
      'Perfect Souvlaki',
      'Charcoal-kissed pork skewers, warm pita, and the tzatziki-to-meat ratio debate.',
    ],
    el: [
      'Τέλειο σουβλάκι',
      'Σουβλάκια από κάρβουνο, ζεστό πίτα, και η συζήτηση για την αναλογία τζατζίκι-κρέας.',
    ],
    tr: 'Placeholder transcript: marinating, skewering, the grill, the wrap.',
    trEl: 'Προσωρινή απομαγνητοφώνηση: μαρινάρισμα, σουβλίσματα, ψήσιμο, τύλιγμα.',
  },
  {
    slug: 'moussaka',
    order: 5,
    tag: 'Cooking',
    tagEl: 'Μαγείρεμα',
    posterAlt: 'Placeholder poster: a moussaka portion with bubbling béchamel.',
    posterAltEl: 'Προσωρινή αφίσα: μερίδα μουσακά με αφρισμένη μπεσαμέλ.',
    en: [
      'Moussaka Reimagined',
      'The classic, rebuilt layer by layer — with a béchamel that refuses to crack.',
    ],
    el: [
      'Μουσακάς επανεξετασμένος',
      'Το κλασικό, ξαναχτισμένο στρώση-στρώση — με μπεσαμέλ που δεν σπάει.',
    ],
    tr: 'Placeholder transcript: frying aubergine, the meat sauce, béchamel, the rest before slicing.',
    trEl: 'Προσωρινή απομαγνητοφώνηση: τηγάνισμα μελιτζάνας, κρέας, μπεσαμέλ, ξεκούραστο, κόψιμο.',
  },
  {
    slug: 'tsoureki',
    order: 6,
    tag: 'Recipes',
    tagEl: 'Συνταγές',
    posterAlt: 'Placeholder poster: a braided tsoureki with a glossy crust.',
    posterAltEl: 'Προσωρινή αφίσα: πλεκτό τσουρέκι με γυαλιστερή κόρα.',
    en: [
      'Traditional Tsoureki',
      'A soft, stringy Easter bread — mahlepi, patience, and one very forgiving dough.',
    ],
    el: [
      'Παραδοσιακό τσουρέκι',
      'Ένα αφράτο, νηστίσιμο ψωμί του Πάσχα — μαχλέπι, υπομονή, και μια πολύ δεκτική ζύμη.',
    ],
    tr: 'Placeholder transcript: proofing, braiding, egg wash, the pull-apart shot.',
    trEl: 'Προσωρινή απομαγνητοφώνηση: φούσκωμα, πλέξιμο, αυγολέπιο, το άνοιγμα σε νήματα.',
  },
];

const pictures = [
  {
    slug: 'sunset-dinner',
    order: 1,
    tag: 'Lifestyle',
    tagEl: 'Lifestyle',
    alt: 'Placeholder image: a dinner table at sunset in warm light.',
    altEl: 'Προσωρινή εικόνα: τραπέζι σε ηλιοβασίλεμα με ζεστό φως.',
    en: ['Sunset Dinner', 'Long table, longer conversations.'],
    el: ['Δείπνο με ηλιοβασίλεμα', 'Μεγάλο τραπέζι, ακόμα μεγαλύτερες συζητήσεις.'],
  },
  {
    slug: 'seafood-platter',
    order: 2,
    tag: 'Editorial',
    tagEl: 'Εκδοτικό',
    alt: 'Placeholder image: a seafood platter with ice and lemons.',
    altEl: 'Προσωρινή εικόνα: πιατέλα θαλασσινών με πάγο και λεμόνια.',
    en: ['Seafood Platter', 'Straight off the boat energy.'],
    el: ['Θαλασσινά', 'Κατευθείαν από τη βάρκα.'],
  },
  {
    slug: 'fig-harvest',
    order: 3,
    tag: 'Portrait',
    tagEl: 'Πορτρέτο',
    alt: 'Placeholder image: hands holding freshly picked figs.',
    altEl: 'Προσωρινή εικόνα: χέρια που κρατούν φρέσκα σύκα.',
    en: ['Summer Fig Harvest', 'August in a palm.'],
    el: ['Σύκα Αυγούστου', 'Ο Αύγουστος σε μια παλάμη.'],
  },
  {
    slug: 'fresh-herbs',
    order: 4,
    tag: 'Product',
    tagEl: 'Προϊόν',
    alt: 'Placeholder image: bundles of fresh herbs on a counter.',
    altEl: 'Προσωρινή εικόνα: μάτσα φρέσκων μυρωδικών στον πάγκο.',
    en: ['Fresh Herbs', 'The real MVPs of the kitchen.'],
    el: ['Φρέσκα μυρωδικά', 'Οι πραγματικοί πρωταγωνιστές της κουζίνας.'],
  },
  {
    slug: 'olive-grove',
    order: 5,
    tag: 'Landscape',
    tagEl: 'Τοπίο',
    alt: 'Placeholder image: an olive grove on a hillside.',
    altEl: 'Προσωρινή εικόνα: ελαιώνας σε πλαγιά.',
    en: ['Olive Grove', 'Where the good oil begins.'],
    el: ['Ελαιώνας', 'Εκεί που ξεκινά το καλό λάδι.'],
  },
  {
    slug: 'prep-session',
    order: 6,
    tag: 'BTS',
    tagEl: 'Πίσω από τις κάμερες',
    alt: 'Placeholder image: a messy prep session with bowls and knives.',
    altEl: 'Προσωρινή εικόνα: προετοιμασία με μπολ και μαχαίρια.',
    en: ['Prep Session', 'The honest mess behind the frame.'],
    el: ['Προετοιμασία', 'Η ειλικρινής ακαταστασία πίσω από το καρέ.'],
  },
];

const fm = (obj) =>
  '---\n' +
  Object.entries(obj)
    .map(([k, v]) => `${k}: ${y(v)}`)
    .join('\n') +
  '\n---\n';

mkdirSync('src/content/videos/en', { recursive: true });
mkdirSync('src/content/videos/el', { recursive: true });
mkdirSync('src/content/pictures/en', { recursive: true });
mkdirSync('src/content/pictures/el', { recursive: true });

for (const v of videos) {
  writeFileSync(
    `src/content/videos/en/${v.slug}.md`,
    fm({
      title: v.en[0],
      description: v.en[1],
      order: v.order,
      video: `/media/videos/${v.slug}.mp4`,
      poster: `/media/posters/${v.slug}.svg`,
      posterAlt: v.posterAlt,
      transcript: v.tr,
      tag: v.tag,
      draft: false,
    }),
  );
  writeFileSync(
    `src/content/videos/el/${v.slug}.md`,
    fm({
      title: v.el[0],
      description: v.el[1],
      order: v.order,
      video: `/media/videos/${v.slug}.mp4`,
      poster: `/media/posters/${v.slug}.svg`,
      posterAlt: v.posterAltEl,
      transcript: v.trEl,
      tag: v.tagEl,
      draft: false,
    }),
  );
}
for (const p of pictures) {
  writeFileSync(
    `src/content/pictures/en/${p.slug}.md`,
    fm({
      title: p.en[0],
      description: p.en[1],
      order: p.order,
      image: `/media/gallery/${p.slug}.svg`,
      imageAlt: p.alt,
      tag: p.tag,
      draft: false,
    }),
  );
  writeFileSync(
    `src/content/pictures/el/${p.slug}.md`,
    fm({
      title: p.el[0],
      description: p.el[1],
      order: p.order,
      image: `/media/gallery/${p.slug}.svg`,
      imageAlt: p.altEl,
      tag: p.tagEl,
      draft: false,
    }),
  );
}
console.log('entry seeds written:', videos.length * 2, 'videos,', pictures.length * 2, 'pictures');
