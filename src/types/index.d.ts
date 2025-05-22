// This file contains TypeScript type definitions for the project, defining interfaces and types used throughout the JavaScript files.

interface User {
    username: string;
    password: string;
    name: string;
    role: 'admin' | 'member';
    points: number;
    ranking: string;
    profilePicture: string;
    bio: string;
}

interface ChatMessage {
    user: string;
    text: string;
}

interface QuestionResponse {
    yes: string[];
    no: string[];
}

interface Question {
    text: string;
    responses: QuestionResponse;
}