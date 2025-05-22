// src/js/auth.js

const USERS_STORAGE_KEY = 'club_users';
const SESSION_STORAGE_KEY = 'club_session';

function saveSession(username) {
    sessionStorage.setItem(SESSION_STORAGE_KEY, username);
}

function clearSession() {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

function getSession() {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
}

function getUsers() {
    let users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : null;
}

function handleLogin(username, password) {
    const users = getUsers();
    if (!users) {
        throw new Error('No users found - please reset app.');
    }
    const user = users.find(u => u.username === username);
    if (!user || user.password !== password) {
        throw new Error('Invalid username or password.');
    }
    saveSession(user.username);
    return user;
}

function handleRegister(name, username, password) {
    const users = getUsers() || [];
    if (users.find((u) => u.username === username)) {
        throw new Error('Username already exists.');
    }

    const newUser = {
        username,
        password,
        name,
        role: 'member',
        points: 0,
        ranking: 'Bronze',
        profilePicture: 'default-profile.png',
        bio: '',
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return newUser;
}

export { handleLogin, handleRegister, saveSession, clearSession, getSession };