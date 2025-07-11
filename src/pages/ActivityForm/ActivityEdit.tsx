import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import activityCache from '../../utils/activityCache';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { ActivityEditType } from '../../types/activityTypes';

import MaxParticipantsSlider from './MaxParticipantsSlider';
import AgeRangeSlider from './AgeRangeSlider';

const defaultActivity: ActivityEditType = {
    title: '',
    description: '',
    location: '',
    start_time: new Date(),
    max_participants: 4,
    minimum_age: 18,
    maximum_age: 26
}

const ActivityEdit = () => {
    const params = useParams();
    const id = params.id;

    const { user } = useAuth();
    const [activity, setActivity] = useState<ActivityEditType>(defaultActivity);
    const [loadingFetch, setLoadingFetch] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        apiFetch(`/api/v1/activities/${id}`)
        .then(response => response.json())
        .then(data => {
            setActivity({
                title: data.title,
                description: data.description,
                location: data.location,
                start_time: new Date(data.start_time),
                max_participants: data.max_participants,
                minimum_age: data.minimum_age,
                maximum_age: data.maximum_age
            });
        })
        .catch(error => console.error('Error fetching activity: ', error))
        .finally(() => setLoadingFetch(false));
    }, [id])

    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const handleChange = <K extends keyof ActivityEditType>(
        key: K,
        value: ActivityEditType[K]
    ) => {     
        setActivity(prev => prev ? ({ ...prev, [key]: value }) : prev);
    };

    const [generatingDescription, setGeneratingDescription] = useState(false);

    const handleGenerateDescription = async () => {
        if (!activity) return;

        setGeneratingDescription(true);
        try {
            const response = await apiFetch('/api/v1/activities/generate_description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                title: activity.title,
                location: activity.location,
                start_time: activity.start_time,
                max_participants: activity.max_participants,
                minimum_age: activity.minimum_age,
                maximum_age: activity.maximum_age
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate description');
            }

            const data = await response.json();
            setActivity(prev => prev ? { ...prev, description: data.description } : prev );
            toast.success('Description generated!', {
                position: 'bottom-center',
                autoClose: 2000,
                theme: 'dark'
            });
        } catch (error) {
            toast.error('Could not generate description', {
                position: 'bottom-center',
                autoClose: 3000
            })

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
        setLoadingUpdate(true);
        try {
            const response = await apiFetch(`/api/v1/activities/${id}`, {
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
            setLoadingUpdate(false);
        }
    };

    if (loadingFetch) return <p>Loading...</p>;
    if (!user) return <p>Autehnticated user not found</p>;
    if (!activity) return <p>No activity data available</p>;

    return (
        <div className="justify-center max-w-2xl mx-auto text-white">
            <div className="flex justify-between mb-4">
                <Link to={`/activities/${id}`} className="text-sm text-coral-light hover:underline cursor-pointer">← Back to Activity</Link>
            </div>

            <div className="card rounded-xl shadow-lg px-8 md:px-16 py-8">
                <h2 className="text-3xl font-bold mb-6">Update Activity</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block mb-1 font-medium text-gray-300">Title</label>
                        <input
                            id="title"
                            name="title"
                            placeholder="Activity title"
                            value={activity.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] focus:outline-none focus:ring-2 focus:ring-bg-coral"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="description" className="block mb-1 font-medium text-gray-300">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Describe your activity"
                            value={activity.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] focus:outline-none focus:ring-2 focus:ring-bg-coral"
                            required
                        />
                        <button
                            type="button"
                            onClick={handleGenerateDescription}
                            disabled={generatingDescription || !activity.title || !activity.location || !!activity.description}
                            className="py-2 ml-auto rounded font-medium text-sm text-coral-light hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Generate description"
                        >
                            {generatingDescription ? '...' : 'Generate ✨'}
                        </button>
                    </div>

                    <div>
                        <label htmlFor="location" className="block mb-1 font-medium text-gray-300">Location</label>
                        <input
                            id="location"
                            name="location"
                            placeholder="Where will it take place?"
                            value={activity.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] focus:outline-none focus:ring-2 focus:ring-bg-coral"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="start_time" className="block mb-1 font-medium text-gray-300">Start Time</label>
                        <DatePicker
                            id="start_time"
                            selected={activity.start_time}
                            onChange={(date) => { if (date) handleChange('start_time', date); }}
                            showTimeSelect
                            timeIntervals={10}
                            dateFormat="Pp"
                            autoComplete="off"
                            className="w-full px-4 py-3 rounded bg-[#1d1d1d] text-white placeholder-gray-400 border border-[#444] cursor-pointer focus:outline-none focus:ring-2 focus:ring-bg-coral"
                            placeholderText="Select date and time"
                            required
                        />
                    </div>

                    <MaxParticipantsSlider value={activity.max_participants} onChange={(value: number) => handleChange("max_participants", value)} />
                    <AgeRangeSlider 
                        value={[activity.minimum_age, activity.maximum_age]}
                        onChange={(values: [number, number]) => {
                            handleChange("minimum_age", values[0]);
                            handleChange("maximum_age", values[1])
                        }}
                    />

                    <button
                        type="submit"
                        disabled={loadingUpdate}
                        className={`w-full mt-6 py-3 bg-coral hover:bg-coral-darker text-white rounded font-semibold cursor-pointer transition-colors duration-100 ${loadingUpdate ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loadingUpdate ? 'Updating...' : 'Update Activity'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ActivityEdit;