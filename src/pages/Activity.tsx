import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import activityCache from '../utils/activityCache';

import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

import { apiFetch } from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';
import { ActivityDetailType } from '../types/activityTypes';
import ConfirmModal from '../components/ConfirmModal';
import ActivityChat from '../components/Activity/ActivityChat';

import { MapPinIcon, UsersRoundIcon, CakeIcon, Calendar1Icon, BookTextIcon, MessageCircleMoreIcon } from 'lucide-react';
import cyclingImage from '../assets/activities/cycling.jpg';
import profilePlaceholderIcon from '../assets/icons/profile-icon-placeholder.svg';

const Activity = () => {
    const params = useParams();
    const id = params.id;
    const [activity, setActivity] = useState<ActivityDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details');

    type ConfirmModalState = {
        action: 'join' | 'leave' | 'cancel' | 'delete' | 'confirm';
        title: string;
        description: string;
        confirmText?: string;
        onConfirm: () => void;
    } | null;

    const [confirmModalState, setConfirmModalState] = useState<ConfirmModalState>(null);

    const { user } = useAuth();

    const fetchActivity = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiFetch(`/activities/${id}`);
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
            const response = await apiFetch(`/activities/${id}/join`, {
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

    const leaveActivity = async () => {
        try {
            const response = await apiFetch(`/activities/${id}/leave`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();

                const errorMessage = data?.errors || 'Failed to leave activity';
                alert(errorMessage);
                return;
            } else {
                toast.info('You have left the activity.', {
                    position: 'bottom-center',
                    autoClose: 3000,
                    pauseOnHover: true,
                    theme: 'dark',
                    className: 'bg-gradient text-white'
                })

                fetchActivity();
            }
        } catch (error) {
            alert('An error occured while trying to leave the activity');
            console.error(error);
        }
    }

    const confirmActivity = async () => {
        try {
            const response = await apiFetch(`/activities/${id}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();

                const errorMessage = data?.errors || 'Failed to confirm activity';
                alert(errorMessage);
                return;
            } else {
                toast.success('The activity has been confirmed', {
                    position: 'bottom-center',
                    autoClose: 3000,
                    pauseOnHover: true,
                    theme: 'dark',
                    className: 'bg-gradient text-white'
                })

                fetchActivity();
            }
        } catch (error) {
            alert('An error has occured while trying to confirm the activity');
            console.error(error);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (!activity) return <p>Activity not found</p>;

    const isCreator = user && user.id === activity.creator.id;
    const isFull = activity.participants.length >= activity.max_participants;
    const isWithinOneWeek = new Date(activity.start_time).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
    const isConfirmed = activity.status === "confirmed";
    const canConfirm = isCreator && isFull && isWithinOneWeek && !isConfirmed;
    const isUserParticipating = user && activity.participants.some(participant => participant.id === user.id);

    return (
        <>
            <div className="max-w-3xl w-full mx-auto text-white">
                <div className="flex justify-between mb-4">
                    <Link to="/activities" className="text-sm text-coral-light hover:underline cursor-pointer">← Back to Activities</Link>
                    {isCreator && (<Link to={`/activities/${id}/edit`} className="text-sm text-gray-300 mr-2 cursor-pointer hover:text-white hover:underline">✏️ Edit</Link>)}
                </div>

                <div className="bg-[#292929] ring-1 ring-black ring-opacity-5 rounded-xl py-6 px-8 shadow-lg">
                    <div className="flex border-b border-gray-700 mb-4">
                        <button
                            className={`flex items-center px-4 py-2 cursor-pointer ${activeTab === 'details' ? 'text-white font-medium border-b-2 border-coral' : 'text-gray-400'}`}
                            onClick={() => setActiveTab('details')}
                        >
                            <BookTextIcon className="mr-1" height={20} />
                            Details
                        </button>
                        <button
                            className={`flex items-center px-4 py-2 cursor-pointer ${activeTab === 'chat' ? 'text-white font-medium border-b-2 border-coral' : 'text-gray-400 hover:text-gray-200'}`}
                            onClick={() => setActiveTab('chat')}
                        >
                            <MessageCircleMoreIcon className="mr-1" height={20} />
                            Chat
                        </button>
                    </div>
                    {activeTab === 'details' && (
                        <div>
                            {isFull && <p className="mb-4">⚠️ <small className="text-yellow-500">This activity is full. Try other activities!</small></p>}

                            <img src={cyclingImage} alt="Activity Icon" className="w-80 object-cover rounded-lg mb-6" />

                            <h1 className="text-3xl font-bold">{activity.title}</h1>

                            <p className="mt-2 text-gray-400">Created by <Link to={`/participants/${activity.creator.username}`} className="text-white hover:underline">@{activity.creator.username}</Link></p>

                            <div className="mt-4 grid gap-1 text-md">
                                <div className="flex items-center gap-1">
                                    <MapPinIcon className="text-coral-light" height={18} />
                                    <span className="text-coral-light">Location:</span>
                                    <span className="text-gray-300 font-semibold">{activity.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <UsersRoundIcon className="text-coral-light" height={18} />
                                    <span className="text-coral-light">Participants:</span>
                                    <span className="text-gray-300 font-semibold">{activity.participants.length} / {activity.max_participants}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CakeIcon className="text-coral-light" height={18} />
                                    <span className="text-coral-light">Age range:</span>
                                    <span className="text-gray-300 font-semibold">{`${activity.minimum_age} - ${activity.maximum_age}`}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar1Icon className="text-coral-light" height={18} />
                                    <span className="text-coral-light">Start time:</span>
                                    <span className="text-gray-300 font-semibold">{new Date(activity.start_time).toLocaleString()}</span>
                                </div>
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
                                            <img src={profilePlaceholderIcon} className="w-8 h-8 rounded-full" />
                                            <span className="text-gray-200">@{user.username}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <div className="flex flex-col items-end">
                                    {(() => {
                                        if (!user) {
                                            return <Link to="/participants/login" className="text-coral font-semibold py-2 rounded hover:underline">Login to join this activity</Link>;
                                        }
                                        if (isCreator) {
                                            return (
                                                <>
                                                    <p className="text-yellow-500 font-semibold py-2 rounded cursor-default">👑 You are the creator of this activity</p>
                                                    {!isConfirmed && (
                                                        <>
                                                            <button
                                                                onClick={() => setConfirmModalState({
                                                                    action: "confirm",
                                                                    title: "Confirm this activity?",
                                                                    description: "This will lock the participant list. Are you sure you want to confirm?",
                                                                    confirmText: "Yes, confirm",
                                                                    onConfirm: async () => {
                                                                        await confirmActivity();
                                                                        setConfirmModalState(null);
                                                                    }
                                                                })}
                                                                className="ml-4 mt-4 rounded bg-green-600 text-white font-semibold px-4 py-2 cursor-pointer hover:not-disabled:bg-green-700 disabled:opacity-60"
                                                                disabled={!canConfirm}
                                                            >
                                                                ✅ Confirm Activity
                                                            </button>
                                                            {!canConfirm && (
                                                                <div className="mt-2 text-sm text-end text-gray-400 space-y-1">
                                                                    {!isFull && <p>Activity must be <span className="text-white font-medium">full</span> before it can be confirmed.</p>}
                                                                    {!isWithinOneWeek && <p>Activity can only be confirmed <span className="text-white font-medium">within one week</span> of its start date.</p>}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )
                                        }
                                        if (isUserParticipating) {
                                            return (
                                                <>
                                                    <p className="text-green-500 font-semibold py-2 rounded cursor-default">✅ You already participate in this activity</p>
                                                    <button
                                                        onClick={() => setConfirmModalState({
                                                            action: "leave",
                                                            title: "Leave this activity?",
                                                            description: "Are you sure you want to leave this activity?",
                                                            confirmText: "Yes, leave",
                                                            onConfirm: async () => {
                                                                await leaveActivity();
                                                                setConfirmModalState(null);
                                                            }
                                                        })}
                                                        className="text-red-500 text-right mt-4 cursor-pointer hover:underline"
                                                    >
                                                        Leave activity
                                                    </button>
                                                </>
                                            )
                                        }
                                        return (
                                            <>
                                                <button
                                                    onClick={() => setConfirmModalState({
                                                        action: "join",
                                                        title: "Join this activity?",
                                                        description: "Are you sure you want to join this activity?",
                                                        confirmText: "Yes, join",
                                                        onConfirm: async () => {
                                                            await joinActivity();
                                                            setConfirmModalState(null);
                                                        }
                                                    })}
                                                    className="bg-coral text-white font-semibold px-4 py-2 rounded hover:bg-coral-darker cursor-pointer disabled:opacity-60"
                                                    disabled={isFull}
                                                    data-tooltip-id={isFull ? "join-tooltip" : undefined}
                                                    data-tooltip-content={isFull ? "This activity is full. Try other activities!" : undefined}
                                                >
                                                    Join Activity
                                                </button>
                                                {isFull && (
                                                    <Tooltip className="!bg-[#292929] !text-yellow-400" id="join-tooltip" place="bottom" delayShow={0} />
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'chat' && isUserParticipating && <ActivityChat activityId={activity.id} />}
                </div>
            </div>

            {confirmModalState && (
                <ConfirmModal
                    isOpen={true}
                    onClose={() => setConfirmModalState(null)}
                    title={confirmModalState.title}
                    description={confirmModalState.description}
                    confirmText={confirmModalState.confirmText}
                    cancelText="Cancel"
                    onConfirm={confirmModalState.onConfirm}
                />
            )}
        </>
    );
};

export default Activity;