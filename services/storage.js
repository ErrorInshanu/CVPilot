import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "cvpilot_auth_token";
const USER_KEY = "cvpilot_auth_user";

/**
 * Persist JWT (or access token) in the device keychain / encrypted storage.
 */
export async function saveToken(token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
}

export async function getToken() {
    return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeToken() {
    try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
        /* Key may already be absent */
    }
}

/**
 * Optional profile payload (plain object). Stored as JSON.
 */
export async function saveUser(user) {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user), {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
}

export async function getUser() {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export async function removeUser() {
    try {
        await SecureStore.deleteItemAsync(USER_KEY);
    } catch {
        /* Key may already be absent */
    }
}

export async function clearAuthStorage() {
    await Promise.all([removeToken(), removeUser()]);
}
