const STORAGE_KEY = 'guestbook_messages';

function getMessages() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveMessages(messages) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
}

function renderMessages() {
    const messages = getMessages();
    const messagesList = document.getElementById('messagesList');
    const countEl = document.getElementById('count');

    countEl.textContent = `(${messages.length})`;

    if (messages.length === 0) {
        messagesList.innerHTML = '<div class="empty-state">还没有留言，快来发布第一条吧！</div>';
        return;
    }

    messagesList.innerHTML = messages.map((msg) => `
        <div class="message-card">
            <button class="delete-btn" onclick="deleteMessage('${msg.id}')">&times;</button>
            <div class="message-header">
                <span class="message-name">${escapeHtml(msg.name)}</span>
                <span class="message-time">${formatTime(msg.timestamp)}</span>
            </div>
            <div class="message-content">${escapeHtml(msg.content)}</div>
        </div>
    `).reverse().join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addMessage(name, content) {
    const messages = getMessages();
    const newMessage = {
        id: Date.now().toString(),
        name: name.trim(),
        content: content.trim(),
        timestamp: Date.now()
    };
    messages.push(newMessage);
    saveMessages(messages);
    renderMessages();
}

function deleteMessage(id) {
    if (confirm('确定要删除这条留言吗？')) {
        let messages = getMessages();
        messages = messages.filter(msg => msg.id !== id);
        saveMessages(messages);
        renderMessages();
    }
}

document.getElementById('messageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nameInput = document.getElementById('nameInput');
    const messageInput = document.getElementById('messageInput');

    addMessage(nameInput.value, messageInput.value);

    messageInput.value = '';
    nameInput.focus();
});

renderMessages();