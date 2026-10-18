import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { StoreContext } from "../../context/StoreContextValue";
import "./AIAssistant.css";

const starterPrompts = [
    "What should I try from the menu?",
    "Can you help me with my order?",
];

const renderMessageContent = (content) => {
    if (!content) return null;
    const lines = content.split("\n");
    return lines.map((line, lineIdx) => {
        const isSubBullet = /^\s{2,}[-*•]\s+/.test(line);
        const isBullet = /^\s*[-*•]\s+/.test(line);
        const textToFormat = isBullet ? line.replace(/^\s*[-*•]\s+/, "") : line;
        const parts = textToFormat.split(/(\*\*.*?\*\*)/g);

        const formatted = parts.map((part, partIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });

        if (isBullet) {
            return (
                <div key={lineIdx} className={`ai-bullet-item${isSubBullet ? " ai-sub-bullet" : ""}`}>
                    <span className="ai-bullet-dot">{isSubBullet ? "–" : "•"}</span>
                    <span className="ai-bullet-text">{formatted}</span>
                </div>
            );
        }

        return (
            <div
                key={lineIdx}
                className={line.trim() === "" ? "ai-empty-line" : "ai-text-line"}
            >
                {formatted}
            </div>
        );
    });
};

const AIAssistant = () => {
    const { url, token } = useContext(StoreContext);
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading, isOpen]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const sendMessage = async (messageText = input) => {
        const text = messageText.trim();
        if (!text || loading) return;

        const userMessage = { role: "user", content: text };
        const conversation = [...messages, userMessage];
        setMessages(conversation);
        setInput("");
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${url}/api/assistant/chat`,
                {
                    message: text,
                    history: messages.slice(-8),
                },
                token
                    ? {
                          headers: {
                              Authorization: `Bearer ${token}`,
                          },
                      }
                    : undefined
            );

            if (
                !response.data.success ||
                typeof response.data.reply !== "string"
            ) {
                throw new Error(
                    response.data.message || "The assistant could not answer."
                );
            }

            setMessages([
                ...conversation,
                { role: "assistant", content: response.data.reply },
            ]);
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                    requestError.message ||
                    "Could not reach the assistant. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();
        sendMessage();
    };

    return (
        <div className="ai-assistant">
            {isOpen && (
                <section
                    className="ai-assistant-panel"
                    aria-label="Feasto AI assistant"
                >
                    <header className="ai-assistant-header">
                        <div className="ai-assistant-brand">
                            <span className="ai-assistant-avatar">
                                <Bot size={20} />
                            </span>
                            <span>
                                <strong>Feasto Assistant</strong>
                                <small>Menu and order help</small>
                            </span>
                        </div>
                        <button
                            type="button"
                            className="ai-assistant-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close assistant"
                        >
                            <X size={19} />
                        </button>
                    </header>

                    <div
                        className="ai-assistant-messages"
                        aria-live="polite"
                        aria-relevant="additions text"
                    >
                        {messages.length === 0 ? (
                            <div className="ai-assistant-welcome">
                                <span className="ai-assistant-welcome-icon">
                                    <Bot size={24} />
                                </span>
                                <h2>Hi! What can I help you find?</h2>
                                <p>
                                    Ask about dishes, ordering, or your recent
                                    orders.
                                </p>
                                <div className="ai-assistant-prompts">
                                    {starterPrompts.map((prompt) => (
                                        <button
                                            type="button"
                                            key={prompt}
                                            onClick={() => sendMessage(prompt)}
                                            disabled={loading}
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    className={`ai-message ${message.role}`}
                                    key={`${message.role}-${index}`}
                                >
                                    {renderMessageContent(message.content)}
                                </div>
                            ))
                        )}

                        {loading && (
                            <div
                                className="ai-message assistant ai-typing"
                                role="status"
                            >
                                <span />
                                <span />
                                <span />
                                <span className="sr-only">
                                    Assistant is responding
                                </span>
                            </div>
                        )}
                        {error && (
                            <p className="ai-assistant-error" role="alert">
                                {error}
                            </p>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="ai-assistant-privacy">
                        {token
                            ? "Chat and recent order summaries may be processed by AI. No address or phone is shared."
                            : "Your message and menu details may be processed by AI. Sign in for help with your recent orders."}
                    </div>

                    <form className="ai-assistant-form" onSubmit={onSubmit}>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter" &&
                                    !event.shiftKey &&
                                    !event.nativeEvent.isComposing
                                ) {
                                    event.preventDefault();
                                    onSubmit(event);
                                }
                            }}
                            placeholder="Ask Feasto anything..."
                            aria-label="Message Feasto Assistant"
                            maxLength={1000}
                            rows={1}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            aria-label="Send message"
                            disabled={loading || !input.trim()}
                        >
                            <Send size={17} />
                        </button>
                    </form>
                </section>
            )}

            <button
                type="button"
                className={`ai-assistant-toggle${isOpen ? " is-open" : ""}`}
                onClick={() => setIsOpen((open) => !open)}
                aria-label={
                    isOpen ? "Close Feasto Assistant" : "Open Feasto Assistant"
                }
                aria-expanded={isOpen}
            >
                {isOpen ? <X size={22} /> : <MessageCircle size={23} />}
                {!isOpen && <span>Ask Feasto</span>}
            </button>
        </div>
    );
};

export default AIAssistant;
