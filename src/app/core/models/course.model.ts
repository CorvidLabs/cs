export interface Course {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    estimatedHours: number;
    modules: string[];
}

export interface Module {
    id: string;
    title: string;
    description: string;
    order: number;
    lessons: string[];
    exercises: string[];
}

export interface Lesson {
    id: string;
    title: string;
    order: number;
    estimatedMinutes: number;
    content: string;
}

export type Language = 'python' | 'javascript' | 'typescript' | 'swift' | 'rust' | 'kotlin' | 'html' | 'css';

export interface Exercise {
    id: string;
    title: string;
    description: string;
    order: number;
    language: Language;
    starterCode: string;
    testCases: TestCase[];
    hints: string[];
}

export interface TestCase {
    description: string;
    assertion: string;
    expectedOutput?: string;
}

export interface Breadcrumb {
    label: string;
    route: string | null;
}
