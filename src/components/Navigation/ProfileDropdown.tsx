import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import { UserIcon, SettingsIcon, MenuIcon, LogOutIcon, LogInIcon, UserPlusIcon } from 'lucide-react';

type ProfileDropdownProps = {
  onLogout: () => void;
};

export default function ProfileDropdown({ onLogout }: ProfileDropdownProps ) {
    const { user } = useAuth();

    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex items-center p-2 text-white rounded cursor-pointer transition hover:bg-black/30 focus:outline-none">
                <MenuIcon size={18} className="w-6 h-6 rounded-full" />
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-[#292929] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                { user ? (
                    <>
                        <MenuItem>
                            {({ focus }) => (
                                <Link to="/participants/me" className={`flex items-center justify-center text-center font-medium p-4 text-white text-sm cursor-pointer ${focus && 'bg-[#222]'}`}>
                                    <UserIcon size={20} className="mr-2" />
                                    @{user?.username}
                                </Link>
                            )}
                        </MenuItem>
                        
                        <div className="border-b border-black" />

                        <MenuItem>
                            {({ focus }) => (
                                <Link to="/settings" className={`flex items-center px-4 py-2 text-sm text-white cursor-pointer ${focus && 'bg-[#222]'}`}>
                                    <SettingsIcon size={18} className="mr-2" />
                                    <span>Settings</span>
                                </Link>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ focus }) => (
                                <button onClick={onLogout} className={`flex items-center w-full text-left px-4 py-2 text-sm text-rose-500 cursor-pointer ${focus && 'bg-[#222]'}`}>
                                    <LogOutIcon size={18} className="mr-2 text-rose-500" />
                                    Logout
                                </button>
                            )}
                        </MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem>
                            {({ focus }) => (
                                <Link to="/participants/login" className={`flex items-center font-medium p-4 text-white text-sm cursor-pointer ${focus && 'bg-[#222]'}`}>
                                    <LogInIcon size={18} className="mr-2 text-green-500" />
                                    Log in
                                </Link>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ focus }) => (
                                <Link to="/participants/register" className={`flex items-center font-medium p-4 text-white text-sm cursor-pointer ${focus && 'bg-[#222]'}`}>
                                    <UserPlusIcon size={18} className="mr-2 text-yellow-400" />
                                    Sign up
                                </Link>
                            )}
                        </MenuItem>
                    </>
                )}
                
            </MenuItems>
        </Menu>
    );
}
