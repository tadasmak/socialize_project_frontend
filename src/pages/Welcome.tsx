import { Link } from 'react-router-dom';

import coverImage from "../assets/welcome_cover.jpg";

const Welcome = () => {
    return (
        <div className="w-full p-0">
            <div
                className="flex justify-center items-center relative h-[70vh] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${coverImage})` }}
            >
                <div className="relative z-10 flex flex-col items-center text-center text-white w-[90%] max-w-3xl px-4">
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                        Meet new people. Participate in real-life activities. Find your crowd.
                    </h1>

                    <p className="text-lg md:text-2xl text-white/90 leading-relaxed mb-8">
                        Create, join, and chat in activities designed to match your age and
                        personality. Make real connections, offline.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/activities" className="bg-coral font-semibold text-white rounded-md py-2 px-5 md:py-3 md:px-7 md:text-lg hover:bg-coral-darker cursor-pointer transition-colors">
                            Explore Activities
                        </Link>
                        <Link to="/activities/new" className="bg-[#d99b97] text-black rounded-md py-2 px-5 md:py-3 md:px-7 md:text-lg cursor-pointer transition-colors">
                            Create Activity
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;