# CVPilot — Project Context File
> Paste this at the start of every new Claude chat to restore full project context.

---

## App Overview
- **App Name:** CVPilot
- **Tagline:** Build Smarter Resumes with AI
- **Platform:** Android (Google Play Store) — also tested on iOS
- **Type:** AI-powered Resume Builder + Resume Analyzer
- **Primary Users:** Students (all fields — CS, MBA, BBA, Arts, Commerce, Science)
- **Current Version:** V1 (in development)

---

## Tech Stack

### Frontend
- React Native Expo
- Expo Router (file-based routing)
- Zustand (state management)
- expo-secure-store (token persistence)
- react-native-safe-area-context
- @react-navigation/native
- react-native-svg
- Ionicons (@expo/vector-icons)
- react-native-webview (for resume preview)
- expo-print (for PDF export)
- expo-sharing (for PDF sharing)

### Backend
- Node.js + Express.js
- MongoDB Atlas (free cluster named "cvpilot")
- Mongoose
- JWT Authentication (30 day tokens)
- bcryptjs (password hashing)
- dotenv, cors

### Hosting
- Backend deployed on Render
- Live URL: https://cvpilot-backend-sxut.onrender.com
- MongoDB Atlas cluster: cvpilot.ypbsh6v.mongodb.net

---

## Design System (constants/theme.js)

### Colors
```js
bgRoot: "#050608"
bgBase: "#07080B"
accentGreen: "#4ADE80"
accentGreenGlow: "#22C55E"
accentTealGlow: "#10B981"
brandMint: "#76F6D1"
brandMintText: "#BFF9EA"
dotRed: "#FF3B30"
white: "#FFFFFF"
cardBg04: "rgba(255,255,255,0.04)"
cardBorder07: "rgba(255,255,255,0.07)"
inputBg05: "rgba(255,255,255,0.05)"
inputBorder08: "rgba(255,255,255,0.08)"
inputFocusBorder45: "rgba(74,222,128,0.45)"
inputFocusBg04: "rgba(74,222,128,0.04)"
inputIconDefault: "#555555"
inputPlaceholder: "#3A3A3A"
textWhite70/60/55/45/40/32/30
mintBg09/10, mintBorder24/28
buttonIconBg15: "rgba(5,6,8,0.15)"
googleBorder10: "rgba(255,255,255,0.10)"
vignette: "#000"
```

### Spacing (xs=8 to 7xl=40)
### Radii (sm=12, md=14, lg=20, xl=50, round=999)
### Typography (xs=11.5 to brandHome=34)
### Shadows (greenButton, greenButtonCompact, redDot)

---

## Folder Structure

```
CVPilot/
├── app/
│   ├── (auth)/
│   │   ├── _layout.js
│   │   ├── sign-in.js
│   │   └── signup.js
│   ├── (drawer)/
│   │   ├── (tabs)/
│   │   │   ├── _layout.js
│   │   │   ├── home.js
│   │   │   ├── builder/
│   │   │   │   ├── _layout.js        ← dynamic Stack, auto-registers all screens
│   │   │   │   ├── index.js          ← Builder section list + progress bar
│   │   │   │   ├── personal.js       ← Personal Info form
│   │   │   │   ├── experience.js     ← Work Experience form
│   │   │   │   ├── education.js      ← Education form
│   │   │   │   ├── skills.js         ← Skills form (chip-based)
│   │   │   │   ├── projects.js       ← Projects form
│   │   │   │   ├── certifications.js ← Certifications form
│   │   │   │   ├── achievements.js   ← Achievements form
│   │   │   │   ├── extracurricular.js← Extracurricular form
│   │   │   │   ├── volunteer.js      ← Volunteer Work form
│   │   │   │   ├── publications.js   ← Publications form
│   │   │   │   ├── languages.js      ← Languages form
│   │   │   │   ├── training.js       ← Training & Workshops form
│   │   │   │   ├── interests.js      ← Interests & Hobbies (chip-based)
│   │   │   │   └── preview.js        ← Resume Preview (WebView + PDF export)
│   │   │   ├── analyzer.js
│   │   │   ├── templates.js
│   │   │   └── profile.js
│   │   ├── _layout.js
│   │   ├── logout.js
│   │   ├── privacy-policy.js
│   │   ├── saved-resumes.js          ← Saved Resumes screen (done)
│   │   ├── settings.js
│   │   └── terms-of-service.js
│   ├── _layout.js
│   └── index.js                      ← Splash screen
├── assets/
│   └── images/
│       └── cvlogoo.png               ← App logo (transparent PNG)
├── components/
│   ├── AppHeader.js
│   ├── MainDrawerContent.js
│   └── PlaceholderScreenBody.js
├── constants/
│   ├── api.js                        ← API endpoints
│   └── theme.js                      ← Design system
├── context/
│   └── AuthContext.js                ← Auth state, signIn, signOut
├── hooks/
│   └── useAuth.js                    ← useContext wrapper for AuthContext
├── services/
│   ├── storage.js                    ← SecureStore helpers (TOKEN_KEY = "cvpilot_auth_token")
│   ├── resumeService.js              ← Raw API calls (create, get, update, delete)
│   └── resumeSyncService.js          ← High-level sync (load, save, delete from backend)
└── store/
    └── resumeStore.js                ← Zustand resume store
```

