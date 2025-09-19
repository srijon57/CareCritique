// components/Chatbot/Chatbot.jsx
import { useState } from "react";
import Fuse from "fuse.js";
import faqs from "../../assets/faqs.json";

const fuse = new Fuse(faqs, {
    keys: ["keywords"],
    threshold: 0.3
});

async function getGeminiAnswer(question, faqs) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;    
    const faqContent = faqs
        .map((faq) => `Question: ${faq.question}\nKeywords: ${faq.keywords}\nAnswer: ${faq.answer}`)
        .join("\n\n");

    const prompt = `
        You are a chatbot for CareCritique. Below is a list of FAQs with their questions, keywords, and answers. 
        Try to answer the user's question based on the provided FAQs if possible. 
        If no relevant FAQ is found, provide a general answer based on your knowledge about CareCritique. Give the answer in one or two sentences only.

        FAQs:
        ${faqContent}

        User's Question: ${question}
    `;

    const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
            apiKey,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        }
    );
    const data = await res.json();
    return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't find an answer."
    );
}

function getFaqAnswer(msg) {
    const result = fuse.search(msg);
    if (result.length > 0) {
        return result[0].item.answer;
    }
    return null;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hi! Ask me a question about Carecritique." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const send = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = { from: "user", text: input };
        setMessages((m) => [...m, userMsg]);
        setLoading(true);
        let answer = getFaqAnswer(input);
        if (!answer) {
            answer = await getGeminiAnswer(input, faqs);
        }
        setMessages((m) => [...m, { from: "bot", text: answer }]);
        setInput("");
        setLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="w-80 h-96 flex flex-col bg-white dark:bg-gray-800 border rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center p-3 border-b">
                        <h3 className="font-semibold">CareCritiqe Assistant</h3>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={m.from === "user" ? "text-right" : "text-left"}
                            >
                                <span
                                    className={`inline-block px-3 py-2 rounded-xl ${
                                        m.from === "user"
                                            ? "bg-gray-600 dark:bg-gray-500 text-white"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                    }`}
                                >
                                    {m.text}
                                </span>
                            </div>
                        ))}
                        {loading && (
                            <div className="text-left text-gray-500 dark:text-gray-400">
                                Bot is typing...
                            </div>
                        )}
                    </div>
                    <form onSubmit={send} className="p-3 border-t flex gap-2">
                        <input
                            className="flex-1 border rounded-xl px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                        />
                        <button className="px-4 py-2 bg-gray-900 dark:bg-blue-800 text-white rounded-xl">
                            Send
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}
        </div>
    );
}