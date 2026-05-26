import { useResumeStore } from "../store/resumeStore";
import {
    createResume,
    deleteResume,
    getResumes,
    updateResume,
} from "./resumeService";
import { getToken } from "./storage";

// ─── Load all resumes from backend into Zustand ───────────────────────────────
export async function loadResumesFromBackend() {
    try {
      const token = await getToken();
      if (!token) return { success: false, error: "Not authenticated" };
  
      let data;
      try {
        data = await getResumes(token);
      } catch (fetchError) {
        console.warn("loadResumesFromBackend: fetch failed, skipping:", fetchError.message);
        return { success: false, error: fetchError.message };
      }
  
      if (!data) return { success: false, error: "Backend unavailable" };
  
      const resumes = Array.isArray(data) ? data : (data?.resumes ?? []);
  
      const store = useResumeStore.getState();
      if (!store) return { success: false, error: "Store unavailable" };
  
      store.setResumes(resumes);
  
      if (!store.activeResume?.id && resumes.length > 0) {
        store.loadResume(resumes[0]);
      }
  
      return { success: true, resumes };
    } catch (error) {
      console.error("loadResumesFromBackend error:", error);
      return { success: false, error: error.message };
    }
  }
// ─── Save active resume to backend ───────────────────────────────────────────
export async function saveActiveResumeToBackend() {
    try {
      const token = await getToken();
      if (!token) return { success: false, error: "Not authenticated" };
  
      const store = useResumeStore.getState();
      const resume = store?.activeResume;
      if (!resume) return { success: false, error: "No active resume" };
  
      let result;
  
      if (resume.id) {
        // ── Update existing resume ──
        try {
          result = await updateResume(token, resume.id, resume);
        } catch (e) {
          console.warn("saveActiveResumeToBackend: update failed:", e.message);
          return { success: false, error: e.message };
        }
      } else {
        // ── Create new resume ──
        let created;
        try {
          created = await createResume(token);
        } catch (e) {
          console.warn("saveActiveResumeToBackend: create failed:", e.message);
          return { success: false, error: e.message };
        }
  
        const newId = created?._id ?? created?.id ?? null;
  
        if (newId) {
          try {
            result = await updateResume(token, newId, { ...resume, id: newId });
          } catch (e) {
            console.warn("saveActiveResumeToBackend: update after create failed:", e.message);
            return { success: false, error: e.message };
          }
  
          useResumeStore.setState((state) => ({
            activeResume: { ...state.activeResume, id: newId },
          }));
        }
      }
  
      store.markSaved();
      return { success: true, data: result };
    } catch (error) {
      console.error("saveActiveResumeToBackend error:", error);
      return { success: false, error: error.message };
    }
  }

// ─── Delete a resume from backend ────────────────────────────────────────────
export async function deleteResumeFromBackend(id) {
  try {
    const token = await getToken();
    if (!token) return { success: false, error: "Not authenticated" };

    await deleteResume(token, id);

    const store = useResumeStore.getState();
if (!store) return { success: false, error: "Store unavailable" };
store.removeFromResumes(id);

if (store.activeResume?.id === id) {
  const remaining = (store.resumes ?? []).filter((r) => r.id !== id);
      if (remaining.length > 0) {
        store.loadResume(remaining[0]);
      } else {
        store.createNewResume();
      }
    }

    return { success: true };
  } catch (error) {
    console.error("deleteResumeFromBackend error:", error);
    return { success: false, error: error.message };
  }
}

// ─── Create a brand new resume on backend ────────────────────────────────────
export async function createNewResumeOnBackend(title = "My Resume") {
  try {
    const token = await getToken();
    if (!token) return { success: false, error: "Not authenticated" };

    const store = useResumeStore.getState();
    store.createNewResume();

    const result = await createResume(token);
    const newId = result?._id ?? result?.id ?? null;

    if (newId) {
      await updateResume(token, newId, {
        ...store.activeResume,
        id: newId,
        meta: { ...store.activeResume.meta, title },
      });

      useResumeStore.setState((state) => ({
        activeResume: {
          ...state.activeResume,
          id: newId,
          meta: { ...state.activeResume.meta, title },
        },
      }));

      // Refresh resumes list
      await loadResumesFromBackend();
    }

    return { success: true, id: newId };
  } catch (error) {
    console.error("createNewResumeOnBackend error:", error);
    return { success: false, error: error.message };
  }
}