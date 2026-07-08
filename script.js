const API_KEY = "Add ure api ";

const chat = document.getElementById("chat");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");
const newChatButton = document.getElementById("newChat");
const charCounter = document.getElementById("charCounter");
let chatHistory = [];
let isSending = false;

addMessage("bot", "👋 Hello! I'm Vertex. How can I help you today?");

// Character counter
messageInput.addEventListener("input", function() {
    const remaining = 2000 - this.value.length;
    charCounter.textContent = `${remaining} characters remaining`;
    if (remaining < 100) charCounter.style.color = "#ef4444";
    else if (remaining < 300) charCounter.style.color = "#eab308";
    else charCounter.style.color = "#64748b";
});

function addMessage(sender, text) {
    const message = document.createElement("div");
    message.className = `message ${sender}`;

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = sender === "user" ? "👤" : "🤖";

    const content = document.createElement("div");
    content.className = "content";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = sender === "user" ? "You" : "vertex AI";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = marked.parse(text);

    const timestamp = document.createElement("div");
    timestamp.className = "timestamp";
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    content.appendChild(name);
    content.appendChild(bubble);
    content.appendChild(timestamp);

    message.appendChild(avatar);
    message.appendChild(content);
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
}

function showTypingIndicator() {
    const typing = document.createElement("div");
    typing.className = "message bot";
    typing.id = "typing-indicator";
    typing.innerHTML = `
        <div class="avatar">🤖</div>
        <div class="content">
            <div class="name">Vertex</div>
            <div class="bubble typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chat.appendChild(typing);
    chat.scrollTop = chat.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById("typing-indicator");
    if(typing) typing.remove();
}

async function sendMessageWithRetry(message, retries = 3) {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: chatHistory })
            }
        );
        const data = await response.json();
        if (data.error && retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return sendMessageWithRetry(message, retries - 1);
        }
        return data;
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return sendMessageWithRetry(message, retries - 1);
        }
        throw error;
    }
}

async function sendMessage() {
    if (isSending) return;
    
    const message = messageInput.value.trim();
    if (!message) return;

    isSending = true;
    sendButton.disabled = true;

    addMessage("user", message);
    showTypingIndicator();
    chatHistory.push({ role: "user", parts: [{ text: message }] });
    messageInput.value = "";
    charCounter.textContent = "2000 characters remaining";

    try {
        const data = await sendMessageWithRetry(message);
        removeTypingIndicator();

        if (data.error) {
            addMessage("bot", "❌ " + data.error.message);
            isSending = false;
            sendButton.disabled = false;
            return;
        }

        const reply = data.candidates[0].content.parts[0].text;
        addMessage("bot", reply);
        chatHistory.push({ role: "model", parts: [{ text: reply }] });

    } catch (error) {
        removeTypingIndicator();
        console.error(error);
        addMessage("bot", "❌ Unable to connect to Gemini. Please check your internet connection.");
    } finally {
        isSending = false;
        sendButton.disabled = false;
    }
}

function newChat() {
    chat.innerHTML = "";
    chatHistory = [];
    addMessage("bot", "👋 Hello! I'm Vertex. How can I help you today?");
}

// Keyboard shortcuts
messageInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
    if (event.key === "Escape") {
        this.value = "";
        charCounter.textContent = "2000 characters remaining";
        charCounter.style.color = "#64748b";
    }
});

// Ctrl+Enter shortcut for desktop
document.addEventListener("keydown", function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

sendButton.addEventListener("click", sendMessage);
newChatButton.addEventListener("click", newChat);