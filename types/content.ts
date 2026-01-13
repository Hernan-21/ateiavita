export type TaskType = 'video' | 'quiz' | 'pdf' | 'audio' | 'matching' | 'fill_blank' | 'drag_drop' | 'conversation';

export interface BaseTask {
    id: string;
    type: TaskType;
    title: string;
    description?: string;
    settings: {
        required: boolean;
        points: number;
        timeLimit?: number; // seconds
    };
}

export interface DragDropPayload {
    word: string;          // The correct word (e.g. "HOUSE")
    hint?: string;         // Optional hint (e.g. "Casa")
    distractors?: string[]; // Optional extra letters that don't belong
}

export interface DialogueLine {
    id: string;
    speaker: string;
    text: string;
    messageDirection?: 'left' | 'right';
}

export interface ConversationPayload {
    lines: DialogueLine[];
    context?: string; // Optional description of the scene
}

export interface MatchingPair {
    id: string;
    left: string; // e.g. "Cat"
    right: string; // e.g. "Gato"
}

export interface MatchingPayload {
    pairs: MatchingPair[];
}

// --- PAYLOAD DEFINITIONS ---

export interface VideoPayload {
    provider: 'youtube' | 'bunny' | 'vimeo';
    url: string;
    duration?: number;
    timestamps?: {
        time: number;
        text: string;
    }[];
}

export interface QuizQuestion {
    id: string;
    text: string;
    mediaUrl?: string;
    type: 'single_choice' | 'multiple_choice';
    options: string[];
    correctAnswer: number | number[]; // Index of correct option(s)
    feedback?: string;
}

export interface QuizPayload {
    questions: QuizQuestion[];
    randomize?: boolean; // Whether to shuffle questions
}

export interface PDFPayload {
    fileUrl: string;
    allowDownload: boolean;
}

export interface AudioPayload {
    audioUrl: string;
    transcript?: string;
}

// --- UNION TYPE ---

export interface VideoTask extends BaseTask {
    type: 'video';
    payload: VideoPayload;
}

export interface QuizTask extends BaseTask {
    type: 'quiz';
    payload: QuizPayload;
}

export interface PDFTask extends BaseTask {
    type: 'pdf';
    payload: PDFPayload;
}

export interface AudioTask extends BaseTask {
    type: 'audio';
    payload: AudioPayload;
}

export interface AudioTask extends BaseTask {
    type: 'audio';
    payload: AudioPayload;
}

export interface DragDropTask extends BaseTask {
    type: 'drag_drop';
    payload: DragDropPayload;
}

export interface ConversationTask extends BaseTask {
    type: 'conversation';
    payload: ConversationPayload;
}

export interface MatchingTask extends BaseTask {
    type: 'matching';
    payload: MatchingPayload;
}

export interface FillBlankPayload {
    sentence: string; // "The cat is _____ the table"
    correctAnswer: string;
}

export interface FillBlankTask extends BaseTask {
    type: 'fill_blank';
    payload: FillBlankPayload;
}

export type Task = VideoTask | QuizTask | PDFTask | AudioTask | DragDropTask | ConversationTask | MatchingTask | FillBlankTask;

// --- LESSON STRUCTURE ---

export interface LessonUnit {
    id: string;
    title: string;
    pdfUrl?: string;
    tasks: Task[]; // Replaces the old 'materials' array
}

export interface Level {
    id: string;
    title: string;
    description: string;
    accessCode: string;
    color: string;
    iconChar: string;
    units: LessonUnit[]; // Replaces 'classes'
}
