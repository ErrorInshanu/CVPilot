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
- **Overall Progress:** ~85% complete

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
- expo-document-picker (for PDF upload in analyzer)
- expo-file-system/legacy (for reading PDF as base64)

### Backend
- Node.js + Express.js
- MongoDB Atlas (free cluster named "cvpilot")
- Mongoose
- JWT Authentication (30 day tokens)
- bcryptjs (password hashing)
- dotenv, cors
- Gemini API (Google) for ATS analysis

### Hosting
- Backend deployed on Render
- Live URL: https://cvpilot-backend-sxut.onrender.com
- MongoDB Atlas cluster: cvpilot.ypbsh6v.mongodb.net
- UptimeRobot set up to ping every 5 mins (prevents sleeping)

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
│   │   │   │   ├── _layout.js
│   │   │   │   ├── index.js
│   │   │   │   ├── personal.js
│   │   │   │   ├── experience.js
│   │   │   │   ├── education.js
│   │   │   │   ├── skills.js
│   │   │   │   ├── projects.js
│   │   │   │   ├── certifications.js
│   │   │   │   ├── achievements.js
│   │   │   │   ├── extracurricular.js
│   │   │   │   ├── volunteer.js
│   │   │   │   ├── publications.js
│   │   │   │   ├── languages.js
│   │   │   │   ├── training.js
│   │   │   │   ├── interests.js
│   │   │   │   └── preview.js
│   │   │   ├── analyzer.js        ← ATS Analyzer (UI done, testing pending)
│   │   │   ├── templates.js       ← Templates Screen (done)
│   │   │   └── profile.js         ← Profile Screen (done)
│   │   ├── _layout.js
│   │   ├── logout.js
│   │   ├── privacy-policy.js
│   │   ├── saved-resumes.js
│   │   ├── settings.js
│   │   └── terms-of-service.js
│   ├── _layout.js
│   └── index.js
├── assets/
│   └── images/
│       └── cvlogoo.png
├── components/
│   ├── AppHeader.js
│   ├── MainDrawerContent.js
│   └── PlaceholderScreenBody.js
├── constants/
│   ├── api.js                     ← includes analyze endpoint
│   ├── resumeTemplates.js         ← all 5 classic templates
│   └── theme.js
├── context/
│   └── AuthContext.js
├── hooks/
│   └── useAuth.js
├── services/
│   ├── storage.js
│   ├── resumeService.js
│   └── resumeSyncService.js
└── store/
└── resumeStore.js

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
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me           ← protected
POST   /api/resumes           ← create resume
GET    /api/resumes           ← get all user resumes
GET    /api/resumes/:id       ← get one resume
PUT    /api/resumes/:id       ← update resume
DELETE /api/resumes/:id       ← delete resume
POST   /api/analyze           ← Gemini ATS analyzer

### constants/api.js
```js
export const API_BASE_URL = "https://cvpilot-backend-sxut.onrender.com";
export const ENDPOINTS = {
  signup:  `${API_BASE_URL}/api/auth/signup`,
  login:   `${API_BASE_URL}/api/auth/login`,
  me:      `${API_BASE_URL}/api/auth/me`,
  resumes: `${API_BASE_URL}/api/resumes`,
  resume:  (id) => `${API_BASE_URL}/api/resumes/${id}`,
  analyze: `${API_BASE_URL}/api/analyze`,
};
```

---

## State Management (Zustand)

### store/resumeStore.js — Full Schema
```js
const emptyResume = {
  id: null,
  meta: { title, templateId: "classic-clean", themeColor, fontFamily },
  personal: { fullName, jobTitle, email, phone, location, linkedin, github, website, summary },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
  extracurricular: [],
  volunteer: [],
  publications: [],
  training: [],
  interests: [],
  atsScore: null,
  lastAnalyzed: null,
};
```

### loadResume fix (IMPORTANT)
```js
loadResume: (resume) => {
    set({
      activeResume: {
        ...emptyResume,
        ...resume,
        meta: { ...emptyResume.meta, ...resume.meta },
        personal: { ...emptyResume.personal, ...resume.personal },
        experience: resume.experience ?? [],
        education: resume.education ?? [],
        skills: resume.skills ?? [],
        projects: resume.projects ?? [],
        certifications: resume.certifications ?? [],
        languages: resume.languages ?? [],
        achievements: resume.achievements ?? [],
        extracurricular: resume.extracurricular ?? [],
        volunteer: resume.volunteer ?? [],
        publications: resume.publications ?? [],
        training: resume.training ?? [],
        interests: resume.interests ?? [],
      },
      isDirty: false,
    });
  },
```

---

## Templates System

