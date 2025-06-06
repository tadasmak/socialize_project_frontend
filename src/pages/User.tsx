import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface UserType {
    username: string;
    personality: string;
    age: number;
}

const User = ()  => {
    const params = useParams();
    const username = params.username;
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/v1/users/${username}`)
        .then(response => response.json())
        .then(data => setUser(data))
        .catch(error => console.error('Error fetching user:', error))
        .finally(() => setLoading(false));
    }, [username])

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold">User {user.username}</h1>
            <p className="mt-2">Personality: {user.personality}</p>
            <p className="mt-2">Age: {user.age}</p>
        </div>
    );
};

export default User;