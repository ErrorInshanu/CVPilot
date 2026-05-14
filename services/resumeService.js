import { ENDPOINTS } from "../constants/api";

function authJsonHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Reads response body as JSON when present; throws on HTTP error or invalid JSON.
 */
async function parseJsonResponse(response) {
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server returned invalid JSON");
    }
  }
  if (!response.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed with status ${response.status}`;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }
  return data;
}

export async function createResume(token) {
  try {
    const response = await fetch(ENDPOINTS.resumes, {
      method: "POST",
      headers: authJsonHeaders(token),
      body: JSON.stringify({}),
    });
    return await parseJsonResponse(response);
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function getResumes(token) {
  try {
    const response = await fetch(ENDPOINTS.resumes, {
      method: "GET",
      headers: authJsonHeaders(token),
    });
    return await parseJsonResponse(response);
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function getResumeById(token, id) {
  try {
    const response = await fetch(ENDPOINTS.resume(id), {
      method: "GET",
      headers: authJsonHeaders(token),
    });
    return await parseJsonResponse(response);
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function updateResume(token, id, data) {
  try {
    const response = await fetch(ENDPOINTS.resume(id), {
      method: "PUT",
      headers: authJsonHeaders(token),
      body: JSON.stringify(data),
    });
    return await parseJsonResponse(response);
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function deleteResume(token, id) {
  try {
    const response = await fetch(ENDPOINTS.resume(id), {
      method: "DELETE",
      headers: authJsonHeaders(token),
    });
    return await parseJsonResponse(response);
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}
