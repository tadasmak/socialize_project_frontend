import { useParams } from 'react-router-dom';

const Activity = () => {
    const params = useParams();
    const id = params.id;

    return (
        <h1 className="text-2xl font-bold">Activity {id}</h1>
    );
};

export default Activity;