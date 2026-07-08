# ✨ Vertex AI - Smart Chat Assistant

A modern, lightweight AI chat application powered by **Google's Gemini 2.5 Flash API**.
It provides a clean, responsive interface where users can have natural conversations with AI, receive real-time responses, 
and view formatted answers with full Markdown support. The project is built entirely with **HTML, CSS, and JavaScript**, 
making it simple to run without any frameworks or build tools.

## 🌟 Features

- 💬 **Real-time AI Chat** – Get fast, intelligent responses from Gemini.
- 📝 **Markdown Support** – Displays headings, lists, tables, code blocks, links, and more.
- 🎨 **Modern UI** – Glassmorphism-inspired design with smooth animations and an intuitive layout.
- ⏳ **Typing Indicator** – Shows when the AI is generating a response.
- 📊 **Character Counter** – Tracks the remaining characters while typing.
- 🔄 **New Chat** – Instantly clear the conversation and start a fresh chat.
- ♻️ **Automatic Retry** – Retries failed API requests to improve reliability.
- ⌨️ **Keyboard Shortcuts** – Press **Enter** to send, **Shift + Enter** for a new line, and **Esc** to clear the input.
- 📱 **Responsive Design** – Optimized for desktop, tablet, and mobile devices.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Google Gemini 2.5 Flash API
- Marked.js (Markdown Parser)

## 🚀 Quick Start

1. Get your Gemini API key from **Google AI Studio**.
2. Open `script.js`.
3. Replace `YOUR_API_KEY_HERE` with your API key:

```javascript
const API_KEY = "YOUR_API_KEY_HERE";
```

4. Open `index.html` in your browser and start chatting with Vertex AI.

## 📁 Project Structure

```
├── index.html
├── style.css
├── script.js
└── README.md
```

## ⚠️ Note

For security reasons, never upload your API key to a public GitHub repository. Keep it private or use a backend service
to manage API requests.
