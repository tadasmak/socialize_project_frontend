import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

type Activity = {
    id: number;
    title: string;
    description: string;
    location: string;
    start_time: string;
    participants_count: number;
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

            <div className="mt-6 grid justify-center grid-cols-1 lg:grid-cols-2 gap-4">
                {activities.map((activity) => (
                   <Link to={`/activities/${activity.id}`} key={activity.id} className="activity-container flex max-w-180 rounded-lg px-4 py-2">
                        <div className="flex items-center w-1/3 min-w-48 aspect-square mr-4">
                            <img src="../src/assets/activities/cycling.jpg" alt="Activity Icon" className="w-full object-cover" />
                        </div>
                        <div className="p-2 w-2/3 overflow-hidden">
                            <h2 className="font-semibold truncate text-2xl mb-1">{activity.title}</h2>
                            <p className="truncate mb-2">{activity.description}</p>
                            <p className="truncate"><span className="text-coral">Location: </span>{activity.location}</p>
                            <p><span className="text-coral">Participants: </span><span className="font-semibold">{activity.participants_count}/{activity.max_participants}</span></p>
                            <p><span className="text-coral">Age Range: </span>{activity.minimum_age} - {activity.maximum_age}</p>
                            <p className="truncate"><span className="text-coral">Start time: </span>{new Date(activity.start_time).toLocaleString()}</p>
                        </div>
                    </Link> 
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;