---

## Navigation Structure
- **Splash** (index.js) → Get Started → Sign In
- **Auth flow:** Sign In ↔ Sign Up
- **Main app:** Drawer wraps Tabs
- **Bottom Tabs:** Home, Builder, Analyzer, Templates, Profile
- **Drawer:** Saved Resumes, Settings, Terms, Privacy Policy, Logout
- **Builder sub-routes:** personal, experience, education, skills, projects,
  certifications, achievements, extracurricular, volunteer, publications,
  languages, training, interests, preview

---

## Auth System
- JWT token saved to SecureStore with key: `"cvpilot_auth_token"`
- User profile saved with key: `"cvpilot_auth_user"`
- `AuthContext.js` provides: `user`, `token`, `isAuthenticated`, `isLoading`, `signIn`, `signOut`
- `useAuth()` hook wraps the context
- Token persists across app restarts via `getToken()` from `services/storage.js`

---

## Backend API Endpoints
```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me           ← protected

POST   /api/resumes           ← create resume
GET    /api/resumes           ← get all user resumes
GET    /api/resumes/:id       ← get one resume
PUT    /api/resumes/:id       ← update resume
DELETE /api/resumes/:id       ← delete resume
```

### constants/api.js
```js
export const API_BASE_URL = "https://cvpilot-backend-sxut.onrender.com";
export const ENDPOINTS = {
  signup: `${API_BASE_URL}/api/auth/signup`,
  login:  `${API_BASE_URL}/api/auth/login`,
  me:     `${API_BASE_URL}/api/auth/me`,
  resumes: `${API_BASE_URL}/api/resumes`,
  resume: (id) => `${API_BASE_URL}/api/resumes/${id}`,
};
```

---

## State Management (Zustand)

### store/resumeStore.js — Full Schema
```js
const emptyResume = {
  id: null,
  meta: { title, templateId, themeColor, fontFamily },
  personal: { fullName, jobTitle, email, phone, location, linkedin, github, website, summary },
  experience: [],      // { id, company, role, location, startDate, endDate, current, description }
  education: [],       // { id, institution, board, degree, field, startDate, endDate, current, grade, activities }
  skills: [],          // { id, name, level: "beginner"|"intermediate"|"expert" }
  projects: [],        // { id, title, role, organization, startDate, endDate, current, technologies, url, teamSize, description }
  certifications: [],  // { id, name, issuer, issueDate, expiryDate, noExpiry, credentialId, credentialUrl }
  languages: [],       // { id, name, proficiency: "basic"|"conversational"|"fluent" }
  achievements: [],    // { id, title, issuer, date, description }
  extracurricular: [], // { id, title, organization, role, startDate, endDate, description }
  volunteer: [],       // { id, title, organization, role, startDate, endDate, description }
  publications: [],    // { id, title, publisher, authors, date, url, description }
  training: [],        // { id, title, organization, date, description }
  interests: [],       // { id, name }
  atsScore: null,
  lastAnalyzed: null,
};
```

