import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ActivityType {
    title: string;
    description: string;
    start_time: string;
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
            <small className="text-yellow-700">Activity</small>

            <h1 className="text-xl font-bold">{activity.title}</h1>
            <p>{activity.description}</p>
            <span className="font-semibold">Start time: </span>
            <small className="text-yellow-700">{new Date(activity.start_time).toLocaleString()}</small>
        </div>
    );
};

export default Activity;