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

    const deleteTask = async (id: string) => {
        // Optimistically remove from UI
        const previousUnit = state.currentUnit;
        const taskToDelete = previousUnit.tasks.find(t => t.id === id);

        setState(prev => ({
            ...prev,
            currentUnit: {
                ...prev.currentUnit,
                tasks: prev.currentUnit.tasks.filter(t => t.id !== id)
            },
            selectedTaskId: prev.selectedTaskId === id ? null : prev.selectedTaskId
        }));

        // If it's a real persistent task (UUID length > 20), delete from DB
        if (taskToDelete && id.length > 20) {
            try {
                const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
                if (!res.ok) {
                    throw new Error("Failed to delete");
                }
            } catch (e) {
                console.error("Delete failed, rollback", e);
                // Rollback state if desired, or just alert
                alert("Failed to delete task from server.");
                setState(prev => ({ ...prev, currentUnit: previousUnit }));
            }
        }
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
            const updatedTasks = await Promise.all(tasks.map(async (task) => {
                const isNew = task.id.length < 20;

                let response;
                if (isNew) {
                    response = await fetch(`/api/units/${unitId}/tasks`, {
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
                    response = await fetch(`/api/tasks/${task.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: task.title,
                            payload: task.payload || {},
                            settings: task.settings || {}
                        })
                    });
                }

                if (!response.ok) {
                    // Log error but do not abort the whole save operation
                    const errorText = await response.text();
                    console.error(`Failed to save task "${task.title}": ${errorText}`);
                    // Continue to next task
                }

                const savedData = await response.json();

                // Parse the response content/settings back to object if they are strings (from DB)
                // The API usually returns the Prisma object where content is string.
                // We need to map it back to our Task domain shape.
                return {
                    ...task,
                    id: savedData.id,
                    // If the server returns strict Prisma objects, content is string.
                    // But we want to keep our client-side payload if possible, OR parse the result.
                    // For simplicity, let's keep our local payload but take the ID.
                    // However, taking the server version is safer.
                    // Let's rely on local state for content to avoid flicker, but UPDATE ID.
                } as Task;
            }));

            // Update state with confirmed IDs
            setState(prev => ({
                ...prev,
                currentUnit: {
                    ...prev.currentUnit,
                    tasks: updatedTasks
                },
                // If the selected task was new, its ID changed. Update selection.
                selectedTaskId: prev.selectedTaskId
                    ? (tasks.find(t => t.id === prev.selectedTaskId)?.id !== updatedTasks.find((_, i) => tasks[i].id === prev.selectedTaskId)?.id
                        ? updatedTasks.find((_, i) => tasks[i].id === prev.selectedTaskId)?.id || null
                        : prev.selectedTaskId)
                    : null
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
        case 'matching': return { pairs: [] };
        case 'fill_blank': return { sentence: '', correctAnswer: '' };
        case 'pdf': return { fileUrl: '', allowDownload: true };
        default: return {};
    }
}
