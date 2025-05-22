// Utility functions for the Club Member Identification System

// Save users to local storage
function saveUsers(users) {
    localStorage.setItem('club_users', JSON.stringify(users));
}

// Get users from local storage
function getUsers() {
    let users = localStorage.getItem('club_users');
    return users ? JSON.parse(users) : null;
}

// Save session to local storage
function saveSession(username) {
    sessionStorage.setItem('club_session', username);
}

// Clear session from local storage
function clearSession() {
    sessionStorage.removeItem('club_session');
}

// Get current session from local storage
function getSession() {
    return sessionStorage.getItem('club_session');
}

// Validate input data
function validateInput(value, type) {
    if (type === 'username') {
        return value.length >= 3; // Username must be at least 3 characters
    } else if (type === 'password') {
        return value.length >= 6; // Password must be at least 6 characters
    }
    return true; // Default validation
}

// Find user by username
function findUser(username) {
    const users = getUsers();
    return users ? users.find(u => u.username === username) : null;
}

// Check if a value is empty
function isEmpty(value) {
    return !value || value.trim() === '';
}