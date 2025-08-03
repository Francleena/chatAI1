import React, { useState, useRef, useEffect } from "react";
import styles from "./Chatbot.module.css";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Chatbot({ userName }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    const chatId = useRef(`chat-${Date.now()}`);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function query(data) {
        const response = await fetch(
            "https://cloud.flowiseai.com/api/v1/prediction/f0bc0259-1c3c-4d82-a32a-7e9918f5900f",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, chatId: chatId.current }),
            },
        );
        const result = await response.json();
        return result;
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { from: userName, text: input, type: "user" };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const historyText = updatedMessages
                .map((m) => `${m.from}: ${m.text}`)
                .join("\n");

            const data = await query({
                question: input,
                history: historyText,
            });

            const botMsg = {
                from: "Bot",
                text: data?.text || "Sorry, I didn't get that.",
                type: "bot",
            };

            const finalMessages = [...updatedMessages, botMsg];
            setMessages(finalMessages);

            await setDoc(doc(db, "chats", userName), {
                messages: finalMessages,
            });
        } catch (err) {
            console.error("Error:", err);
            const errorMsg = {
                from: "Bot",
                text: "Error: Could not reach the server.",
                type: "bot",
            };
            const finalMessages = [...updatedMessages, errorMsg];
            setMessages(finalMessages);
            await setDoc(doc(db, "chats", userName), {
                messages: finalMessages,
            });
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <span className={styles.avatar}>
                    {userName.charAt(0).toUpperCase()}
                </span>
                <span className={styles.welcome}>Welcome, {userName}!</span>
            </header>

            <div className={styles.chat}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={
                            msg.type === "user" ? styles.userMsg : styles.botMsg
                        }
                    >
                        <span className={styles.msgSender}>{msg.from}:</span>
                        <span className={styles.msgText}>{msg.text}</span>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>

            <form onSubmit={sendMessage} className={styles.inputArea}>
                <input
                    className={styles.input}
                    value={input}
                    placeholder={
                        loading ? "Waiting for reply…" : "Type your message..."
                    }
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    autoFocus
                />
                <button
                    className={styles.button}
                    type="submit"
                    disabled={loading || !input}
                >
                    {loading ? "..." : "Send"}
                </button>
            </form>
        </div>
    );
}
