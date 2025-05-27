import { useParams } from 'react-router-dom';

const User = ()  => {
    const params = useParams();
    const username = params.username;

    return (
        <h1 className="text-2xl font-bold">User {username}</h1>
    );
};

export default User;