import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface ActivityType {
    title: string;
    description: string;
    location: string;
    start_time: string;
    max_participants: number;
    age_range: string;
    creator: {
        id: string;
        username: string;
    }
    participants: Array<{
        id: number;
        username: string;
        age: number;
    }>
}

const Activity = () => {
    const params = useParams();
    const id = params.id;
    const [activity, setActivity] = useState<ActivityType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/v1/activities/${id}`)
        .then(response => response.json())
        .then(data => setActivity(data))
        .catch(error => console.error('Error fetching activity:', error))
        .finally(() => setLoading(false));
    }, [id])

    if (loading) return <p>Loading...</p>;
    if (!activity) return <p>Activity not found</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 text-white">
            <div className="flex justify-between mb-4">
                <Link to="/activities" className="text-sm text-coral-light hover:underline cursor-pointer">← Back to Activities</Link>

                {/* if currentUser === activity.creator */}
                <button className="text-sm text-gray-300 hover:text-white cursor-pointer mr-2">✏️ Edit</button>
            </div>

            <div className="card rounded-xl p-6 shadow-lg">
                <img src="../src/assets/activities/cycling.jpg" alt="Activity Icon" className="w-80 object-cover rounded-lg mb-6" />

                <h2 className="text-3xl font-bold">{activity.title}</h2>
                    
                <p className="mt-2 text-gray-400">Created by <span className="text-white">@{activity.creator.username}</span></p>

                <div className="mt-4 grid gap-1 text-md">
                    <p>📍 <span className='text-coral-light'>Location: </span><span className="text-gray-300 font-semibold">{activity.location}</span></p>
                    <p>👥 <span className='text-coral-light'>Participants: </span><span className="text-gray-300 font-semibold">{activity.participants.length} / {activity.max_participants}</span></p>
                    <p>🎂 <span className='text-coral-light'>Age range: </span><span className="text-gray-300 font-semibold">{activity.age_range}</span></p>
                    <p>📅 <span className='text-coral-light'>Start time: </span><span className="text-gray-300 font-semibold">{new Date(activity.start_time).toLocaleString()}</span></p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-300">{activity.description}</p>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Participants</h3>
                    <div className="flex flex-wrap gap-4">
                        {activity.participants.map((user) => (
                        <div key={user.id} className="flex items-center space-x-2">
                            <img src='../src/assets/icons/profile-icon-placeholder.svg' className="w-8 h-8 rounded-full" />
                            <span className="text-gray-200">@{user.username}</span>
                        </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    <button className="bg-coral text-white font-semibold px-4 py-2 rounded hover:bg-coral-darker cursor-pointer">Join Activity</button>
                </div>
            </div>
        </div>
    );
};

export default Activity;