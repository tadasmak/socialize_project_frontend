import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { toast } from 'react-toastify';

import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface ActivityType {
    title: string;
    description: string;
    location: string;
    start_time: string;
    max_participants: number;
    age_range: string;
    creator: {
        id: number;
        username: string;
    }
    participants: Array<{
        id: number;
        username: string;
        age: number;
    }>
}

const activityCache = new Map<string, ActivityType>();

const Activity = () => {
    const params = useParams();
    const id = params.id;
    const [activity, setActivity] = useState<ActivityType | null>(null);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    const fetchActivity = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiFetch(`/api/v1/activities/${id}`);
            if (!response.ok) throw new Error('Failed to fetch activity');

            const data = await response.json();
            setActivity(data);
            activityCache.set(id!, data);
        } catch (error) {
            console.error('Error fetching activity:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (activityCache.has(id!)) {
            setActivity(activityCache.get(id!)!);
            setLoading(false);
            return;
        }

        fetchActivity();
    }, [id, fetchActivity])
    
    const joinActivity = async () => {
        if (!user) return alert('You must be logged in to join an activity');

        try {
            const response = await apiFetch(`/api/v1/activities/${id}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();

                const errorMessage = data?.errors || 'Failed to join activity';
                alert(errorMessage);
                return;
            } else {
                toast.success('You have joined the activity!', {
                    position: 'bottom-center',
                    autoClose: 3000,
                    pauseOnHover: true,
                    theme: 'dark',
                    className: 'bg-gradient text-white',
                });

                fetchActivity();
            }
        } catch (error) {
            alert('An error occurred while trying to join the activity. Please try again');
            console.error(error);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (!activity) return <p>Activity not found</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 text-white">
            
            <div className="flex justify-between mb-4">
                <Link to="/activities" className="text-sm text-coral-light hover:underline cursor-pointer">← Back to Activities</Link>
                { user && user.id === activity.creator.id && (<button className="text-sm text-gray-300 mr-2 cursor-pointer hover:text-white hover:underline">✏️ Edit</button>) }
            </div>

            <div className="card rounded-xl p-6 shadow-lg">
                <img src="../src/assets/activities/cycling.jpg" alt="Activity Icon" className="w-80 object-cover rounded-lg mb-6" />

                <h2 className="text-3xl font-bold">{activity.title}</h2>
                    
                <p className="mt-2 text-gray-400">Created by <Link to={`/users/${activity.creator.username}`} className="text-white hover:underline">@{activity.creator.username}</Link></p>

                <div className="mt-4 grid gap-1 text-md">
                    <p>📍 <span className="text-coral-light">Location: </span><span className="text-gray-300 font-semibold">{activity.location}</span></p>
                    <p>👥 <span className="text-coral-light">Participants: </span><span className="text-gray-300 font-semibold">{activity.participants.length} / {activity.max_participants}</span></p>
                    <p>🎂 <span className="text-coral-light">Age range: </span><span className="text-gray-300 font-semibold">{activity.age_range}</span></p>
                    <p>📅 <span className="text-coral-light">Start time: </span><span className="text-gray-300 font-semibold">{new Date(activity.start_time).toLocaleString()}</span></p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-300">{activity.description}</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Participants</h3>
                    <div className="flex flex-wrap gap-4">
                        {activity.participants.map((user) => (
                        <Link to={`/users/${user.username}`} key={user.username} className="flex items-center space-x-2 hover:underline">
                            <img src='../src/assets/icons/profile-icon-placeholder.svg' className="w-8 h-8 rounded-full" />
                            <span className="text-gray-200">@{user.username}</span>
                        </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    {(() => {
                        if (!user) {
                            return <Link to="/users/login" className="text-coral font-semibold px-4 py-2 rounded hover:underline">Login to join this activity</Link>;
                        }
                        if (user.id === activity.creator.id) {
                            return <div className="text-yellow-500 font-semibold px-4 py-2 rounded cursor-default">👑 You are the creator of this activity</div>;
                        }
                        if (activity.participants.some(participant => participant.id === user.id)) {
                            return <div className="text-green-500 font-semibold px-4 py-2 rounded cursor-default">✅ You already participate in this activity</div>;
                        }
                        return <button onClick={() => joinActivity()} className="bg-coral text-white font-semibold px-4 py-2 rounded hover:bg-coral-darker cursor-pointer">Join Activity</button>;
                    })()}
                </div>
            </div>
        </div>
    );
};

export default Activity;