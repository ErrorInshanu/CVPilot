import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    clearAuthStorage,
    getToken,
    getUser,
    removeUser,
    saveToken,
    saveUser,
} from "../services/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const [storedToken, storedUser] = await Promise.all([
                    getToken(),
                    getUser(),
                ]);
                if (cancelled) return;
                setToken(storedToken);
                setUser(storedUser);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const signIn = useCallback(async (nextToken, nextUser) => {
        if (!nextToken || typeof nextToken !== "string") {
            throw new Error("signIn requires a valid token string");
        }
        await saveToken(nextToken);
        if (nextUser != null) {
            await saveUser(nextUser);
        } else {
            await removeUser();
        }
        setToken(nextToken);
        setUser(nextUser ?? null);
    }, []);

    const signOut = useCallback(async () => {
        await clearAuthStorage();
        setToken(null);
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(token),
            isLoading,
            signIn,
            signOut,
        }),
        [user, token, isLoading, signIn, signOut]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
