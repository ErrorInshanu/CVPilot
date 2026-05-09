import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Access auth state and actions from any screen under AuthProvider.
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
