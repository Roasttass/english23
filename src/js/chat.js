// This file handles chat functionalities, including sending and displaying chat messages.
// It exports functions like sendChatMessage, renderChatMessages, and utilities for managing chat history.

const CHAT_STORAGE_KEY = 'club_chat_messages';

// Load chat messages from localStorage
function loadChatMessages() {
    const messages = localStorage.getItem(CHAT_STORAGE_KEY);
    return messages ? JSON.parse(messages) : [];
}

// Save chat messages to localStorage
function saveChatMessages(messages) {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
}

// Render chat messages in the chat section
function renderChatMessages(chatMessagesEl) {
    const messages = loadChatMessages();
    chatMessagesEl.innerHTML = messages
        .map(msg => `
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                <img src="${msg.profilePicture || 'default-profile.png'}" alt="${msg.user}'s Profile Picture" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 1rem;" />
                <p style="margin: 0;"><strong>${msg.user}:</strong> ${msg.text}</p>
            </div>
        `)
        .join('');
}

// Send a chat message
function sendChatMessage(user, chatInput, chatMessagesEl) {
    const text = chatInput.value.trim();
    if (!text) return;

    const messages = loadChatMessages();
    messages.push({ user: user.name, text, profilePicture: user.profilePicture });
    saveChatMessages(messages);

    chatInput.value = '';
    renderChatMessages(chatMessagesEl);
}

// Exporting functions for use in other modules
export { sendChatMessage, renderChatMessages };