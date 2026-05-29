import { create } from "zustand";

// ─── Default empty resume structure ──────────────────────────────────────────
const emptyResume = {
  id: null,
  meta: {
    title: "My Resume",
    templateId: "modern-minimal",
    themeColor: "#4ADE80",
    fontFamily: "default",
  },
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],       // ← added
  extracurricular: [],    // ← added
  volunteer: [],          // ← added
  publications: [],       // ← added
  training: [],           // ← added
  interests: [],          // ← added
  atsScore: null,
  lastAnalyzed: null,
};

// ─── Resume Store ─────────────────────────────────────────────────────────────
export const useResumeStore = create((set, get) => ({
  // Active resume being edited
  activeResume: { ...emptyResume },

  // List of all saved resumes
  resumes: [],

  // UI state
  isSaving: false,
  lastSaved: null,
  isDirty: false,

  // ── Resume Actions ──────────────────────────────────────────────────────────

  createNewResume: () => {
    set({
      activeResume: {
        ...emptyResume,
        id: null,
        meta: { ...emptyResume.meta, title: "My Resume" },
      },
      isDirty: false,
      lastSaved: null,
    });
  },

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

  updateMeta: (fields) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        meta: { ...state.activeResume.meta, ...fields },
      },
      isDirty: true,
    }));
  },
 
  updatePersonal: (fields) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        personal: { ...state.activeResume.personal, ...fields },
      },
      isDirty: true,
    }));
  },

  // ── Experience ──────────────────────────────────────────────────────────────
  addExperience: (item) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        experience: [...state.activeResume.experience, item],
      },
      isDirty: true,
    }));
  },

  updateExperience: (id, fields) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        experience: state.activeResume.experience.map((e) =>
          e.id === id ? { ...e, ...fields } : e
        ),
      },
      isDirty: true,
    }));
  },

  removeExperience: (id) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        experience: state.activeResume.experience.filter((e) => e.id !== id),
      },
      isDirty: true,
    }));
  },

  // ── Education ───────────────────────────────────────────────────────────────
  addEducation: (item) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        education: [...state.activeResume.education, item],
      },
      isDirty: true,
    }));
  },

  updateEducation: (id, fields) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        education: state.activeResume.education.map((e) =>
          e.id === id ? { ...e, ...fields } : e
        ),
      },
      isDirty: true,
    }));
  },

  removeEducation: (id) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        education: state.activeResume.education.filter((e) => e.id !== id),
      },
      isDirty: true,
    }));
  },

  // ── Skills ──────────────────────────────────────────────────────────────────
  addSkill: (item) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        skills: [...(state.activeResume.skills ?? []), item],
      },
      isDirty: true,
    }));
  },

  removeSkill: (id) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        skills: state.activeResume.skills.filter((s) => s.id !== id),
      },
      isDirty: true,
    }));
  },

  // ── Projects ────────────────────────────────────────────────────────────────
  addProject: (item) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        projects: [...state.activeResume.projects, item],
      },
      isDirty: true,
    }));
  },

  updateProject: (id, fields) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        projects: state.activeResume.projects.map((p) =>
          p.id === id ? { ...p, ...fields } : p
        ),
      },
      isDirty: true,
    }));
  },

  removeProject: (id) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        projects: state.activeResume.projects.filter((p) => p.id !== id),
      },
      isDirty: true,
    }));
  },

  // ── Certifications ──────────────────────────────────────────────────────────
  addCertification: (item) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        certifications: [...state.activeResume.certifications, item],
      },
      isDirty: true,
    }));
  },

  removeCertification: (id) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        certifications: state.activeResume.certifications.filter(
          (c) => c.id !== id
        ),
      },
      isDirty: true,
    }));
  },

  // ── Interests ───────────────────────────────────────────────────────────────
  updateInterests: (items) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        interests: items,
      },
      isDirty: true,
    }));
  },

  // ── Achievements ────────────────────────────────────────────────────────────
  addAchievement: (item) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        achievements: [...(state.activeResume.achievements ?? []), item],
      },
      isDirty: true,
    }));
  },

  updateAchievement: (id, fields) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        achievements: state.activeResume.achievements.map((a) =>
          a.id === id ? { ...a, ...fields } : a
        ),
      },
      isDirty: true,
    }));
  },

  removeAchievement: (id) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        achievements: state.activeResume.achievements.filter(
          (a) => a.id !== id
        ),
      },
      isDirty: true,
    }));
  },

  // ── Extracurricular ─────────────────────────────────────────────────────────
  addExtracurricular: (item) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        extracurricular: [...(state.activeResume.extracurricular ?? []), item],
      },
      isDirty: true,
    }));
  },

  updateExtracurricular: (id, fields) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        extracurricular: state.activeResume.extracurricular.map((e) =>
          e.id === id ? { ...e, ...fields } : e
        ),
      },
      isDirty: true,
    }));
  },

  removeExtracurricular: (id) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        extracurricular: state.activeResume.extracurricular.filter(
          (e) => e.id !== id
        ),
      },
      isDirty: true,
    }));
  },

  // ── Volunteer ───────────────────────────────────────────────────────────────
  addVolunteer: (item) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        volunteer: [...(state.activeResume.volunteer ?? []), item],
      },
      isDirty: true,
    }));
  },

  updateVolunteer: (id, fields) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        volunteer: state.activeResume.volunteer.map((v) =>
          v.id === id ? { ...v, ...fields } : v
        ),
      },
      isDirty: true,
    }));
  },

  removeVolunteer: (id) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        volunteer: state.activeResume.volunteer.filter((v) => v.id !== id),
      },
      isDirty: true,
    }));
  },

  // ── Publications ────────────────────────────────────────────────────────────
  addPublication: (item) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        publications: [...(state.activeResume.publications ?? []), item],
      },
      isDirty: true,
    }));
  },

  updatePublication: (id, fields) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        publications: state.activeResume.publications.map((p) =>
          p.id === id ? { ...p, ...fields } : p
        ),
      },
      isDirty: true,
    }));
  },

  removePublication: (id) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        publications: state.activeResume.publications.filter(
          (p) => p.id !== id
        ),
      },
      isDirty: true,
    }));
  },

  // ── Training ─────────────────────────────────────────────────────────────────
  addTraining: (item) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        training: [...(state.activeResume.training ?? []), item],
      },
      isDirty: true,
    }));
  },

  updateTraining: (id, fields) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        training: state.activeResume.training.map((t) =>
          t.id === id ? { ...t, ...fields } : t
        ),
      },
      isDirty: true,
    }));
  },

  removeTraining: (id) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        training: state.activeResume.training.filter((t) => t.id !== id),
      },
      isDirty: true,
    }));
  },

  // ── Languages ───────────────────────────────────────────────────────────────
  addLanguage: (item) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        languages: [...(state.activeResume.languages ?? []), item],
      },
      isDirty: true,
    }));
  },

  removeLanguage: (id) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        languages: state.activeResume.languages.filter((l) => l.id !== id),
      },
      isDirty: true,
    }));
  },
  updateLanguage: (id, fields) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        languages: state.activeResume.languages.map((l) =>
          l.id === id ? { ...l, ...fields } : l
        ),
      },
      isDirty: true,
    }));
  },

  // ── Save State ──────────────────────────────────────────────────────────────
  setSaving: (val) => set({ isSaving: val }),

  markSaved: () =>
    set({
      isSaving: false,
      isDirty: false,
      lastSaved: new Date().toISOString(),
    }),

  // ── Resumes List ────────────────────────────────────────────────────────────
  setResumes: (list) => set({ resumes: list }),

  addToResumes: (resume) =>
    set((state) => ({ resumes: [resume, ...state.resumes] })),

  updateInResumes: (id, updated) =>
    set((state) => ({
      resumes: state.resumes.map((r) => (r.id === id ? updated : r)),
    })),

  removeFromResumes: (id) =>
    set((state) => ({
      resumes: state.resumes.filter((r) => r.id !== id),
    })),

  // ── ATS Score ───────────────────────────────────────────────────────────────
  setAtsScore: (score) =>
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        atsScore: score,
        lastAnalyzed: new Date().toISOString(),
      },
    })),

  // ── Reset ───────────────────────────────────────────────────────────────────
  resetStore: () =>
    set({
      activeResume: { ...emptyResume },
      resumes: [],
      isSaving: false,
      lastSaved: null,
      isDirty: false,
    }),
}));