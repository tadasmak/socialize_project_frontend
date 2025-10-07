import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiFetch } from '../utils/apiClient';
import activityCache from '../utils/activityCache';
import { UserType } from '../types/userTypes';
import { ActivityFormType } from '../types/activityTypes';

export function useActivityEdit(defaultActivity: ActivityFormType, user: UserType | null) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState<ActivityFormType>(defaultActivity);
    const [loadingFetch, setLoadingFetch] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [generatingDescription, setGeneratingDescription] = useState(false);

    useEffect(() => {
        apiFetch(`/activities/${id}`)
            .then(response => {
                if (response.status === 404) return null;
                return response.json();
            })
            .then(data => {
                setActivity({
                    ...data,
                    start_time: new Date(data.start_time)
                })
            })
            .finally(() => setLoadingFetch(false));
    }, [id]);

    const handleChange = <K extends keyof ActivityFormType>(
        key: K,
        value: ActivityFormType[K]
    ) => setActivity(prev => prev ? ({ ...prev, [key]: value }) : prev);

    const handleGenerateDescription = async () => {
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
                            lastError = new Error(`Polling failed with HTTP ${statusResponse.status}`);
                            continue;
                        }

                        const { status, description, message } = await statusResponse.json();

                        if (status == 'completed' && description) {
                            setActivity(prev => ({ ...prev, description }));
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

        } catch (e) {
            toast.error((e as Error).message || 'Could not generate description', {
                position: 'bottom-center',
                autoClose: 3000
            })
        } finally {
            setGeneratingDescription(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            return toast.error('You must be logged in', {
                position: 'bottom-center',
                autoClose: 3000
            });
        }
        setLoadingSubmit(true);
        try {
            const response = await apiFetch(`/activities/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(activity),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data?.errors || 'Failed to update the activity');
            }

            activityCache.delete(id!);

            toast.success('Activity updated!', {
                position: 'bottom-center',
                autoClose: 3000,
                theme: 'dark',
                className: 'bg-gradient text-white',
            });

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
            setLoadingSubmit(false);
        }
    };

    return {
        activity,
        loadingFetch,
        loadingSubmit,
        generatingDescription,
        handleChange,
        handleGenerateDescription,
        handleSubmit
    };
}


