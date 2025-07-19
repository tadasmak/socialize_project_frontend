import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { apiFetch } from '../utils/api';

import { ActivityCardType } from '../types/activityTypes';

interface ProfileType {
    username: string;
    personality: number;
    age: number;
    joined_activities: ActivityCardType[];
    created_activities: ActivityCardType[];
}

const personalityDescriptions = [
    "Very Extroverted",
    "Extroverted",
    "Somewhat Extroverted",
    "Ambiverted",
    "Somewhat Introverted",
    "Introverted",
    "Very Introverted"
]

const Profile = ()  => {
    const [user, setUser] = useState<ProfileType | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        apiFetch(`/api/v1/current_user`)
        .then(response => response.json())
        .then(data => {
            setUser(data);
        })
        .catch(error => console.error('Error fetching user:', error))
        .finally(() => setLoading(false));
    }, [])

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 text-white">
            
            <div className="flex justify-between mb-4">
                <a className="text-sm text-coral-light cursor-pointer hover:underline" onClick={() => navigate(-1)}>← Back to Activity</a>
                <Link to="/participants/me/edit" className="text-sm text-gray-300 mr-2 cursor-pointer hover:text-white hover:underline">✏️ Edit</Link>
            </div>

            <div className="bg-[#292929] ring-1 ring-black ring-opacity-5 rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                    <img src="../src/assets/icons/profile-icon-placeholder.svg" className="w-16 h-16 rounded-full" />
                    <div>
                        <h1 className="text-3xl font-semibold">@{user.username}</h1>
                        <p className="text-gray-400">🎂 Age: { user.age ? <span className="text-gray-300 font-semibold">{user.age}</span> : <span>not given</span>}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-md font-medium mb-2">Personality: <span className="text-gray-400 font-normal">({personalityDescriptions[user.personality - 1] || "unknown"})</span></h4>
                    <div className="relative h-4 rounded-full bg-coral">
                        { user.personality && <div className="absolute top-1/2 w-4 h-4 rounded-full bg-white border-2 border-coral -translate-y-1/2" style={{ left: `${((user.personality - 1) / 6) * 100}%` }}></div>}
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-gray-400">
                        <span>Very Extroverted</span>
                        <span>Very Introverted</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;