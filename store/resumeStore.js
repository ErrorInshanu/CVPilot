import { create } from "zustand";

// ─── Default empty resume structure ──────────────────────────────────────────
const emptyResume = {
  id: null,
  meta: {
    title: "My Resume",
    templateId: "modern",
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
  isDirty: false, // true if unsaved changes exist

  // ── Resume Actions ──────────────────────────────────────────────────────────

  // Start a brand new resume
  createNewResume: () => {
    set({
      activeResume: {
        ...emptyResume,
        id: null,
        meta: {
          ...emptyResume.meta,
          title: "My Resume",
        },
      },
      isDirty: false,
      lastSaved: null,
    });
  },

  // Load an existing resume into the editor
  loadResume: (resume) => {
    set({
      activeResume: { ...resume },
      isDirty: false,
    });
  },

  // Update meta (title, template, theme)
  updateMeta: (fields) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        meta: { ...state.activeResume.meta, ...fields },
      },
      isDirty: true,
    }));
  },

  // Update personal info
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
        skills: [...state.activeResume.skills, item],
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