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
  },
  contact: {
    methodsTitle: 'Ways to reach me',
    socialsTitle: 'Follow along',
    ctaFallback: 'Get in touch',
  },
  footer: {
    allRightsReserved: 'All rights reserved.',
    howToUse: 'How to use this landing page',
  },
  howToUse: {
    title: 'How to use this landing page',
    intro:
      'This landing page is fully content-managed: everything you see is edited through the bundled CMS, not in code.',
    sections: [
      {
        heading: 'Editing content',
        body: 'Open /admin/ and sign in with the configured Git provider. Every section (hero, videos, pictures, about, analytics, contact) is a CMS entry with separate English and Greek fields. Save + publish commits the change to this repository and triggers a rebuild.',
      },
      {
        heading: 'Sections, order and layout',
        body: 'The “Site settings & section order” entry enables, disables and reorders sections, and sets the videos/pictures layout to grid or horizontal scroll — no code changes needed.',
      },
      {
        heading: 'Media',
        body: 'Videos, posters and images are uploaded through the CMS media library. Portrait videos use a stable 9:16 frame; pictures are optimized automatically and switch from black & white to colour on hover or keyboard focus.',
      },
      {
        heading: 'Developers',
        body: 'The site is an Astro + Tailwind project. Run “npm run dev” for the local server, “npm run test:e2e” for end-to-end and accessibility tests, and “just build” for the production image.',
      },
    ],
    backHome: 'Back to the landing page',
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
  },
  contact: {
    methodsTitle: 'Τρόποι επικοινωνίας',
    socialsTitle: 'Ακολουθήστε με',
    ctaFallback: 'Επικοινωνία',
  },
  footer: {
    allRightsReserved: 'Με επιφύλαξη παντός δικαιώματος.',
    howToUse: 'Πώς να χρησιμοποιήσετε αυτή τη σελίδα',
  },
  howToUse: {
    title: 'Πώς να χρησιμοποιήσετε αυτή τη σελίδα',
    intro:
      'Αυτή η σελίδα διαχειρίζεται πλήρως μέσω περιεχομένου: ό,τι βλέπετε επεξεργάζεται από το ενσωματωμένο CMS, όχι από κώδικα.',
    sections: [
      {
        heading: 'Επεξεργασία περιεχομένου',
        body: 'Ανοίξτε το /admin/ και συνδεθείτε με τον διαμορφωμένο πάροχο Git. Κάθε ενότητα (πρωτότυπο, βίντεο, φωτογραφίες, περί, αναλυτικά στοιχεία, επικοινωνία) είναι εγγραφή CMS με ξεχωριστά πεδία για Αγγλικά και Ελληνικά. Η αποθήκευση και δημοσίευση καταγράφει την αλλαγή σε αυτό το αποθετήριο και ενεργοποιεί επανακατασκευή.',
      },
      {
        heading: 'Ενότητες, σειρά και διάταξη',
        body: 'Η εγγραφή «Ρυθμίσεις ιστοσελίδας & σειρά ενοτήτων» ενεργοποιεί, απενεργοποιεί και αναδιατάσσει τις ενότητες, και ορίζει τη διάταξη βίντεο/φωτογραφιών σε πλέγμα ή οριζόντια κύλιση — χωρίς αλλαγές σε κώδικα.',
      },
      {
        heading: 'Πολυμέσα',
        body: 'Βίντεο, αφίσες και εικόνες ανεβαίνουν μέσω της βιβλιοθήκης πολυμέσων του CMS. Τα κατακόρυφα βίντεο χρησιμοποιούν σταθερή αναλογία 9:16· οι φωτογραφίες βελτιστοποιούνται αυτόματα και αλλάζουν από ασπρόμαυρες σε έγχρωμες με ποντίκι ή εστίαση πληκτρολογίου.',
      },
      {
        heading: 'Για προγραμματιστές',
        body: 'Ο ιστότοπος είναι ένα έργο Astro + Tailwind. Εκτελέστε «npm run dev» για τον τοπικό διακομιστή, «npm run test:e2e» για δοκιμές end-to-end και προσβασιμότητας, και «just build» για την εικόνα παραγωγής.',
      },
    ],
    backHome: 'Πίσω στην κεντρική σελίδα',
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
