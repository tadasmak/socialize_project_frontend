import { useEffect, useRef, useState } from 'react';
import { getCable } from '../cable';
import { apiFetch } from '../utils/apiClient';
import { toast } from 'react-toastify';
import type { Channel } from '@rails/actioncable';
import { MessageType } from '../types/messageTypes';

export function useActivityChat(activityId: number, currentUserId: number) {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const subscriptionRef = useRef<Channel | null>(null);

    useEffect(() => {
        apiFetch(`/activities/${activityId}/messages`)
            .then(response => {
                if (response.status === 404) return null;
                return response.json();
            })
            .then(data => setMessages(data))
            .catch(error => {
                console.error('Failed to fetch messages', error);
                toast.error(error || 'Something went wrong while fetching messages', {
                    position: 'bottom-center',
                    autoClose: 3000
                })
            })
    }, [activityId])

    useEffect(() => {
        if (!currentUserId) {
            setIsConnected(false);
            return;
        }

        try {
            const cable = getCable();

            if (subscriptionRef.current) {
                cable.subscriptions.remove(subscriptionRef.current);
                subscriptionRef.current = null;
            }

            const subscription = cable.subscriptions.create(
                { channel: 'ActivityChannel', activity_id: activityId },
                {
                    connected: () => {
                        console.log("✅ Connected to ActivityChannel");
                        console.log(currentUserId);
                        setIsConnected(true);
                    },
                    disconnected: () => {
                        console.log("⚠️ Disconnected from ActivityChannel");
                        setIsConnected(false);
                    },
                    received: (data: MessageType) => {
                        setMessages(prev => [...prev, data])
                    }
                }
            );

            subscriptionRef.current = subscription;

            return () => {
                if (subscriptionRef.current) {
                    cable.subscriptions.remove(subscriptionRef.current);
                    subscriptionRef.current = null;
                }
                setIsConnected(false);
            };
        } catch (error) {
            console.error('Failed to create subscription:', error);
            setIsConnected(false);
        }
    }, [activityId, currentUserId]);

    const sendMessage = (body: string) => {
        if (!currentUserId) return;

        subscriptionRef.current?.perform('send_message', { body });
    };

    return { messages, sendMessage, isConnected };
}