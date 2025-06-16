import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface ActivityType {
    title: string;
    description: string;
    location: string;
    start_time: string;
    max_participants: number;
    minimum_age: number;
    maximum_age: number;
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
        <div>
            <small className="text-coral">Activity</small>

            <img src="../src/assets/activities/cycling.jpg" alt="Activity Icon" className="w-64 h-64 object-cover rounded-lg mt-1 mb-4" />

            <h1 className="text-2xl font-bold mb-1">{activity.title}</h1>
            <p className="mb-2">{activity.description}</p>
            <p><span className="text-coral">Location: </span>{activity.location}</p>
            <p><span className="text-coral">Max Participants: </span><span className="font-semibold">{activity.max_participants}</span></p>
            <p><span className="text-coral">Age Range: </span>{activity.minimum_age} - {activity.maximum_age}</p>
            <p><span className="text-coral">Start time: </span>{new Date(activity.start_time).toLocaleString()}</p>

            <div className="mt-4">
                <h2 className="text-lg font-semibold">Creator: <Link to={`/users/${activity.creator.username}`} className="text-coral">{activity.creator.username}</Link></h2>
            </div>

            <div className="mt-4">
                <h2 className="text-lg font-semibold">Participants:</h2>
                {activity.participants.map((participant) => (
                    <Link to={`/users/${participant.username}`} key={participant.id} className="block"><span className="text-coral">{participant.username}</span>{participant.username === activity.creator.username && ' (creator)'}</Link>
                ))}
            </div>
        </div>
    );
};

export default Activity;