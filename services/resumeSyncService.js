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

    const data = await getResumes(token);
    const resumes = data?.resumes ?? data ?? [];

    const store = useResumeStore.getState();
    store.setResumes(resumes);

    // If no active resume, load the most recent one
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
      result = await updateResume(token, resume.id, resume);
    } else {
      // ── Create new resume ──
      result = await createResume(token);
      const newId = result?._id ?? result?.id ?? null;

      if (newId) {
        // Now update it with actual data
        result = await updateResume(token, newId, { ...resume, id: newId });

        // Save ID back to store
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