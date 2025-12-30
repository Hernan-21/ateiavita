import { Level, Task } from "@/types/content";

export const LEVELS: Level[] = [
    {
        id: "level-1",
        title: "Level 1 - Fundamentos",
        description: "Introducción al Ruso: Alfabeto y Básicos",
        accessCode: "NIVEL1",
        color: "green",
        iconChar: "🟢",
        units: [
            {
                id: "unit-1-basics",
                title: "1. Fundamentos y Fonética",
                tasks: [
                    {
                        id: "greetings",
                        title: "Приветствие: Saludos",
                        type: "video",
                        settings: { required: true, points: 10 },
                        payload: { provider: "youtube", url: "M_wcG9a8X9g" } // Example Generic Russian Greeting Video
                    },
                    {
                        id: "farewells",
                        title: "Прощание: Despedidas",
                        type: "pdf",
                        settings: { required: false, points: 5 },
                        payload: { fileUrl: "", allowDownload: true }
                    },
                    {
                        id: "how-are-you",
                        title: "Как дела? (Quiz)",
                        type: "quiz",
                        settings: { required: true, points: 20 },
                        payload: {
                            questions: [
                                {
                                    id: "q1",
                                    text: "How do you say 'How are you?' informally?",
                                    options: ["Как дела? (Kak dela?)", "Здравствуйте (Zdravstvuyte)"],
                                    correctAnswer: 0,
                                    type: "single_choice"
                                },
                                {
                                    id: "q2",
                                    text: "What is the formal hello?",
                                    options: ["Привет (Privet)", "Здравствуйте (Zdravstvuyte)"],
                                    correctAnswer: 1,
                                    type: "single_choice"
                                }
                            ]
                        }
                    },
                ]
            },
            {
                id: "unit-2-grammar",
                title: "2. Gramática Esencial",
                tasks: [
                    {
                        id: "personal-pronouns",
                        title: "Личные местоимения",
                        type: "pdf",
                        settings: { required: false, points: 5 },
                        payload: { fileUrl: "", allowDownload: true }
                    },
                ]
            }
        ]
    },
    {
        id: "level-2",
        title: "Level 2 - Elementary",
        description: "Próximamente...",
        accessCode: "NIVEL2",
        color: "yellow",
        iconChar: "🟡",
        units: []
    },
    {
        id: "level-3",
        title: "Level 3 - Intermediate",
        description: "Próximamente...",
        accessCode: "NIVEL3",
        color: "orange",
        iconChar: "🟠",
        units: []
    }
];

export function getLevelById(id: string): Level | undefined {
    return LEVELS.find(l => l.id === id);
}

export function getTaskById(levelId: string, taskId: string): Task | undefined {
    const level = getLevelById(levelId);
    if (!level) return undefined;

    // Flatten all tasks from all units to find the specific one
    return level.units.flatMap(u => u.tasks).find(t => t.id === taskId);
}
