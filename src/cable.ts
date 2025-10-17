import { createConsumer, Cable } from '@rails/actioncable';

let consumer: Cable | null = null;

export function getCable(): Cable {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No auth token found.');
    if (consumer) return consumer;

    const url = `ws://localhost:3000/api/v1/cable?token=${token}`
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