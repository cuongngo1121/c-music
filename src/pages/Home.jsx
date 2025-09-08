import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import Banner from "../components/Banner";
import NewReleaseChart from "../components/NewReleaseChart";
import HomeChart from "../components/HomeChart";
import MusicFrame from "../components/MusicFrame";
import Footer from "../components/Footer";

function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            // Auto close sidebar on desktop
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="bg-primary-dark min-h-screen">
            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex h-screen overflow-hidden">
                {/* Sidebar - Responsive */}
                <aside className={`
                    ${isMobile
                        ? `fixed top-0 left-0 h-screen z-40 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        } w-64`
                        : 'w-1/5 min-w-[200px] fixed top-0 left-0 h-screen z-40 lg:w-1/5 md:w-1/4'
                    }
                    bg-gray-900 text-white p-4 shadow-2xl
                `}>
                    <SideBar toggleSidebar={toggleSidebar} />
                </aside>

                {/* Main content area */}
                <div className={`
                    ${isMobile
                        ? 'w-full'
                        : 'ml-[20%] w-4/5 lg:ml-[20%] lg:w-4/5 md:ml-[25%] md:w-3/4'
                    } 
                    flex flex-col h-screen
                `}>
                    {/* Navbar - Responsive */}
                    <header className={`
                        fixed top-0 z-30 shadow-lg backdrop-blur-sm bg-primary-dark/90
                        ${isMobile
                            ? 'left-0 w-full px-4'
                            : 'left-[20%] w-4/5 px-6 lg:left-[20%] lg:w-4/5 md:left-[25%] md:w-3/4'
                        }
                        py-4 border-b border-gray-800
                    `}>
                        <NavBar
                            isMobile={isMobile}
                            toggleSidebar={toggleSidebar}
                            isSidebarOpen={isSidebarOpen}
                        />
                    </header>

                    {/* Main scrollable content */}
                    <main className="mt-[64px] overflow-y-auto flex-1 relative">
                        {/* Content wrapper with responsive padding */}
                        <div className="p-4 pb-8 sm:p-6 sm:pb-12 lg:pb-16">
                            {/* Banner - Responsive */}
                            <div className="mb-6 sm:mb-8">
                                <Banner />
                            </div>

                            {/* Charts Container - Responsive Grid */}
                            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                                {/* New Release Chart */}
                                <div className="w-full">
                                    <NewReleaseChart />
                                </div>

                                {/* Home Chart */}
                                <div className="w-full">
                                    <HomeChart />
                                </div>
                            </div>
                        </div>

                        {/* Footer with responsive padding to avoid MusicFrame overlap */}
                        <div className="pb-20 sm:pb-24 md:pb-28 lg:pb-32">
                            <Footer />
                        </div>
                    </main>
                </div>
            </div>

            {/* MusicFrame - Always at bottom, responsive */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <MusicFrame />
            </div>
        </div>
    );
}

export default Home;