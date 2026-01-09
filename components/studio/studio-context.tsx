"use client";

import React, { createContext, useContext, useState } from 'react';
import { Task, TaskType, LessonUnit, VideoPayload, QuizPayload } from '@/types/content';

// Simple ID generator if uuid is not available
const generateId = () => Math.random().toString(36).substr(2, 9);

interface StudioState {
    currentUnit: LessonUnit;
    selectedTaskId: string | null;
}

interface StudioContextType {
    state: StudioState;
    addTask: (type: TaskType) => void;
    selectTask: (id: string | null) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    updateUnit: (updates: Partial<LessonUnit>) => void;
    reorderTasks: (startIndex: number, endIndex: number) => void;
    saveUnit: () => Promise<void>;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export function StudioProvider({ children, initialUnit }: { children: React.ReactNode, initialUnit?: LessonUnit }) {
    const [state, setState] = useState<StudioState>({
        currentUnit: initialUnit || {
            id: generateId(),
            title: "New Unit",
            tasks: []
        },
        selectedTaskId: null
    });

    const addTask = (type: TaskType) => {
        const newTask: Task = {
            id: generateId(),
            type,
            title: `New ${type} task`,
            settings: { required: true, points: 10 },
            payload: createDefaultPayload(type)
        } as Task;

        setState(prev => ({
            ...prev,
            currentUnit: {
                ...prev.currentUnit,
                tasks: [...prev.currentUnit.tasks, newTask]
            },
            selectedTaskId: newTask.id
        }));
    };

    const selectTask = (id: string | null) => {
        setState(prev => ({ ...prev, selectedTaskId: id }));
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        setState(prev => ({
            ...prev,
            currentUnit: {
                ...prev.currentUnit,
                tasks: prev.currentUnit.tasks.map(t => t.id === id ? { ...t, ...updates } as Task : t)
            }
        }));
    };

    const deleteTask = (id: string) => {
        setState(prev => ({
            ...prev,
            currentUnit: {
                ...prev.currentUnit,
                tasks: prev.currentUnit.tasks.filter(t => t.id !== id)
            },
            selectedTaskId: prev.selectedTaskId === id ? null : prev.selectedTaskId
        }));
    };

    const updateUnit = (updates: Partial<LessonUnit>) => {
        setState(prev => ({
            ...prev,
            currentUnit: { ...prev.currentUnit, ...updates }
        }));
    }

    const reorderTasks = (startIndex: number, endIndex: number) => {
        setState(prev => {
            const result = Array.from(prev.currentUnit.tasks);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return {
                ...prev,
                currentUnit: { ...prev.currentUnit, tasks: result }
            };
        });
    }

    const saveUnit = async () => {
        const unitId = state.currentUnit.id;
        const tasks = state.currentUnit.tasks.map((t, index) => ({
            ...t,
            order: index
        }));

        // We need to sync tasks. 
        // For simple MVP:
        // 1. Delete all tasks in unit (dangerous but easy) OR
        // 2. Upsert each task.
        // Let's use the individual Create/Update logic for now or a new Bulk Sync endpoint?
        // Usage of existing endpoints:
        // PUT /api/units/[unitId]/tasks (reorder only currently)

        // Let's UPDATE existing tasks and CREATE new ones?
        // Actually, the easiest way for "Save" button is to just save everything.
        // Let's try to assume we can just loop through.

        try {
            // 1. Update Unit
            await fetch(`/api/units/${unitId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: state.currentUnit.title,
                    pdfUrl: state.currentUnit.pdfUrl
                })
            });

            // 2. Sync Tasks
            // Ideally we'd have a bulk endpoint. Let's do parallel requests for now.
            await Promise.all(tasks.map(async (task) => {
                // If it's a new task (generated ID might clash or we need a flag? 
                // Context generates IDs with Math.random(). Real DB IDs are UUIDs.
                // Issue: If we send a generated ID to update, it won't find it.
                // We need to know if it's new.
                // Heuristic: If ID length is small (current generateId is 9 chars), it might be new?
                // UUIDs are 36 chars.
                const isNew = task.id.length < 20;

                if (isNew) {
                    await fetch(`/api/units/${unitId}/tasks`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: task.title,
                            type: task.type,
                            payload: task.payload,
                            settings: task.settings
                        })
                    });
                } else {
                    // Update existing task
                    await fetch(`/api/tasks/${task.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: task.title,
                            payload: task.payload,
                            settings: task.settings
                        })
                    });
                }
            }));

            alert("Saved successfully!");
        } catch (e) {
            console.error(e);
            alert("Failed to save");
        }
    };

    return (
        <StudioContext.Provider value={{
            state, addTask, selectTask, updateTask, deleteTask, updateUnit, reorderTasks, saveUnit
        }}>
            {children}
        </StudioContext.Provider>
    );
}

export function useStudio() {
    const context = useContext(StudioContext);
    if (context === undefined) {
        throw new Error('useStudio must be used within a StudioProvider');
    }
    return context;
}

function createDefaultPayload(type: TaskType): any {
    switch (type) {
        case 'video': return { provider: 'youtube', url: '' };
        case 'quiz': return { questions: [] };
        case 'drag_drop': return { word: '', hint: '' };
        case 'conversation': return { lines: [] };
        case 'pdf': return { fileUrl: '', allowDownload: true };
        default: return {};
    }
}
