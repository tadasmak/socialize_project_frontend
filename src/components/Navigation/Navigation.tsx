import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import ProfileDropdown from './ProfileDropdown';
import ConfirmModal from '../ConfirmModal';

const navigationItems = [
  { name: 'Activities', href: '/', current: true },
]

export default function Navigation() {
    const { user, logout } = useAuth();
    const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <>
        <nav className="bg-gradient">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="flex justify-between relative items-center h-16">
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
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <Link to="/activities/new" className="bg-coral hover:bg-coral-darker duration-100 inline-flex items-center text-sm font-medium rounded-md px-4 py-2">
                                        <img className="h-4 mr-2" src="../src/assets/icons/plus.svg" />
                                        New Activity
                                    </Link>

                                    <ProfileDropdown user={user} onLogout={() => setShowConfirmModal(true)} />
                                </>
                            ) : (
                                <>
                                    <Link to="/participants/login" className="text-sm font-medium text-white hover:underline">Login</Link>
                                    <Link to="/participants/register" className="bg-coral hover:bg-coral-darker duration-100 text-sm font-medium rounded-md px-4 py-2 text-white">Register</Link>
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