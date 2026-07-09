
const chat = document.getElementById("chat");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");
const newChatButton = document.getElementById("newChat");
const charCounter = document.getElementById("charCounter");
const themeToggle = document.getElementById("themeToggle");
const micButton = document.getElementById("mic");
let chatHistory = [];
const saved = localStorage.getItem("chatHistory");
if (saved) chatHistory = JSON.parse(saved);

let isSending = false;

if (chatHistory.length === 0) {
    addMessage("bot", "👋 Hello! I'm Vertex. How can I help you today?");
}

messageInput.addEventListener("input", function() {
    const remaining = 2000 - this.value.length;
    charCounter.textContent = `${remaining} characters remaining`;
    charCounter.style.color = remaining < 100 ? "#ef4444" : remaining < 300 ? "#eab308" : "#64748b";
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
    name.textContent = sender === "user" ? "You" : "Vertex AI";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = marked.parse(text);

    const timestamp = document.createElement("div");
    timestamp.className = "timestamp";
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    content.appendChild(name);
    content.appendChild(bubble);
    content.appendChild(timestamp);

    if (sender === "bot") {
        const actions = document.createElement("div");
        actions.className = "actions";
        actions.innerHTML = `<button>👍</button><button>👎</button>`;
        content.appendChild(actions);

        const copyBtn = document.createElement("button");
        copyBtn.className = "copy-btn";
        copyBtn.innerHTML = "📋 Copy";
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(bubble.innerText);
            copyBtn.innerHTML = "✅ Copied";
            setTimeout(() => copyBtn.innerHTML = "📋 Copy", 1500);
        };
        content.appendChild(copyBtn);
    }

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
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chat.appendChild(typing);
    chat.scrollTop = chat.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();
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
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    messageInput.value = "";
    charCounter.textContent = "2000 characters remaining";

    try {
        const response = await fetch("/api/chat",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: chatHistory })
            }
        );
        const data = await response.json();
        removeTypingIndicator();

        if (data.error) {
            addMessage("bot", "❌ " + data.error.message);
        } else {
            const reply = data.candidates[0].content.parts[0].text;
            addMessage("bot", reply);
            chatHistory.push({ role: "model", parts: [{ text: reply }] });
        }
    } catch (error) {
        removeTypingIndicator();
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

messageInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

document.addEventListener("keydown", function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

themeToggle.onclick = () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light"));
};

if (localStorage.getItem("theme") === "true") {
    document.body.classList.add("light");
}

document.querySelectorAll(".suggestions button").forEach(btn => {
    btn.onclick = () => {
        messageInput.value = btn.innerText;
        messageInput.focus();
    };
});

sendButton.addEventListener("click", sendMessage);
newChatButton.addEventListener("click", newChat);

if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    micButton.onclick = () => recognition.start();
    recognition.onresult = (e) => {
        messageInput.value = e.results[0][0].transcript;
    };
} else {
    micButton.style.display = "none";
}
