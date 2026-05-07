const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyA3PFKO5piv3RM3f9PtaAleYA_g7TOLxYk",
  authDomain:        "spdly-website.firebaseapp.com",
  projectId:         "spdly-website",
  storageBucket:     "spdly-website.firebasestorage.app",
  messagingSenderId: "272994532908",
  appId:             "1:272994532908:web:8852742525c619c1cbdb89",
  measurementId:     "G-NEDDRR1XT7"
};

// ─── Firestore collection/document paths ──────────────────────────────
// You can rename these but they must match what the admin dashboard uses.
const DB_PATHS = {
  CONFIG:       'portfolio/config',        // site-wide config (meta, SEO)
  PROJECTS:     'portfolio/projects',      // projects array
  EXPERIENCE:   'portfolio/experience',    // experience / timeline
  RESEARCH:     'portfolio/research',      // research cards
  EDUCATION:    'portfolio/education',     // education entries
  PRESENTATIONS:'portfolio/presentations', // presentations & training
  SKILLS:       'portfolio/skills',        // skill groups
  CONTACT:      'portfolio/contact',       // contact links
  ABOUT:        'portfolio/about',         // about section text + stats
  TOOLS:        'portfolio/tools',         // tools & utilities organized by domain/field
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FIREBASE_CONFIG, DB_PATHS };
}