### constants/resumeTemplates.js
All templates live here. Single export: `getTemplate(templateId, resume)`

### 5 Classic Templates (DONE)
| ID | Name | Style | Based On |
|---|---|---|---|
| `classic-clean` | Classic Clean | Left name, grey banner headers, 2-col skills | Image 1 (Daniel Meyer) |
| `classic-bold` | Classic Bold | Centered name, bold caps, full divider | Original preview.js template |
| `classic-pro` | Classic Pro | Bold company+italic role, underline headers, pipe skills | Image 3 (Ahmed Hassan) |
| `classic-compact` | Classic Compact | Centered name, icon contacts, dense layout | Image 5 (Lena Hoffmann) |
| `classic-ats` | Classic ATS | Ultra-minimal, centered, title-case, Arial font | Image 2 (James White) |

### Default template: `classic-clean`

### Modern + Creative (10 templates) — NOT BUILT YET
Coming in v1.1 update after Play Store launch.

### preview.js
```js
const resume = useResumeStore.getState().activeResume;
const templateId = resume?.meta?.templateId || "classic-clean";
const html = getTemplate(templateId, resume);
```

---

## ATS Analyzer

### Backend Route
`POST /api/analyze`
- Accepts: `resumePdfBase64` (base64 string), `jobDescription` (optional string)
- Uses: Gemini `gemini-2.0-flash` model
- Returns: Full JSON analysis

### Analysis Response Structure
```json
{
  "atsScore": 78,
  "verdict": "Good",
  "verdictMessage": "One sentence summary",
  "matchedKeywords": [],
  "missingKeywords": [],
  "grammarIssues": [{ "original": "", "suggestion": "", "reason": "" }],
  "sectionFeedback": { "summary": "", "experience": "", "education": "", "skills": "", "overall": "" },
  "improvements": [],
  "whatToRemove": [],
  "strengths": []
}
```

### Frontend (analyzer.js)
- User picks any PDF from phone via `expo-document-picker`
- Reads as base64 via `expo-file-system/legacy`
- Sends to backend `/api/analyze`
- Shows: Score ring, strengths, keywords, section feedback, grammar issues, improvements, what to remove

### Status
- Backend route: ✅ Done
- Frontend UI: ✅ Done
- Testing: ⚠️ Pending (fix deployed — gemini-2.0-flash + 50mb payload limit)

---

## Backend — services/resumeSyncService.js

### Key fixes applied
- All fetch calls wrapped in inner try/catch
- Null checks on store and resume
- Array check: `Array.isArray(data) ? data : (data?.resumes ?? [])`

```js
// How to call save in any builder screen:
import { saveActiveResumeToBackend } from "../../../../services/resumeSyncService";
saveActiveResumeToBackend(); // call after markSaved()
```

---

## Builder Screens — All Complete ✅

| Section | File | Status |
|---|---|---|
| Personal Info | personal.js | ✅ Done |
| Work Experience | experience.js | ✅ Done |
| Education | education.js | ✅ Done |
| Skills | skills.js | ✅ Done |
| Projects | projects.js | ✅ Done |
| Certifications | certifications.js | ✅ Done |
| Achievements | achievements.js | ✅ Done |
| Extracurricular | extracurricular.js | ✅ Done |
| Volunteer Work | volunteer.js | ✅ Done |
| Publications | publications.js | ✅ Done |
| Languages | languages.js | ✅ Done |
| Training & Workshops | training.js | ✅ Done |
| Interests & Hobbies | interests.js | ✅ Done |
| Resume Preview | preview.js | ✅ Done |

---

## Screens Status

| Screen | Status | Notes |
|---|---|---|
| Splash Screen | ✅ 100% | |
| Sign In | ✅ 100% | |
| Sign Up | ✅ 100% | |
| Home Dashboard | 🔶 60% | Needs real data hookup |
| Builder Index | ✅ 100% | |
| All 13 Builder Sections | ✅ 100% | |
| Resume Preview | ✅ 100% | |
| Templates Screen | ✅ 100% | |
| Analyzer Screen | ✅ 90% | Testing pending |
| Profile Screen | ✅ 100% | |
| Saved Resumes | ✅ 100% | |
| Settings Screen | ❌ 0% | Placeholder only |
| Logout | ✅ 100% | Via Profile screen |
| Privacy Policy | ✅ 100% | |
| Terms of Service | ✅ 100% | |

---

## Key Technical Decisions

### Builder Screens
- No maxHeight animation — use conditional rendering
- handleRemove — always call store action + markSaved() immediately
- Chip screens (skills, interests) — call store action immediately on remove
- Card screens — Save button syncs to store + backend
- Progress bar — uses useFocusEffect + forceUpdate + useResumeStore.getState()

