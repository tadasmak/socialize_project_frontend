import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import activityCache from '../utils/activityCache';

import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ActivityCreateType } from '../types/activityTypes';
import ConfirmModal from '../components/ConfirmModal'

const Activity = () => {
    const params = useParams();
    const id = params.id;
    const [activity, setActivity] = useState<ActivityCreateType | null>(null);
    
    const [showConfirmModal, setShowConfirmModal] = useState(false);
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
        <>
            <div className="max-w-4xl mx-auto p-6 text-white">
                
                <div className="flex justify-between mb-4">
                    <Link to="/activities" className="text-sm text-coral-light hover:underline cursor-pointer">← Back to Activities</Link>
                    { user && user.id === activity.creator.id && (<Link to={`/activities/${id}/edit`} className="text-sm text-gray-300 mr-2 cursor-pointer hover:text-white hover:underline">✏️ Edit</Link>) }
                </div>

                <div className="bg-[#292929] ring-1 ring-black ring-opacity-5 rounded-xl p-6 shadow-lg">
                    {activity.participants.length >= activity.max_participants && <p className="mb-4">⚠️ <small className="text-yellow-500">This activity is full. Try other activities!</small></p>}

                    <img src="../src/assets/activities/cycling.jpg" alt="Activity Icon" className="w-80 object-cover rounded-lg mb-6" />

                    <h2 className="text-3xl font-bold">{activity.title}</h2>
                        
                    <p className="mt-2 text-gray-400">Created by <Link to={`/participants/${activity.creator.username}`} className="text-white hover:underline">@{activity.creator.username}</Link></p>

                    <div className="mt-4 grid gap-1 text-md">
                        <p>📍 <span className="text-coral-light">Location: </span><span className="text-gray-300 font-semibold">{activity.location}</span></p>
                        <p>👥 <span className="text-coral-light">Participants: </span><span className="text-gray-300 font-semibold">{activity.participants.length} / {activity.max_participants}</span></p>
                        <p>🎂 <span className="text-coral-light">Age range: </span><span className="text-gray-300 font-semibold">{`${activity.minimum_age} - ${activity.maximum_age}`}</span></p>
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
                            <Link to={`/participants/${user.username}`} key={user.username} className="flex items-center space-x-2 hover:underline">
                                <img src='../src/assets/icons/profile-icon-placeholder.svg' className="w-8 h-8 rounded-full" />
                                <span className="text-gray-200">@{user.username}</span>
                            </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        {(() => {
                            if (!user) {
                                return <Link to="/participants/login" className="text-coral font-semibold px-4 py-2 rounded hover:underline">Login to join this activity</Link>;
                            }
                            if (user.id === activity.creator.id) {
                                return <div className="text-yellow-500 font-semibold px-4 py-2 rounded cursor-default">👑 You are the creator of this activity</div>;
                            }
                            if (activity.participants.some(participant => participant.id === user.id)) {
                                return <div className="text-green-500 font-semibold px-4 py-2 rounded cursor-default">✅ You already participate in this activity</div>;
                            }
                            return (
                                <>
                                    <button
                                        onClick={() => setShowConfirmModal(true)}
                                        className="bg-coral text-white font-semibold px-4 py-2 rounded hover:bg-coral-darker cursor-pointer disabled:opacity-60"
                                        disabled={activity.participants.length >= activity.max_participants}
                                        data-tooltip-id={activity.participants.length >= activity.max_participants ? "join-tooltip" : undefined}
                                        data-tooltip-content={activity.participants.length >= activity.max_participants ? "This activity is full. Try other activities!" : undefined}
                                    >
                                    Join Activity
                                    </button>
                                    {activity.participants.length >= activity.max_participants && (
                                        <Tooltip className="!bg-[#292929] !text-yellow-400" id="join-tooltip" place="bottom" delayShow={0} />
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Join this activity?"
                description="Are you sure you want to join this activity?"
                onConfirm={joinActivity}
                confirmText="Yes, join"
                cancelText="Cancel"
            />
        </>
    );
};

export default Activity;