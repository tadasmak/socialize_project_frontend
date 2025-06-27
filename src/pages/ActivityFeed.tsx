import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from 'react-router-dom';

import { apiFetch } from '../utils/api';

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

const PAGE_SIZE = 10;

const ActivityFeed: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page') || '1', 10);

    useEffect(() => {
        const params = {
            page: searchParams.get('page') || '1',
            limit: PAGE_SIZE.toString()
        }

        const fetchActivities = async () => {
            setLoading(true);

            try {
                const query = new URLSearchParams(params).toString();
                const response = await apiFetch(`/api/v1/activities?${query}`);

                if (!response.ok) throw new Error('Failed to fetch activities');

                const data = await response.json();
                setActivities(data);
            } catch (error) {
                console.error('Error fetching activities:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchActivities();
    }, [searchParams]);

    const goToPage = (newPage: number) => {
        const params = Object.fromEntries(searchParams.entries());
        params.page = newPage.toString();
        setSearchParams(params);
    }

    if (loading) return <div>Loading activities...</div>;
    if (!activities.length) return <div>No activities found.</div>;

    return (
        <div>
            <h1 className="text-5xl font-bold">Activity Feed</h1>
            <p className="text-xl mt-6">This is the activity page. You can find activities here that you can choose to participate in.</p>

            <div className="mt-6 grid justify-center grid-cols-1 lg:grid-cols-2 gap-4">
                {activities.map((activity) => (
                   <Link to={`/activities/${activity.id}`} key={activity.id} className="card shadow-lg flex max-w-175 rounded-lg p-3">
                        <div className="flex items-center min-w-45 w-45 aspect-square mr-4">
                            <img src="../src/assets/activities/cycling.jpg" alt="Activity Icon" className="w-full object-cover rounded-lg" />
                        </div>
                        <div className="px-2 flex-grow overflow-hidden">
                            <h2 className="font-semibold truncate text-2xl mb-1">{activity.title}</h2>
                            <p className="truncate mb-2">{activity.description}</p>
                            <p className="truncate"><span className="text-coral-light">Location: </span>{activity.location}</p>
                            <p><span className="text-coral-light">Participants: </span><span className="font-semibold">{activity.participants_count}/{activity.max_participants}</span></p>
                            <p><span className="text-coral-light">Age Range: </span>{activity.minimum_age} - {activity.maximum_age}</p>
                            <p className="truncate"><span className="text-coral-light">Start time: </span>{new Date(activity.start_time).toLocaleString()}</p>
                        </div>
                    </Link> 
                ))}
            </div>

            <div className="flex justify-center mt-8 gap-2">
                <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="px-4 py-2 w-24 rounded bg-coral text-white disabled:opacity-50">Previous</button>
                <span className="px-4 py-2">{page}</span>
                <button onClick={() => goToPage(page + 1)} className="px-4 py-2 w-24 rounded bg-coral text-white disabled:opacity-50">Next</button>
            </div>
        </div>
    );
};

export default ActivityFeed;