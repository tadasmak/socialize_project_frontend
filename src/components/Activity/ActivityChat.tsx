import React, { useState } from 'react';
import { useActivityChat } from '../../hooks/useActivityChat';
import { useAuth } from '../../context/AuthContext';
import MessageBubble from '../MessageBubble';

interface Props {
    activityId: number;
}

export default function ActivityChat({ activityId }: Props) {
    const { user, authLoading } = useAuth();
    const [input, setInput] = useState('');
    const { messages, sendMessage, isConnected } = useActivityChat(
        activityId,
        user?.id || 0
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text) return;
        sendMessage(text);
        setInput('');
    };

    if (authLoading) return <div>Loading chat...</div>;
    if (!user) return <div>You must be logged in to chat.</div>;
    if (!messages) return <div>Send a message to start a conversation.</div>;

    return (
        <div className="flex flex-col border rounded-lg p-3">
            <div className="flex flex-col flex-1 overflow-y-auto space-y-2 mb-3">
                {messages && messages.map((message, i) => {
                    const prevMessage = messages[i - 1];
                    const showMeta = !prevMessage || prevMessage.user.id !== message.user.id;

                    return (
                        <MessageBubble key={message.id} message={message} user={user} showMeta={showMeta} />
                    )
                })}
            </div>

            {!isConnected && (
                <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 rounded">
                    Connecting to chat...
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={!isConnected}
                    className="flex-1 border rounded-lg p-2"
                />
                <button
                    type="submit"
                    disabled={!isConnected}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg">Send</button>
            </form>
        </div>
    )
}