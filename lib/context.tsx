"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LEVELS } from './data';

interface UserState {
    unlockedLevels: string[]; // List of Level IDs
    completedMaterials: string[]; // List of Material IDs
}

interface UserContextType {
    state: UserState;
    unlockLevel: (code: string) => { success: boolean; message: string };
    markMaterialAsDone: (materialId: string) => void;
    isMaterialDone: (materialId: string) => boolean;
    getLevelProgress: (levelId: string) => number;
    getClassProgress: (levelId: string, classId: string) => number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, userId }: { children: React.ReactNode, userId?: string }) {
    const [state, setState] = useState<UserState>({
        unlockedLevels: [],
        completedMaterials: []
    });

    // Load from localStorage on mount or when userId changes
    useEffect(() => {
        // storage key depends on user. If no user, use 'guest' or similar, OR separate guest state.
        // Let's use 'privet_user_state_guest' for unauth, and 'privet_user_state_{id}' for auth.
        const storageKey = userId ? `privet_user_state_${userId}` : 'privet_user_state_guest';

        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                setState(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse user state", e);
            }
        } else {
            // Reset to empty if no saved state for this user
            setState({
                unlockedLevels: [],
                completedMaterials: []
            });
        }
    }, [userId]);

    // Save to localStorage on change
    useEffect(() => {
        const storageKey = userId ? `privet_user_state_${userId}` : 'privet_user_state_guest';
        localStorage.setItem(storageKey, JSON.stringify(state));
    }, [state, userId]);

    const unlockLevel = (code: string) => {
        const level = LEVELS.find(l => l.accessCode === code.toUpperCase());
        if (level) {
            if (state.unlockedLevels.includes(level.id)) {
                return { success: true, message: "Level already unlocked!" };
            }
            setState(prev => ({
                ...prev,
                unlockedLevels: [...prev.unlockedLevels, level.id]
            }));
            return { success: true, message: `Unlocked ${level.title}!` };
        }
        return { success: false, message: "Invalid Access Code" };
    };

    const markMaterialAsDone = (materialId: string) => {
        setState(prev => {
            const isDone = prev.completedMaterials.includes(materialId);
            return {
                ...prev,
                completedMaterials: isDone
                    ? prev.completedMaterials.filter(id => id !== materialId) // Toggle off
                    : [...prev.completedMaterials, materialId] // Toggle on
            };
        });
    };

    const isMaterialDone = (materialId: string) => {
        return state.completedMaterials.includes(materialId);
    }

    const getClassProgress = (levelId: string, classId: string) => {
        const level = LEVELS.find(l => l.id === levelId);
        if (!level) return 0;
        const cls = level.classes.find(c => c.id === classId);
        if (!cls || cls.materials.length === 0) return 0;

        const total = cls.materials.length;
        const completed = cls.materials.filter(m => state.completedMaterials.includes(m.id)).length;

        return Math.round((completed / total) * 100);
    }

    const getLevelProgress = (levelId: string) => {
        const level = LEVELS.find(l => l.id === levelId);
        if (!level) return 0;

        let totalMaterials = 0;
        let completedMaterials = 0;

        level.classes.forEach(c => {
            totalMaterials += c.materials.length;
            completedMaterials += c.materials.filter(m => state.completedMaterials.includes(m.id)).length;
        });

        if (totalMaterials === 0) return 0;
        return Math.round((completedMaterials / totalMaterials) * 100);
    }

    return (
        <UserContext.Provider value={{
            state,
            unlockLevel,
            markMaterialAsDone,
            isMaterialDone,
            getLevelProgress,
            getClassProgress
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
