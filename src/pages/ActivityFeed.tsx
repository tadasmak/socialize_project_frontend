import React, { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';

import { apiFetch } from '../utils/api';

import { ActivityCardType } from '../types/activityTypes';

import ActivityCard from '../components/Activity/ActivityCard';

const PAGE_SIZE = 10;

const ActivityFeed: React.FC = () => {
    const [activities, setActivities] = useState<ActivityCardType[]>([]);
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
                    <ActivityCard key={activity.id} {...activity} />
                ))}
            </div>

            <div className="flex justify-center mt-8 gap-2">
                <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="px-4 py-2 w-24 rounded bg-coral hover:bg-coral-darker text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                <span className="px-4 py-2">{page}</span>
                <button onClick={() => goToPage(page + 1)} className="px-4 py-2 w-24 rounded bg-coral hover:bg-coral-darker text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
            </div>
        </div>
    );
};

export default ActivityFeed;