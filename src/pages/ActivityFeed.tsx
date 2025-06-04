import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

type Activity = {
    id: number;
    title: string;
    description: string;
    location: string;
    start_time: string;
    max_participants: number;
    minimum_age: number;
    maximum_age: number;
}

const ActivityFeed: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch('/api/v1/activities');
                if (!response.ok) {
                    throw new Error('Failed to fetch activities');
                }
                const data = await response.json();
                setActivities(data);
            } catch (error) {
                console.error('Error fetching activities:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchActivities();
    }, []);

    if (loading) return <div>Loading activities...</div>;
    if (!activities.length) return <div>No activities found.</div>;

    return (
        <div>
            <h1 className="text-5xl font-bold">Activity Feed</h1>
            <p className="text-xl mt-6">This is the activity page. You can find activities here that you can choose to participate in.</p>

            <div className="mt-6">
                {activities.map((activity) => (
                   <Link to={`/activities/${activity.id}`} key={activity.id} className="block border rounded-lg mb-2 p-4">
                        <h2 className="font-semibold text-2xl mb-1">{activity.title}</h2>
                        <p className="mb-2">{activity.description}</p>
                        <p><span className="text-yellow-700">Location: </span>{activity.location}</p>
                        <p><span className="text-yellow-700">Max Participants: </span><span className="font-semibold">{activity.max_participants}</span></p>
                        <p><span className="text-yellow-700">Age Range: </span>{activity.minimum_age} - {activity.maximum_age}</p>
                        <p><span className="text-yellow-700">Start time: </span>{new Date(activity.start_time).toLocaleString()}</p>
                    </Link> 
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;