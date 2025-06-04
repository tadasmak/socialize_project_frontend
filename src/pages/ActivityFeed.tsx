import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

type Activity = {
    id: string;
    title: string;
    description: string;
    start_time: string;
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
                        <h2 className="font-semibold text-2xl">{activity.title}</h2>
                        <p>{activity.description}</p>
                        <small className="text-yellow-700">{new Date(activity.start_time).toLocaleString()}</small>
                    </Link> 
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;