import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

import { Search } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

import ProfileDropdown from './ProfileDropdown';
import ConfirmModal from '../ConfirmModal';

const navigationItems = [
    { name: 'Activities', href: '/', current: true },
]

export default function Navigation() {
    const { user, logout } = useAuth();

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const queryParam = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(queryParam);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        setSearchQuery(queryParam);
    }, [queryParam]);

    return (
        <>
            <nav className="bg-gradient">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/activities" className="flex items-center h-full inset-y-0 left-0">
                            <div className="flex flex-1 justify-center items-stretch mr-6">
                                <img alt="Social Eyes" src="../src/assets/branding/logo.png" className="h-10 w-auto" />
                                <div className="text-xl/10 font-bold ml-2">Social Eyes</div>
                            </div>
                            {navigationItems.map((item) => (
                                <div key={item.name} className={`flex h-full items-center px-4 text-md text-white font-medium ${item.current ? 'border-b-3 border-solid border-coral' : 'hover:bg-slate-700'}`}>{item.name}</div>
                            ))}
                        </Link>

                        <div className="flex items-center">
                            <form
                                role="search"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const query = searchQuery.trim();
                                    if (query) navigate(`/activities?q=${encodeURIComponent(query)}`);
                                    else navigate('/activities');
                                }}
                                className="flex items-center w-64 mr-4 bg-[#2e2e2e] rounded-md border border-slate-600 focus-within:ring-2 focus-within:ring-coral"
                                >
                                <Search className="text-slate-300 w-5 h-5 mx-3" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search activities..."
                                    aria-label="Search activities"
                                    className="w-full py-2 pr-2 text-sm bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                                />
                            </form>

                            <div className="flex items-center">
                                {user ? (
                                    <>
                                        <Link to="/activities/new" className="bg-coral hover:bg-coral-darker duration-100 inline-flex items-center text-sm font-medium rounded-md p-2.5 mr-2 md:px-4">
                                            <img className="h-4 md:mr-2" src="../src/assets/icons/plus.svg" />
                                            <span className="hidden md:inline">New Activity</span>
                                        </Link>
                                        <ProfileDropdown user={user} onLogout={() => setShowConfirmModal(true)} />
                                    </>
                                ) : (
                                    <>
                                        <Link to="/participants/login" className="text-sm font-medium text-white px-4 py-2 mr-2 hover:underline">Login</Link>
                                        <Link to="/participants/register" className="bg-coral hover:bg-coral-darker duration-100 text-white text-sm font-medium rounded-md px-4 py-2">Register</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Ready to leave?"
                description="You can always log back in at any time."
                onConfirm={logout}
                confirmText="Yes, log out"
                cancelText="Cancel"
            />
        </>
    )
}