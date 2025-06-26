import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface UserProfileType {
    username: string;
    personality: number;
    age: number;
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

const UserProfile = ()  => {
    const params = useParams();
    const username = params.username;
    const [user, setUser] = useState<UserProfileType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/v1/users/${username}`)
        .then(response => response.json())
        .then(data => setUser(data))
        .catch(error => console.error('Error fetching user:', error))
        .finally(() => setLoading(false));
    }, [username])

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 text-white">
            <div className="flex justify-between mb-4">
                <Link to="/activities" className="text-sm text-coral-light hover:underline">← Back to Activities</Link>
            </div>

            <div className="card rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                    <img src="../src/assets/icons/profile-icon-placeholder.svg" className="w-16 h-16 rounded-full" />
                    <div>
                        <h2 className="text-3xl font-semibold">@{user.username}</h2>
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

export default UserProfile;