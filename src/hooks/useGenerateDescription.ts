import { useState } from 'react';
import { toast } from 'react-toastify';
import { apiFetch } from '../utils/apiClient';

export function useGenerateDescription<T extends { description?: string }>(
    setActivity: React.Dispatch<React.SetStateAction<T>>
) {
    const [generatingDescription, setGeneratingDescription] = useState(false);

    const generateDescription = async (activity: T) => {
        if (!activity) return;
        setGeneratingDescription(true);

        try {
            const response = await apiFetch('/activities/generate_description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activity })
            });

            if (!response.ok) throw new Error('Failed to generate description');

            const { request_id } = await response.json();
            if (!request_id) throw new Error('Missing request_id');

            const pollStatus = async (request_id: string, retries = 5, delay = 2000) => {
                let lastError: unknown = null;
                await new Promise(resolve => setTimeout(resolve, 1000));

                for (let i = 0; i < retries; i++) {
                    try {
                        const statusResponse = await apiFetch(`/activities/description_status/${request_id}`, { method: 'GET' });
                        if (!statusResponse.ok) {
                            lastError = new Error(`Polling failed: ${statusResponse.status}`);
                            continue;
                        }

                        const { status, description, message } = await statusResponse.json();

                        if (status == 'completed' && description) {
                            setActivity(prev => prev ? { ...prev, description } : prev);
                            toast.success('Description generated!', { position: 'bottom-center', autoClose: 2000, theme: 'dark' });
                            return;
                        }

                        if (status === 'pending') continue;
                        if (status === 'error') throw new Error(message || 'Description generation failed');
                        lastError = new Error(`Unexpected status: ${status}`);
                    } catch (error) {
                        lastError = error;
                    }

                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                throw lastError || new Error(('Polling timed out'));
            }

            await pollStatus(request_id);

        } catch (e) {
            toast.error((e as Error).message || 'Could not generate description', {
                position: 'bottom-center',
                autoClose: 3000
            })
        } finally {
            setGeneratingDescription(false);
        }
    };

    return { generatingDescription, generateDescription };
}