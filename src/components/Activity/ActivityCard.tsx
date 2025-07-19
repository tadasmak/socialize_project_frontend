import React from 'react';
import { Link } from 'react-router-dom';

type ActivityCardProps = {
    id: number;
    title: string;
    description: string;
    location: string;
    start_time: Date;
    participants_count: number;
    max_participants: number;
    minimum_age: number;
    maximum_age: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
    id,
    title,
    description,
    location,
    start_time,
    participants_count,
    max_participants,
    minimum_age,
    maximum_age
}) => {
    return (
        <Link to={`/activities/${id}`} key={id} className="bg-[#292929] ring-1 ring-black ring-opacity-5 shadow-lg flex max-w-175 rounded-lg p-3">
        <div className="flex items-center min-w-45 w-45 aspect-square mr-4">
            <img src="../src/assets/activities/cycling.jpg" alt="Activity Icon" className="w-full object-cover rounded-lg" />
        </div>
        <div className="px-2 flex-grow overflow-hidden">
            <h2 className="font-semibold truncate text-2xl mb-1">{title}</h2>
            <p className="truncate mb-2">{description}</p>
            <p className="truncate"><span className="text-coral-light">Location: </span>{location}</p>
            <p><span className="text-coral-light">Participants: </span>{participants_count}/{max_participants}</p>
            <p><span className="text-coral-light">Age Range: </span>{minimum_age} - {maximum_age}</p>
            <p className="truncate"><span className="text-coral-light">Start time: </span>{new Date(start_time).toLocaleString()}</p>
        </div>
    </Link>
    )
}

export default ActivityCard;