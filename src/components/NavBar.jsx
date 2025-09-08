import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import SearchComponent from './SearchComponent';

function NavBar({ isMobile, toggleSidebar, isSidebarOpen }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavClick = (section) => {
        console.log(`Navigating to: ${section}`);
        setIsMenuOpen(false);
    };

    const baseClass = "hover:text-secondary transition-colors duration-200 font-medium text-sm lg:text-base";
    const activeClass = "font-medium text-secondary";

    return (
        <nav className="text-white">
            <div className="flex items-center justify-between">
                {/* Mobile: Hamburger + Logo */}
                {isMobile && (
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                            aria-label="Toggle sidebar"
                        >
                            {isSidebarOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                        <h2 className="text-lg font-bold">Music</h2>
                    </div>
                )}

                {/* Desktop: Logo */}
                {!isMobile && (
                    <div className="flex-shrink-0">
                        <h2 className="text-xl font-bold cursor-pointer transition-colors duration-200">
                            Music
                        </h2>
                    </div>
                )}

                {/* Desktop Navigation - Hidden on mobile */}
                <ul className="hidden md:flex space-x-4 lg:space-x-8">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? `${baseClass} ${activeClass}` : baseClass
                            }
                        >
                            MUSIC
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/live"
                            className={({ isActive }) =>
                                isActive ? `${baseClass} ${activeClass}` : baseClass
                            }
                        >
                            LIVE
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/podcast"
                            className={({ isActive }) =>
                                isActive ? `${baseClass} ${activeClass}` : baseClass
                            }
                        >
                            PODCAST
                        </NavLink>
                    </li>
                </ul>

                {/* Search Component - Responsive sizing */}
                <div className={`
                    ${isMobile
                        ? 'flex-1 max-w-xs mx-2'
                        : 'hidden lg:block flex-1 max-w-md mx-4 xl:mx-8'
                    }
                `}>
                    <SearchComponent />
                </div>

                {/* Desktop Right Menu */}
                <div className="hidden md:flex items-center space-x-3 lg:space-x-6">
                    <button
                        onClick={() => handleNavClick('settings')}
                        className="hover:text-secondary transition-colors duration-200 font-medium text-sm lg:text-base"
                    >
                        SETTINGS
                    </button>
                    <button
                        onClick={() => handleNavClick('auth')}
                        className="bg-secondary hover:bg-thirdary px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg transition-colors duration-200 font-medium text-sm lg:text-base"
                    >
                        LOGIN
                    </button>
                </div>

                {/* Mobile Menu Button */}
                {isMobile && (
                    <button
                        onClick={toggleMenu}
                        className="flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <span className={`w-5 h-0.5 bg-white transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                        <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-5 h-0.5 bg-white transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                    </button>
                )}
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobile && (
                <div className={`
                    transition-all duration-300 overflow-hidden mt-4
                    ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                    <div className="px-2 pt-4 pb-3 space-y-1 bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-700">
                        {/* Mobile Navigation Links */}
                        <NavLink
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) => `
                                block px-3 py-3 rounded-md transition-colors duration-200 font-medium
                                ${isActive
                                    ? 'text-secondary bg-gray-700/50'
                                    : 'text-white hover:text-secondary hover:bg-gray-700/50'
                                }
                            `}
                        >
                            MUSIC
                        </NavLink>
                        <NavLink
                            to="/live"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) => `
                                block px-3 py-3 rounded-md transition-colors duration-200 font-medium
                                ${isActive
                                    ? 'text-secondary bg-gray-700/50'
                                    : 'text-white hover:text-secondary hover:bg-gray-700/50'
                                }
                            `}
                        >
                            LIVE
                        </NavLink>
                        <NavLink
                            to="/podcast"
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) => `
                                block px-3 py-3 rounded-md transition-colors duration-200 font-medium
                                ${isActive
                                    ? 'text-secondary bg-gray-700/50'
                                    : 'text-white hover:text-secondary hover:bg-gray-700/50'
                                }
                            `}
                        >
                            PODCAST
                        </NavLink>

                        <hr className="border-gray-600 my-2" />

                        <button
                            onClick={() => handleNavClick('settings')}
                            className="w-full text-left px-3 py-3 text-white hover:text-secondary hover:bg-gray-700/50 rounded-md transition-colors duration-200 font-medium"
                        >
                            SETTINGS
                        </button>
                        <button
                            onClick={() => handleNavClick('auth')}
                            className="w-full px-3 py-3 mt-2 bg-secondary hover:bg-thirdary text-white rounded-md text-center transition-colors duration-200 font-medium"
                        >
                            LOGIN
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;