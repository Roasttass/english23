// This file manages the question submission and response functionalities for admin users.
// It exports functions such as submitQuestion, updateAdminResults, and utilities for handling question responses.

const QUESTION_STORAGE_KEY = 'current_question';
const RESPONSES_STORAGE_KEY = 'question_responses';

// Submit a question to localStorage
export function submitQuestion(question) {
    if (!question) {
        throw new Error('Question cannot be empty.');
    }
    localStorage.setItem(QUESTION_STORAGE_KEY, question);
    localStorage.setItem(RESPONSES_STORAGE_KEY, JSON.stringify({ yes: [], no: [] }));
}

// Update results for admin
export function updateAdminResults() {
    const question = localStorage.getItem(QUESTION_STORAGE_KEY);
    const responses = JSON.parse(localStorage.getItem(RESPONSES_STORAGE_KEY)) || { yes: [], no: [] };

    return {
        question,
        yesCount: responses.yes.length,
        noCount: responses.no.length,
        yesList: responses.yes,
        noList: responses.no,
    };
}

// Handle member response
export function handleMemberResponse(response, username) {
    const responses = JSON.parse(localStorage.getItem(RESPONSES_STORAGE_KEY)) || { yes: [], no: [] };

    if (response === 'Yes' && !responses.yes.includes(username)) {
        responses.yes.push(username);
    } else if (response === 'No' && !responses.no.includes(username)) {
        responses.no.push(username);
    }

    localStorage.setItem(RESPONSES_STORAGE_KEY, JSON.stringify(responses));
}