import { Link } from 'react-router-dom';

import coverImage from "../assets/welcome_cover.jpg";

const Welcome = () => {
    return (
        <div className="w-full pb-12">
            <div
                className="flex justify-center items-center relative h-[80vh] sm:h-[70vh] w-full bg-cover bg-center"
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

            <section className="w-full py-16 px-6 md:px-12 lg:px-24 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-coral-light mb-6">
                    How It Works
                </h2>
                <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-12">
                    Join activities that fit your lifestyle, personality, and age group.
                    Everything happens in real life - so you can build genuine connections,
                    not just followers.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="p-6 border border-gray-400 bg-[#202020] rounded-2xl shadow-sm hover:bg-[#2a2a2a] hover:shadow-md transition-all select-none">
                        <h3 className="text-xl font-semibold text-coral-light mb-3">Create or Join</h3>
                        <p className="text-gray-300">
                            Post your own activity or join one nearby that matches your
                            personality and interests. From coffee chats to hikes - it's all
                            about real experiences.
                        </p>
                    </div>

                    <div className="p-6 border border-gray-400 bg-[#202020] rounded-2xl shadow-sm hover:bg-[#2a2a2a] hover:shadow-md transition-all select-none">
                        <h3 className="text-xl font-semibold text-coral-light mb-3">Age & Personality Match</h3>
                        <p className="text-gray-300">
                            Activities automatically show only to people within your preferred
                            age range and personality style, so you meet people who truly fit
                            your vibe.
                        </p>
                    </div>

                    <div className="p-6 border border-gray-400 bg-[#202020] rounded-2xl shadow-sm hover:bg-[#2a2a2a] hover:shadow-md transition-all select-none">
                        <h3 className="text-xl font-semibold text-coral-light mb-3">Chat & Confirm</h3>
                        <p className="text-gray-300">
                            Chat with participants before the event. Once an activity is confirmed,
                            it locks and becomes private, ensuring serious
                            participation.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Welcome;