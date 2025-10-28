import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { apiFetch } from '../utils/apiClient';

import { ParticipantProfileType } from '../types/participantTypes';
import ParticipantProfileCard from '../components/ParticipantProfileCard';

const userCache = new Map<string, ParticipantProfileType>();

const Participant = () => {
    const params = useParams();
    const username = params.username;
    const [participantProfile, setParticipantProfile] = useState<ParticipantProfileType | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (userCache.has(username!)) {
            setParticipantProfile(userCache.get(username!)!);
            setLoading(false);
            return;
        }

        apiFetch(`/users/${username}`)
            .then(response => response.json())
            .then(data => {
                setParticipantProfile(data);
                userCache.set(username!, data);
            })
            .catch(error => console.error('Error fetching user:', error))
            .finally(() => setLoading(false));
    }, [username])

    if (loading) return <p>Loading...</p>;
    if (!participantProfile) return <p>User not found</p>;

    return (
        // TODO: merge Profile and Participant into one component
        <div className="max-w-xl w-full mx-auto p-6 text-white">
            <div className="flex justify-between mb-4">
                <a className="text-sm text-coral-light cursor-pointer hover:underline" onClick={() => navigate(-1)}>← Back to Activity</a>
            </div>

            <ParticipantProfileCard profile={participantProfile} />
        </div>
    );
};

export default Participant;