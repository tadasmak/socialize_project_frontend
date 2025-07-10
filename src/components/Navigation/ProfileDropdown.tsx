import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link } from 'react-router-dom';

import { ChevronDown, User, Settings, LogOut } from 'lucide-react';

interface Props {
    user: { username: string };
    onLogout: () => void;
}

const ProfileDropdown = ({ user, onLogout }: Props) => {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex items-center px-4 py-2 text-white rounded cursor-pointer">
                <img 
                    src="../src/assets/icons/profile-icon-placeholder.svg"
                    className="w-8 h-8 rounded-full mr-1"
                    alt="Profile"
                />
                <ChevronDown size={18} />
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-[#292929] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div>
                    <MenuItem>
                        {({ active }) => (
                            <Link
                                to="/participants/me"
                                className={`flex items-center justify-center text-center font-medium p-4 text-white text-sm cursor-pointer ${active && 'bg-[#222]'}`}
                            >
                                <User size={20} className="mr-2" />
                                @{user.username}
                            </Link>
                        )}
                    </MenuItem>
                    
                    <div className="border-b border-black" />

                    <MenuItem>
                        {({ active }) => (
                            <Link
                                to="/settings"
                                className={`flex items-center px-4 py-2 text-sm text-white cursor-pointer ${active && 'bg-[#222]'}`}
                            >
                                <Settings size={18} className="mr-2" />
                                <span>Settings</span>
                            </Link>
                        )}
                    </MenuItem>
                    <MenuItem>
                        {({ active }) => (
                            <button
                                onClick={onLogout}
                                className={`flex items-center w-full text-left px-4 py-2 text-sm text-rose-500 cursor-pointer ${active && 'bg-[#222]'}`}
                            >
                                <LogOut size={18} className="mr-2 text-rose-500" />
                                Logout
                            </button>
                        )}
                    </MenuItem>
                </div>
            </MenuItems>
        </Menu>
    );
}

export default ProfileDropdown;