### Store Actions Available
```js
// Meta
updateMeta(fields)

// Personal
updatePersonal(fields)

// Experience
addExperience(item), updateExperience(id, fields), removeExperience(id)

// Education
addEducation(item), updateEducation(id, fields), removeEducation(id)

// Skills
addSkill(item), removeSkill(id)

// Projects
addProject(item), updateProject(id, fields), removeProject(id)

// Certifications
addCertification(item), updateCertification(id, fields), removeCertification(id)

// Interests
updateInterests(items)  ← replaces entire array

// Achievements
addAchievement(item), updateAchievement(id, fields), removeAchievement(id)

// Extracurricular
addExtracurricular(item), updateExtracurricular(id, fields), removeExtracurricular(id)

// Volunteer
addVolunteer(item), updateVolunteer(id, fields), removeVolunteer(id)

// Publications
addPublication(item), updatePublication(id, fields), removePublication(id)

// Training
addTraining(item), updateTraining(id, fields), removeTraining(id)

// Languages
addLanguage(item), updateLanguage(id, fields), removeLanguage(id)

// Resume list
setResumes(list), addToResumes(resume), updateInResumes(id, updated), removeFromResumes(id)

// State
markSaved(), setSaving(val), setAtsScore(score)
createNewResume(), loadResume(resume), resetStore()
```

---

## Backend Connect — services/resumeSyncService.js
```js
loadResumesFromBackend()       // loads all resumes, sets activeResume to most recent
saveActiveResumeToBackend()    // creates or updates active resume on backend
deleteResumeFromBackend(id)    // deletes from backend + updates store
createNewResumeOnBackend(title)// creates new resume on backend + navigates
```

**How to call save in any builder screen:**
```js
import { saveActiveResumeToBackend } from "../../../../services/resumeSyncService";

// inside handleSave, after markSaved():
saveActiveResumeToBackend();
```

---

## Builder Screens — Completed

| Section | File | Type | Status |
|---|---|---|---|
| Personal Info | personal.js | Form | ✅ Done |
| Work Experience | experience.js | Cards | ✅ Done |
| Education | education.js | Cards | ✅ Done |
| Skills | skills.js | Chips + suggestions | ✅ Done |
| Projects | projects.js | Cards | ✅ Done |
| Certifications | certifications.js | Cards + suggestions | ✅ Done |
| Achievements | achievements.js | Cards | ✅ Done |
| Extracurricular | extracurricular.js | Cards | ✅ Done |
| Volunteer Work | volunteer.js | Cards | ✅ Done |
| Publications | publications.js | Cards | ✅ Done |
| Languages | languages.js | Cards + proficiency | ✅ Done |
| Training & Workshops | training.js | Cards | ✅ Done |
| Interests & Hobbies | interests.js | Chips + suggestions | ✅ Done |
| Resume Preview | preview.js | WebView + PDF | ✅ Done |

---

## Key Technical Decisions

### Builder Screens
- **No maxHeight animation** — use conditional rendering for expandable cards
- **handleRemove fix** — always call store action + markSaved() immediately on delete
- **Chip screens** (skills, interests) — call store action immediately on chip remove, no need to press Save
- **Card screens** (all others) — Save button syncs to store + backend
- **Progress bar** — uses `useFocusEffect` + `forceUpdate` + `useResumeStore.getState()` for live updates

### Navigation
- Builder navigation: `router.push('/(drawer)/(tabs)/builder/${sectionId}')`
- Drawer open: `navigation.dispatch(DrawerActions.openDrawer())`
- Home screen header: custom (headerShown: false on home tab)
- Builder _layout.js: dynamic Stack (no explicit screen names needed)

### Auth
- Token key: `"cvpilot_auth_token"`
- User key: `"cvpilot_auth_user"`

