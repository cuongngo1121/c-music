import React from 'react';
import { NavLink } from 'react-router-dom';

function SideBar() {
    const baseClass = "relative hover:text-secondary hover:bg-gray-600 hover:from-blue-50 hover:to-indigo-50 items-center justify-start flex gap-3 text-[14px] transition-all duration-300 ease-in-out font-medium w-full px-4 py-3 rounded-xl group overflow-hidden cursor-pointer";
    const activeClass = "font-semibold text-secondary bg-gray-400 from-blue-50 to-indigo-50 ";

    const menuItems = [
        {
            to: "/",
            label: "Home",
            icon: (
                <svg width="16" height="16" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.9404 7.40429L7.309 1.77695C7.26845 1.73632 7.22029 1.70409 7.16727 1.6821C7.11425 1.66011 7.05741 1.64879 7.00001 1.64879C6.94261 1.64879 6.88578 1.66011 6.83276 1.6821C6.77974 1.70409 6.73158 1.73632 6.69103 1.77695L1.05958 7.40429C0.89552 7.56836 0.802551 7.79121 0.802551 8.02363C0.802551 8.50625 1.19493 8.89863 1.67755 8.89863H2.27091V12.9141C2.27091 13.1561 2.46642 13.3516 2.70841 13.3516H6.12501V10.2891H7.65626V13.3516H11.2916C11.5336 13.3516 11.7291 13.1561 11.7291 12.9141V8.89863H12.3225C12.5549 8.89863 12.7777 8.80703 12.9418 8.6416C13.2822 8.2998 13.2822 7.74609 12.9404 7.40429Z" fill="currentColor" />
                </svg>
            )
        },
        {
            to: "/explore",
            label: "Explore",
            icon: (
                <svg width="16" height="16" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.00002 6.85834C6.64419 6.85834 6.35835 7.14417 6.35835 7.5C6.35835 7.85584 6.64419 8.14167 7.00002 8.14167C7.35585 8.14167 7.64169 7.85584 7.64169 7.5C7.64169 7.14417 7.35585 6.85834 7.00002 6.85834ZM7.00002 1.66667C3.78002 1.66667 1.16669 4.28 1.16669 7.5C1.16669 10.72 3.78002 13.3333 7.00002 13.3333C10.22 13.3333 12.8334 10.72 12.8334 7.5C12.8334 4.28 10.22 1.66667 7.00002 1.66667ZM8.27752 8.7775L3.50002 11L5.72252 6.22251L10.5 4.00001L8.27752 8.7775Z" fill="currentColor" />
                </svg>
            )
        },
        {
            to: "/albums",
            label: "Albums",
            icon: (
                <svg width="16" height="16" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.00002 1.66667C3.78002 1.66667 1.16669 4.28001 1.16669 7.50001C1.16669 10.72 3.78002 13.3333 7.00002 13.3333C10.22 13.3333 12.8334 10.72 12.8334 7.50001C12.8334 4.28001 10.22 1.66667 7.00002 1.66667ZM7.00002 10.125C5.54752 10.125 4.37502 8.95251 4.37502 7.50001C4.37502 6.04751 5.54752 4.87501 7.00002 4.87501C8.45252 4.87501 9.62502 6.04751 9.62502 7.50001C9.62502 8.95251 8.45252 10.125 7.00002 10.125ZM7.00002 6.91667C6.67919 6.91667 6.41669 7.17917 6.41669 7.50001C6.41669 7.82084 6.67919 8.08334 7.00002 8.08334C7.32085 8.08334 7.58335 7.82084 7.58335 7.50001C7.58335 7.17917 7.32085 6.91667 7.00002 6.91667Z" fill="currentColor" />
                </svg>
            )
        },
        {
            to: "/artists",
            label: "Artists",
            icon: (
                <svg width="16" height="16" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.625 12.75C2.625 12.75 1.75 12.75 1.75 11.875C1.75 11 2.625 8.375 7 8.375C11.375 8.375 12.25 11 12.25 11.875C12.25 12.75 11.375 12.75 11.375 12.75H2.625ZM7 7.5C7.69619 7.5 8.36387 7.22344 8.85616 6.73116C9.34844 6.23887 9.625 5.57119 9.625 4.875C9.625 4.17881 9.34844 3.51113 8.85616 3.01884C8.36387 2.52656 7.69619 2.25 7 2.25C6.30381 2.25 5.63613 2.52656 5.14384 3.01884C4.65156 3.51113 4.375 4.17881 4.375 4.875C4.375 5.57119 4.65156 6.23887 5.14384 6.73116C5.63613 7.22344 6.30381 7.5 7 7.5Z" fill="currentColor" />
                </svg>
            )
        },
        {
            to: "/videos",
            label: "Videos",
            icon: (
                <svg width="16" height="16" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 4.58333C10.5 3.93991 9.97677 3.41666 9.33335 3.41666H2.33335C1.68994 3.41666 1.16669 3.93991 1.16669 4.58333V10.4167C1.16669 11.0601 1.68994 11.5833 2.33335 11.5833H9.33335C9.97677 11.5833 10.5 11.0601 10.5 10.4167V8.47241L12.8334 10.4167V4.58333L10.5 6.52758V4.58333Z" fill="currentColor" />
                </svg>
            )
        }
    ];

    const libraryItems = [
        {
            to: "/recent",
            label: "Recent",
            icon: (
                <svg width="16" height="16" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3.5C8.98891 3.5 9.95561 3.79324 10.7779 4.34265C11.6001 4.89206 12.241 5.67295 12.6194 6.58658C12.9978 7.50021 13.0969 8.50555 12.9039 9.47545C12.711 10.4454 12.2348 11.3363 11.5355 12.0355C10.8363 12.7348 9.94536 13.211 8.97545 13.4039C8.00555 13.5969 7.00021 13.4978 6.08658 13.1194C5.17295 12.741 4.39206 12.1001 3.84265 11.2779C3.29324 10.4556 3 9.48891 3 8.5C3 8.36739 2.94732 8.24021 2.85355 8.14645C2.75979 8.05268 2.63261 8 2.5 8C2.36739 8 2.24021 8.05268 2.14645 8.14645C2.05268 8.24021 2 8.36739 2 8.5C1.99997 9.87381 2.47139 11.206 3.33549 12.274C4.19959 13.3421 5.40403 14.0812 6.74757 14.368C8.09112 14.6547 9.49238 14.4717 10.7172 13.8496C11.9421 13.2274 12.9163 12.2038 13.4772 10.9497C14.0381 9.69559 14.1516 8.287 13.7988 6.95927C13.446 5.63154 12.6482 4.46509 11.5388 3.65483C10.4294 2.84456 9.07548 2.43955 7.70336 2.50747C6.33123 2.57539 5.02397 3.11213 4 4.028V3C4 2.86739 3.94732 2.74021 3.85355 2.64645C3.75979 2.55268 3.63261 2.5 3.5 2.5C3.36739 2.5 3.24021 2.55268 3.14645 2.64645C3.05268 2.74021 3 2.86739 3 3V6C3 6.13261 3.05268 6.25979 3.14645 6.35355C3.24021 6.44732 3.36739 6.5 3.5 6.5H5.5C5.63261 6.5 5.75979 6.44732 5.85355 6.35355C5.94732 6.25979 6 6.13261 6 6C6 5.86739 5.94732 5.74021 5.85355 5.64645C5.75979 5.55268 5.63261 5.5 5.5 5.5H4C4.4653 4.87856 5.06913 4.37421 5.76351 4.02702C6.45788 3.67983 7.22367 3.49938 8 3.5ZM8.001 6C8.001 5.86739 7.94832 5.74021 7.85455 5.64645C7.76079 5.55268 7.63361 5.5 7.501 5.5C7.36839 5.5 7.24121 5.55268 7.14745 5.64645C7.05368 5.74021 7.001 5.86739 7.001 6V9C7.001 9.13261 7.05368 9.25979 7.14745 9.35355C7.24121 9.44732 7.36839 9.5 7.501 9.5H9.501C9.63361 9.5 9.76079 9.44732 9.85455 9.35355C9.94832 9.25979 10.001 9.13261 10.001 9C10.001 8.86739 9.94832 8.74021 9.85455 8.64645C9.76079 8.55268 9.63361 8.5 9.501 8.5H8.001V6Z" fill="currentColor" />
                </svg>
            )
        },
        {
            to: "/library-albums",
            label: "My Albums",
            icon: (
                <svg width="16" height="16" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.99998 1.83333C4.31998 1.83333 1.33331 4.82 1.33331 8.5C1.33331 12.18 4.31998 15.1667 7.99998 15.1667C11.68 15.1667 14.6666 12.18 14.6666 8.5C14.6666 4.82 11.68 1.83333 7.99998 1.83333ZM7.99998 11.5C6.33998 11.5 4.99998 10.16 4.99998 8.5C4.99998 6.84 6.33998 5.5 7.99998 5.5C9.65998 5.5 11 6.84 11 8.5C11 10.16 9.65998 11.5 7.99998 11.5ZM7.99998 7.83333C7.63331 7.83333 7.33331 8.13333 7.33331 8.5C7.33331 8.86667 7.63331 9.16667 7.99998 9.16667C8.36665 9.16667 8.66665 8.86667 8.66665 8.5C8.66665 8.13333 8.36665 7.83333 7.99998 7.83333Z" fill="currentColor" />
                </svg>
            )
        },
        {
            to: "/podcasts",
            label: "Podcasts",
            icon: (
                <svg width="16" height="16" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.00002 9.5C7.65391 9.5 7.31556 9.39737 7.02778 9.20507C6.73999 9.01278 6.51569 8.73947 6.38323 8.4197C6.25078 8.09993 6.21613 7.74806 6.28365 7.40859C6.35117 7.06913 6.51785 6.75731 6.76259 6.51257C7.00733 6.26782 7.31915 6.10115 7.65862 6.03363C7.99808 5.9661 8.34995 6.00076 8.66972 6.13321C8.98949 6.26567 9.2628 6.48997 9.4551 6.77775C9.64739 7.06554 9.75002 7.40389 9.75002 7.75C9.74838 8.21362 9.56347 8.65779 9.23564 8.98562C8.90781 9.31345 8.46365 9.49836 8.00002 9.5ZM8.78127 9.5H7.21877C7.03457 9.50003 6.85266 9.54097 6.68621 9.61988C6.51976 9.69878 6.37291 9.81367 6.25627 9.95625C6.13687 10.0981 6.0512 10.2651 6.00573 10.4448C5.96026 10.6245 5.95618 10.8122 5.99377 10.9938L6.59377 13.9938C6.65123 14.2767 6.8044 14.5312 7.02751 14.7145C7.25062 14.8978 7.53005 14.9986 7.81877 15H8.18127C8.47 14.9986 8.74943 14.8978 8.97254 14.7145C9.19565 14.5312 9.34882 14.2767 9.40627 13.9938L10.0063 10.9938C10.0439 10.8122 10.0398 10.6245 9.99431 10.4448C9.94884 10.2651 9.86318 10.0981 9.74377 9.95625C9.62714 9.81367 9.48029 9.69878 9.31384 9.61988C9.14738 9.54097 8.96548 9.50003 8.78127 9.5ZM11.2625 9.76875C11.2201 9.891 11.2267 10.0249 11.2809 10.1424C11.3352 10.2599 11.4329 10.3518 11.5535 10.3987C11.6741 10.4457 11.8082 10.444 11.9276 10.3941C12.047 10.3443 12.1424 10.25 12.1938 10.1313C12.398 9.61173 12.5019 9.05822 12.5 8.5C12.5 7.30653 12.0259 6.16194 11.182 5.31802C10.3381 4.47411 9.1935 4 8.00002 4C6.80655 4 5.66196 4.47411 4.81804 5.31802C3.97413 6.16194 3.50002 7.30653 3.50002 8.5C3.49755 9.05827 3.60148 9.6119 3.80627 10.1313C3.84258 10.2246 3.90607 10.3049 3.98853 10.3617C4.071 10.4185 4.16863 10.4493 4.26877 10.45C4.33114 10.4502 4.39286 10.4374 4.45002 10.4125C4.57327 10.3649 4.67268 10.2705 4.72655 10.1499C4.78042 10.0293 4.78436 9.89227 4.73752 9.76875C4.53149 9.23836 4.45788 8.66572 4.52307 8.10046C4.58826 7.5352 4.79028 6.99435 5.11163 6.52477C5.43299 6.0552 5.86398 5.67105 6.36728 5.40561C6.87059 5.14016 7.43102 5.00144 8.00002 5.00144C8.56903 5.00144 9.12946 5.14016 9.63276 5.40561C10.1361 5.67105 10.5671 6.0552 10.8884 6.52477C11.2098 6.99435 11.4118 7.5352 11.477 8.10046C11.5422 8.66572 11.4686 9.23836 11.2625 9.76875ZM8.00002 2C6.59301 1.99864 5.22353 2.45386 4.09733 3.29729C2.97113 4.14072 2.14901 5.3268 1.75448 6.67738C1.35995 8.02795 1.4143 9.47007 1.90938 10.7871C2.40446 12.1042 3.31353 13.225 4.50002 13.9813C4.61191 14.0534 4.74786 14.0781 4.87797 14.0499C5.00807 14.0218 5.12167 13.9431 5.19377 13.8313C5.26588 13.7194 5.29059 13.5834 5.26245 13.4533C5.23432 13.3232 5.15566 13.2096 5.04377 13.1375C4.04021 12.4978 3.27121 11.5499 2.8522 10.436C2.43319 9.32212 2.38678 8.10237 2.71993 6.95987C3.05309 5.81736 3.74784 4.81373 4.69989 4.09965C5.65195 3.38557 6.80993 2.99955 8.00002 2.99955C9.19012 2.99955 10.3481 3.38557 11.3002 4.09965C12.2522 4.81373 12.947 5.81736 13.2801 6.95987C13.6133 8.10237 13.5669 9.32212 13.1479 10.436C12.7288 11.5499 11.9598 12.4978 10.9563 13.1375C10.8659 13.1965 10.7971 13.2831 10.76 13.3844C10.7229 13.4857 10.7195 13.5963 10.7505 13.6996C10.7814 13.803 10.845 13.8936 10.9316 13.9578C11.0183 14.0221 11.1234 14.0566 11.2313 14.0563C11.3258 14.0548 11.4184 14.0289 11.5 13.9813C12.6865 13.225 13.5956 12.1042 14.0907 10.7871C14.5857 9.47007 14.6401 8.02795 14.2456 6.67738C13.851 5.3268 13.0289 4.14072 11.9027 3.29729C10.7765 2.45386 9.40704 1.99864 8.00002 2Z" fill="currentColor" />
                </svg>
            )
        },
        {
            to: "/downloads",
            label: "Downloads",
            icon: (
                <svg width="16" height="16" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.66667 2H10.3333V6.58667H13.24L10.6233 9.28667L8 11.9867L5.38 9.28667L2.76333 6.58667H5.66667V2ZM2.64667 13.3833H13.3533V15H2.64667V13.3833Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            to: "/playlists",
            label: "Playlists",
            icon: (
                <svg width="16" height="16" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3333 4.50001H7.99998L6.66665 3.16667H2.66665C1.93331 3.16667 1.33998 3.76667 1.33998 4.50001L1.33331 12.5C1.33331 13.2333 1.93331 13.8333 2.66665 13.8333H13.3333C14.0666 13.8333 14.6666 13.2333 14.6666 12.5V5.83334C14.6666 5.10001 14.0666 4.50001 13.3333 4.50001ZM13.3333 12.5H2.66665V5.83334H13.3333V12.5Z" fill="currentColor" />
                </svg>
            )
        }
    ];

    return (
        <div className='flex flex-col text-white h-full bg-primary-dark from-slate-50 via-white to-blue-50/30 '>
            {/* Header */}
            <div className='pt-8 pb-6 px-6  '>
                <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center'>
                        <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className='font-bold text-white text-lg'>MusicApp</h2>
                        <p className='text-xs text-thirdary'>Your music library</p>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className='mt-8  flex flex-col gap-6 items-start justify-start px-6'>
                <div className='flex items-center gap-2 mb-2'>
                    <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                    <h3 className='font-bold text-[13px] text-white tracking-wider uppercase'>Menu</h3>
                </div>
                <div className='w-full'>
                    <ul className='flex flex-col gap-1 justify-center items-stretch list-none p-0 m-0 w-full'>
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        isActive ? `${baseClass} ${activeClass}` : baseClass
                                    }
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-indigo-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                    <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-200 text-gray-600 group-hover:text-secondary">
                                        {item.icon}
                                    </span>
                                    <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-200 text-white group-hover:text-secondary">
                                        {item.label}
                                    </span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Library Section */}
            <div className='mt-10 flex flex-col gap-6 items-start justify-start px-6 flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                    <div className='w-2 h-2 bg-indigo-600 rounded-full'></div>
                    <h3 className='font-bold text-[13px] text-white tracking-wider uppercase'>Your Library</h3>
                </div>
                <div className='w-full'>
                    <ul className='flex flex-col gap-1 justify-center items-stretch list-none p-0 m-0 w-full'>
                        {libraryItems.map((item, index) => (
                            <li key={index}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        isActive ? `${baseClass} ${activeClass}` : baseClass
                                    }
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-indigo-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                    <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-200 text-gray-600 group-hover:text-secondary">
                                        {item.icon}
                                    </span>
                                    <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-200 text-white group-hover:text-secondary">
                                        {item.label}
                                    </span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div className='px-6 py-4   mt-auto'>
                <div className='flex items-center gap-3 p-3 bg-gradient-to-r from-gray-800/70 to-gray-700/70 rounded-xl'>
                    <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0'>
                        <div className='w-3 h-3 bg-white rounded-full animate-pulse'></div>
                    </div>
                    <div className='min-w-0 flex-1'>
                        <p className='text-xs font-semibold text-gray-200 truncate'>Now Playing</p>
                        <p className='text-xs text-gray-400 truncate'>Select a song to play</p>
                    </div>
                </div>

                <div className='mt-3 text-center'>
                    <p className='text-xs text-gray-500'>© 2024 MusicApp</p>
                </div>
            </div>
        </div>
    );
}

export default SideBar;