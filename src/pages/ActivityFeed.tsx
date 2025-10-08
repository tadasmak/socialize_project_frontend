import React, { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';

import { apiFetch } from '../utils/apiClient';

import { ActivityCardType } from '../types/activityTypes';

import ActivityCard from '../components/Activity/ActivityCard';

const PAGE_SIZE = 10;

const ActivityFeed: React.FC = () => {
    const [activities, setActivities] = useState<ActivityCardType[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasActivitiesRemaining, setHasActivitiesRemaining] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page') || '1', 10);

    useEffect(() => {
        const params = {
            page: searchParams.get('page') || '1',
            limit: PAGE_SIZE.toString(),
            q: searchParams.get('q') || ''
        }

        const searchQuery = searchParams.get('q');
        if (searchQuery) {
            params.q = searchQuery;
        }

        const fetchActivities = async () => {
            setLoading(true);

            try {
                const query = new URLSearchParams(params).toString();
                const response = await apiFetch(`/activities?${query}`);

                if (!response.ok) throw new Error('Failed to fetch activities');

                const data = await response.json();
                setActivities(data.activities);
                setHasActivitiesRemaining(data.activities_remain);
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
        <>
            {page == 1 && (
                <>
                    <h1 className="text-4xl md:text-5xl font-bold">Activity Feed</h1>
                    <p className="text-lg md:text-xl mt-6">This is the activity page. You can find activities here that you can choose to participate in.</p>
                </>
            )}

            <div className="my-6 grid justify-center grid-cols-1 lg:grid-cols-2 gap-4">
                {activities.map((activity) => (
                    <ActivityCard key={activity.id} {...activity} />
                ))}
            </div>

            <div className="flex justify-center mt-auto mb-8 md:mb-4 gap-2">
                <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="px-4 py-2 w-24 rounded bg-coral hover:bg-coral-darker text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                <span className="px-4 py-2">{page}</span>
                <button onClick={() => goToPage(page + 1)} disabled={!hasActivitiesRemaining} className="px-4 py-2 w-24 rounded bg-coral hover:bg-coral-darker text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
            </div>
        </>
    );
};

export default ActivityFeed;