### Import Paths
- From `builder/` folder: `../../../../constants/theme`
- From `builder/` folder: `../../../../store/resumeStore`
- From `builder/` folder: `../../../../services/resumeSyncService`
- From `(drawer)/` folder: `../../constants/theme`
- From `(drawer)/` folder: `../../services/resumeSyncService`

---

## Overall Progress

| Area | Progress |
|---|---|
| Splash Screen | ✅ 100% |
| Auth (Sign In/Up) | ✅ 100% |
| Backend Auth APIs | ✅ 100% |
| Backend Resume APIs | ✅ 100% |
| Backend Deployed (Render) | ✅ 100% |
| Session Persistence | ✅ 100% |
| Theme System | ✅ 100% |
| Navigation | ✅ 100% |
| Zustand Store | ✅ 100% |
| Home Dashboard | ✅ 90% (needs real data hookup) |
| Resume Builder UI — All 13 sections | ✅ 100% |
| Resume Preview (Classic HTML template) | ✅ 100% |
| PDF Export (expo-print + expo-sharing) | ✅ 100% |
| Backend Connect (save/load/delete) | ✅ 100% |
| Saved Resumes Screen | ✅ 100% |
| Templates Screen | ❌ 0% |
| 15 Resume Templates | ❌ 0% |
| ATS Analyzer | ❌ 0% |
| Job Match | ❌ 0% |
| AI Bullet Suggestions | ❌ 0% |
| Profile Screen | ❌ 0% |
| Settings Screen | ❌ 0% |
| Logout | ❌ 0% |
| Auto-load resume on app open | ❌ 0% |
| Play Store Prep | ❌ 0% |

**Overall: ~70% complete**

---

## What Needs to Be Built Next (In Order)

### 1. Auto-load Resume on App Open (15 mins)
Add to `app/_layout.js` or `home.js`:
```js
import { loadResumesFromBackend } from "../services/resumeSyncService";
useEffect(() => { loadResumesFromBackend(); }, []);
```

### 2. Templates Screen + 15 Resume Templates
Full details below ↓

### 3. Profile Screen
- Edit name, email, profile photo
- Read from `AuthContext` user object

### 4. Settings + Logout
- Logout: call `signOut()` from `useAuth()`, then `router.replace("/sign-in")`
- Settings: theme toggle, notifications

### 5. ATS Analyzer (AI Feature)
- User pastes job description
- App compares resume vs job description
- Shows ATS score, missing keywords, suggestions
- Uses Claude API or OpenAI API

### 6. Play Store Prep
- App signing
- Privacy policy page (already in drawer)
- Store listing, screenshots, icon

---

## Templates Plan (15 Total)

### Approach
- **HTML + CSS rendered in WebView** (same as current preview.js)
- Same data from Zustand store, different HTML/CSS templates
- PDF export works for all templates (expo-print)
- User picks template in Templates Screen → stored in `activeResume.meta.templateId`

---

### Category 1 — Classic (5 templates) — CS / IT / Engineering
**No profile photo on any. Black/dark grey only. ATS-friendly.**

| ID | Name | Style |
|---|---|---|
| `classic-clean` | Classic Clean | Single column, Georgia serif, centered header, minimal |
| `classic-pro` | Classic Pro | Subtle grey header band, clean dividers |
| `classic-bold` | Classic Bold | Strong typography, thick section title underlines |
| `classic-compact` | Classic Compact | Dense layout, smaller font, fits more content |
| `classic-ats` | Classic ATS | Ultra-minimal, zero design, pure ATS optimization |

---

### Category 2 — Modern (5 templates) — MBA / BBA / Marketing / Sales
**Optional profile photo. Color picker (5 colors). Two-column layouts.**

| ID | Name | Style |
|---|---|---|
| `modern-sidebar` | Modern Sidebar | Two-column, color sidebar left, photo top of sidebar |
| `modern-top` | Modern Top | Bold color header band, single column body |
| `modern-card` | Modern Card | Sections in subtle cards, clean white space |
| `modern-minimal` | Modern Minimal | Lots of whitespace, elegant thin typography |
| `modern-bold` | Modern Bold | Strong color accents, section icons |

