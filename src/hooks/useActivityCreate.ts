import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiFetch } from '../utils/apiClient';
import { UserType } from '../types/userTypes';
import { ActivityFormType } from '../types/activityTypes';

export function useActivityCreate(user: UserType | null) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        description: '',
        location: '',
        start_time: new Date(
            Math.round((new Date().getTime() + 14 * 24 * 60 * 60 * 1000) / (60 * 60 * 1000)) * 60 * 60 * 1000
        ),
        max_participants: 5,
        minimum_age: 18,
        maximum_age: 26
    });
    const [loading, setLoading] = useState(false);
    const [generatingDescription, setGeneratingDescription] = useState(false);

    const handleChange = <K extends keyof ActivityFormType>(
        key: K,
        value: ActivityFormType[K]
    ) => setForm(prev => prev ? ({ ...prev, [key]: value }) : prev);

    const handleGenerateDescription = async () => {
        setGeneratingDescription(true);

        try {
            const response = await apiFetch('/activities/generate_description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    activity: {
                        title: form.title,
                        location: form.location,
                        start_time: form.start_time,
                        max_participants: form.max_participants,
                        minimum_age: form.minimum_age,
                        maximum_age: form.maximum_age
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate description');
            }

            const { request_id } = await response.json();

            if (!request_id) throw new Error('Invalid response: request_id is missing');

            const pollStatus = async (request_id: string, retries = 5, delay = 2000) => {
                let lastError: unknown = null;

                await new Promise(resolve => setTimeout(resolve, 1000));

                for (let i = 0; i < retries; i++) {
                    try {
                        const statusResponse = await apiFetch(`/activities/description_status/${request_id}`, { method: 'GET' });

                        if (!statusResponse.ok) {
                            lastError = new Error(`Polling failed with HTTP ${statusResponse.status}`);
                            continue;
                        }

                        const { status, description, message } = await statusResponse.json();

                        if (status == 'completed' && description) {
                            setForm(prev => ({ ...prev, description }));
                            toast.success('Description generated!', {
                                position: 'bottom-center',
                                autoClose: 2000,
                                theme: 'dark'
                            })
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

        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Could not generate description', {
                    position: 'bottom-center',
                    autoClose: 3000
                })
            }
            console.log(error);
        } finally {
            setGeneratingDescription(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            return toast.error('You must be logged in', {
                position: 'bottom-center',
                autoClose: 3000
            });
        }

        setLoading(true);

        try {
            const response = await apiFetch('/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activity: form }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data?.errors || 'Failed to create activity');
            }

            toast.success('Activity created!', {
                position: 'bottom-center',
                autoClose: 3000,
                theme: 'dark',
                className: 'bg-gradient text-white',
            });

            const { id } = await response.json();
            navigate(`/activities/${id}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || 'Something went wrong', {
                    position: 'bottom-center',
                    autoClose: 3000
                });
            } else {
                toast.error('Something went wrong', {
                    position: 'bottom-center',
                    autoClose: 3000
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        loading,
        generatingDescription,
        handleChange,
        handleGenerateDescription,
        handleSubmit
    };
}