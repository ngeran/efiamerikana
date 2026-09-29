import type { Locale } from './config';

const en = {
  skipToContent: 'Skip to content',
  mainNav: 'Main navigation',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  languageSwitch: 'Language',
  switchToLocale: 'Switch to English',
  emailAria: 'Send an email',
  emailLabel: 'Email me',
  wordmark: 'efiamerikana',
  hero: {
    tickerLabel: 'Social media',
    viewPortfolio: 'view my portfolio',
  },
  video: {
    play: 'Play video',
    pause: 'Pause video',
    mute: 'Mute',
    unmute: 'Unmute',
    showDetails: 'Show video details',
    hideDetails: 'Hide video details',
    transcript: 'Transcript',
    railLabel: 'Videos, horizontally scrollable',
    prev: 'Scroll videos back',
    next: 'Scroll videos forward',
    previewHint: 'Hover to preview · click to play',
  },
  pictures: {
    showDescription: 'Show picture description',
    hideDescription: 'Hide picture description',
    railLabel: 'Pictures, horizontally scrollable',
    prev: 'Scroll pictures back',
    next: 'Scroll pictures forward',
  },
  analytics: {
    disclosure: 'Placeholder metrics — replace them with real data in the CMS.',
    ratiosTitle: 'Performance ratios',
    velocityTitle: 'Audience velocity',
  },
  contact: {
    methodsTitle: 'Ways to reach me',
    socialsTitle: 'Follow along',
    ctaFallback: 'Get in touch',
  },
  footer: {
    allRightsReserved: 'All rights reserved.',
  },
  notFound: {
    title: 'Page not found',
    body: 'The page you are looking for does not exist or has been moved.',
    backHome: 'Back to the landing page',
  },
};

export type UIStrings = typeof en;

const el: UIStrings = {
  skipToContent: 'Μετάβαση στο περιεχόμενο',
  mainNav: 'Κύρια πλοήγηση',
  openMenu: 'Άνοιγμα μενού',
  closeMenu: 'Κλείσιμο μενού',
  languageSwitch: 'Γλώσσα',
  switchToLocale: 'Αλλαγή στα Ελληνικά',
  emailAria: 'Στείλτε email',
  emailLabel: 'Στείλτε μου email',
  wordmark: 'efiamerikana',
  hero: {
    tickerLabel: 'Κοινωνικά δίκτυα',
    viewPortfolio: 'δείτε το portfolio μου',
  },
  video: {
    play: 'Αναπαραγωγή βίντεο',
    pause: 'Παύση βίντεο',
    mute: 'Σίγαση',
    unmute: 'Άνοιγμα ήχου',
    showDetails: 'Εμφάνιση λεπτομερειών βίντεο',
    hideDetails: 'Απόκρυψη λεπτομερειών βίντεο',
    transcript: 'Απομαγνητοφώνηση',
    railLabel: 'Βίντεο, οριζόντια κύλιση',
    prev: 'Κύλιση βίντεο πίσω',
    next: 'Κύλιση βίντεο μπροστά',
    previewHint: 'Προεπισκόπηση με ποντίκι · αναπαραγωγή με κλικ',
  },
  pictures: {
    showDescription: 'Εμφάνιση περιγραφής φωτογραφίας',
    hideDescription: 'Απόκρυψη περιγραφής φωτογραφίας',
    railLabel: 'Φωτογραφίες, οριζόντια κύλιση',
    prev: 'Κύλιση φωτογραφιών πίσω',
    next: 'Κύλιση φωτογραφιών μπροστά',
  },
  analytics: {
    disclosure: 'Δείκτες προσωρινοί — αντικαταστήστε τους με πραγματικά δεδομένα στο CMS.',
    ratiosTitle: 'Δείκτες απόδοσης',
    velocityTitle: 'Ρυθμός ανάπτυξης κοινού',
  },
  contact: {
    methodsTitle: 'Τρόποι επικοινωνίας',
    socialsTitle: 'Ακολουθήστε με',
    ctaFallback: 'Επικοινωνία',
  },
  footer: {
    allRightsReserved: 'Με επιφύλαξη παντός δικαιώματος.',
  },
  notFound: {
    title: 'Η σελίδα δεν βρέθηκε',
    body: 'Η σελίδα που αναζητάτε δεν υπάρχει ή έχει μετακινηθεί.',
    backHome: 'Πίσω στην κεντρική σελίδα',
  },
};

// `el` is typed as UIStrings, so both dictionaries must keep exactly the
// same shape (additionally verified at runtime by tests/unit/ui.test.ts).
export const ui: Record<Locale, UIStrings> = { en, el };

export function translator(locale: Locale): UIStrings {
  return ui[locale];
}