**Color options per Modern template (stored in meta.themeColor):**
- `#4ADE80` — Mint Green
- `#60A5FA` — Ocean Blue
- `#F472B6` — Rose Pink
- `#FBBF24` — Amber Gold
- `#A78BFA` — Soft Purple

---

### Category 3 — Creative (5 templates) — Design / Arts / Media / HR
**Profile photo included. Bold colors. Unique layouts.**

| ID | Name | Style |
|---|---|---|
| `creative-splash` | Creative Splash | Full color header, large name, bold personality |
| `creative-timeline` | Creative Timeline | Timeline-style experience section |
| `creative-grid` | Creative Grid | Grid-based skills + two-column layout |
| `creative-dark` | Creative Dark | Dark header background, light body |
| `creative-portfolio` | Creative Portfolio | Portfolio-style, project-first layout |

---

### Templates Screen UI Flow
```
Templates Screen
├── Category Tabs: [Classic] [Modern] [Creative]
├── Horizontal scroll of template thumbnail cards
│   ├── Each card: mini preview image + template name
│   └── Selected card has green border
├── Color picker row (Modern + Creative only)
├── Photo toggle (Modern + Creative only)
└── [Use This Template] green button
    └── saves templateId + themeColor to activeResume.meta
        └── navigates to Preview screen
```

---

## ATS Analyzer Plan

### What It Does
1. User pastes job description
2. App reads `activeResume` from Zustand
3. Sends both to Claude API or OpenAI
4. Returns:
   - ATS Score (0-100)
   - Missing keywords
   - Matched keywords
   - Section-by-section suggestions
   - Overall verdict

### API to Use
- **Claude API** (Anthropic) — recommended
- Model: `claude-sonnet-4-20250514`
- Called from frontend using fetch to Anthropic API

---

## Key Rules for All Future Code
1. Use ONLY theme.js values — no hardcoded colors/spacing/sizes
2. Use conditional rendering for expandable cards (not maxHeight animation)
3. All builder form screens follow the same pattern as experience.js
4. `paddingBottom: insets.bottom + 60` on all ScrollView contentContainerStyle
5. Import paths from `builder/` folder: `../../../../constants/theme`
6. Import paths from `builder/` folder: `../../../../store/resumeStore`
7. Import paths from `builder/` folder: `../../../../services/resumeSyncService`
8. Import paths from `(drawer)/` folder: `../../constants/theme`
9. **handleRemove in all card screens** must call store action + `markSaved()` immediately
10. **Chip screens** (skills, interests) must call store action immediately on remove
11. Always call `saveActiveResumeToBackend()` after `markSaved()` in every builder screen Save button
12. Drawer open: `navigation.dispatch(DrawerActions.openDrawer())`
13. Never use `SafeAreaView` from react-native — use `react-native-safe-area-context`

---

## Environment Variables (Backend .env)
```
PORT=3000
MONGODB_URI=mongodb+srv://shanu21215shanu_db_user:TqwkYD9NtmnvXnLM@cvpilot.ypbsh6v.mongodb.net/cvpilot?appName=CVPilot
JWT_SECRET=cvpilot_super_secret_jwt_key_2024
```

---

## Backend Folder Structure
```
cvpilot-backend/
├── config/db.js
├── controllers/
│   ├── authController.js     ← signup, login, getMe
│   └── resumeController.js   ← CRUD for resumes
├── models/
│   ├── User.js
│   └── Resume.js             ← full resume schema
├── routes/
│   ├── authRoutes.js
│   └── resumeRoutes.js
├── middleware/
│   └── authMiddleware.js     ← JWT protect middleware
├── server.js
└── .env
```

---

## Render Deployment
- Backend GitHub repo: https://github.com/ErrorInshanu/cvpilot-backend
- Live URL: https://cvpilot-backend-sxut.onrender.com
- Free tier spins down after 15 min — use UptimeRobot to keep alive
- Deploy: push to main branch → Render auto-deploys