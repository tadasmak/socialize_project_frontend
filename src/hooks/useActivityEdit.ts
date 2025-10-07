import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiFetch } from '../utils/apiClient';
import activityCache from '../utils/activityCache';
import { UserType } from '../types/userTypes';
import { ActivityFormType } from '../types/activityTypes';
import { useGenerateDescription } from './useGenerateDescription';

export function useActivityEdit(defaultActivity: ActivityFormType, user: UserType | null) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState<ActivityFormType>(defaultActivity);
    const [loadingFetch, setLoadingFetch] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const { generatingDescription, generateDescription } = useGenerateDescription(setActivity);

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
        generateDescription,
        handleSubmit
    };
}


