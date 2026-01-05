export type TaskType = 'video' | 'quiz' | 'pdf' | 'audio' | 'matching' | 'fill_blank';

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

export type Task = VideoTask | QuizTask | PDFTask | AudioTask;

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
