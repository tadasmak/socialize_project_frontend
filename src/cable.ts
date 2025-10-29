import { createConsumer, Cable } from '@rails/actioncable';

let consumer: Cable | null = null;

export function getCable(): Cable {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No auth token found.');
    if (consumer) return consumer;

    const isDevelopment = import.meta.env.DEV;

    let url: string;
    if (isDevelopment) url = `ws://localhost:3000/api/v1/cable?token=${token}`;
    else {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        url = `${protocol}//${window.location.host}/api/v1/cable?token=${token}`;
    }

    consumer = createConsumer(url);

    return consumer;
}

export function resetCable(): void {
    if (consumer) {
        try { consumer = null; }
        catch (error) { console.error('Error resetting cable:', error); }
    }
}

export function isConnected(): boolean {
    return consumer !== null;
}