### Navigation
- Builder: `router.push('/(drawer)/(tabs)/builder/${sectionId}')`
- Drawer open: `navigation.dispatch(DrawerActions.openDrawer())`

### Import Paths
- From `builder/`: `../../../../constants/theme`
- From `builder/`: `../../../../store/resumeStore`
- From `builder/`: `../../../../services/resumeSyncService`
- From `(drawer)/`: `../../constants/theme`
- From `(tabs)/`: `../../../constants/theme`
- From `(tabs)/`: `../../../store/resumeStore`
- From `(tabs)/`: `../../../services/resumeSyncService`
- From `(tabs)/`: `../../../constants/api`

### Auth
- Token key: `"cvpilot_auth_token"`
- User key: `"cvpilot_auth_user"`

### Never use SafeAreaView from react-native
Always use `react-native-safe-area-context`

---

## Overall Progress

| Area | Progress |
|---|---|
| Splash Screen | ✅ 100% |
| Auth (Sign In/Up) | ✅ 100% |
| Backend Auth APIs | ✅ 100% |
| Backend Resume APIs | ✅ 100% |
| Backend Analyzer API | ✅ 100% |
| Backend Deployed (Render) | ✅ 100% |
| UptimeRobot (keep alive) | ✅ 100% |
| Session Persistence | ✅ 100% |
| Theme System | ✅ 100% |
| Navigation | ✅ 100% |
| Zustand Store | ✅ 100% |
| Home Dashboard | 🔶 60% |
| Resume Builder UI — All 13 sections | ✅ 100% |
| Resume Preview | ✅ 100% |
| PDF Export | ✅ 100% |
| Backend Connect (save/load/delete) | ✅ 100% |
| Saved Resumes Screen | ✅ 100% |
| Auto-load resume on app open | ✅ 100% |
| 5 Classic Templates | ✅ 100% |
| Templates Screen | ✅ 100% |
| Profile Screen | ✅ 100% |
| ATS Analyzer UI | ✅ 90% |
| Modern Templates (5) | ❌ 0% |
| Creative Templates (5) | ❌ 0% |
| Settings Screen | ❌ 0% |
| Play Store Prep | ❌ 0% |

**Overall: ~85% complete**

---

## What Needs To Be Done Next (In Order)

### 1. Test ATS Analyzer (First thing tomorrow)
- Open app → Analyzer tab
- Pick any resume PDF
- Tap Analyze
- Should work now with gemini-2.0-flash + 50mb limit fix

### 2. Home Screen Real Data Hookup
- Show actual resume count
- Show active resume name
- Show completion percentage
- Quick actions (Edit, Preview, Analyze)

### 3. Settings Screen
- Theme toggle (future)
- Notification preferences (future)
- For now: just show app info + links

### 4. Play Store Prep
- App icon (already have cvlogoo.png)
- Splash screen
- App signing
- Store listing, screenshots
- Privacy policy (already done)

### 5. Modern + Creative Templates (v1.1)
- Build after Play Store launch
- 5 Modern templates
- 5 Creative templates

---

## Backend Folder Structure
cvpilot-backend/
├── config/db.js
├── controllers/
│   ├── authController.js
│   └── resumeController.js
├── models/
│   ├── User.js
│   └── Resume.js
├── routes/
│   ├── authRoutes.js
│   ├── resumeRoutes.js
│   └── analyzeRoutes.js      ← Gemini analyzer route
├── middleware/
│   └── authMiddleware.js
├── server.js
└── .env

---

## Environment Variables

### Backend (.env + Render Environment)
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=cvpilot_super_secret_jwt_key_2024
GEMINI_API_KEY=your_gemini_key_here

### Render Deployment
- GitHub repo: https://github.com/ErrorInshanu/cvpilot-backend
- Live URL: https://cvpilot-backend-sxut.onrender.com
- Auto-deploys on push to main branch

---

## Key Rules For All Future Code
1. Use ONLY theme.js values — no hardcoded colors/spacing/sizes
2. Use conditional rendering for expandable cards (not maxHeight)
3. All builder screens follow experience.js pattern
4. `paddingBottom: insets.bottom + 60` on all ScrollView
5. Never use SafeAreaView from react-native
6. Always call `saveActiveResumeToBackend()` after `markSaved()`
7. Drawer open: `navigation.dispatch(DrawerActions.openDrawer())`
8. handleRemove must call store action + markSaved() immediately
9. Chip screens call store action immediately on remove
10. Import expo-file-system as `expo-file-system/legacy`
11. All array spreads use `?? []` fallback
12. loadResume always merges with emptyResume defaults





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   this is my api key name 
