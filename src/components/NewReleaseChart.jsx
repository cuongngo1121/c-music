import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNewReleaseChart } from '../store/thunk';
import { getDetailSong } from '../store/thunk';
import { setInfoSong } from '../store/reducer';

const NewReleaseChart = () => {
    const dispatch = useDispatch();
    const selectNewReleaseChart = (state) => state.music.newReleaseChart;
    const { data: music, loading, error } = useSelector(selectNewReleaseChart);
    const [showAll, setShowAll] = useState(false);
    const [visibleCount, setVisibleCount] = useState(12);
    const [imageLoadStates, setImageLoadStates] = useState({});

    useEffect(() => {
        dispatch(getNewReleaseChart());
    }, [dispatch]);

    const displayedSongs = showAll ? music : music.slice(0, visibleCount);
    const hasMoreSongs = music.length > visibleCount;

    const handleShowMore = () => {
        setShowAll(true);
    };

    const handleShowLess = () => {
        setShowAll(false);
        document.querySelector('.chart-container')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    const handleImageLoad = (songId) => {
        setImageLoadStates(prev => ({ ...prev, [songId]: { loaded: true, error: false } }));
    };

    const handleImageError = (songId) => {
        setImageLoadStates(prev => ({ ...prev, [songId]: { loaded: true, error: true } }));
    };

    const handleSongClick = (song) => {
        console.log('🎵 Clicking song:', song.title, 'ID:', song.encodeId);
        console.log('📋 Full song data:', song);

        // Lưu thông tin bài hát vào infoSong
        dispatch(setInfoSong(song));

        // Gọi API để lấy link phát nhạc
        console.log('🚀 Dispatching getDetailSong with ID:', song.encodeId);
        dispatch(getDetailSong(song.encodeId));
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#000000]/95 backdrop-blur-sm rounded-3xl mx-4 my-8 border border-[#D1D1D1]/20">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[#D1D1D1]/30 border-t-[#40CAC2] rounded-full animate-spin mb-6"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#38BACC] rounded-full animate-spin animate-reverse opacity-60"></div>
            </div>
            <p className="text-[#D1D1D1] text-lg font-medium animate-pulse">🎵 Đang tải dữ liệu BXH...</p>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-[300px] bg-[#000000]/95 backdrop-blur-sm rounded-3xl mx-4 my-8 p-8 border border-[#40CAC2]/30">
            <div className="text-center space-y-4">
                <div className="text-5xl">❌</div>
                <p className="text-[#40CAC2] text-lg font-medium">Lỗi: {error}</p>
                <button
                    onClick={() => dispatch(getNewReleaseChart())}
                    className="px-6 py-3 bg-gradient-to-r from-[#40CAC2] to-[#38BACC] text-[#000000] font-semibold rounded-full hover:from-[#38BACC] hover:to-[#40CAC2] transition-all duration-300 hover:scale-105"
                >
                    Thử lại
                </button>
            </div>
        </div>
    );

    return (
        <div className="chart-container max-w-6xl mx-auto px-4 py-6">
            {/* Header Section với BXH Nhạc Mới */}
            <div className="bg-[#000000]/80 backdrop-blur-lg rounded-2xl p-6 border border-[#D1D1D1]/10 mb-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="relative inline-block group">
                        <h2 className="text-2xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#40CAC2] via-[#38BACC] to-[#40CAC2] mb-4 animate-gradient-x">
                            BXH Nhạc Mới
                        </h2>
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#40CAC2]/20 via-[#38BACC]/20 to-[#40CAC2]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-700"></div>
                    </div>

                    {/* Nút Show More/Less trong header */}
                    {hasMoreSongs && (
                        <div className="mt-6">
                            {!showAll ? (
                                <button
                                    onClick={handleShowMore}
                                    className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-[#000000] transition-all duration-500 bg-gradient-to-r from-gray-200 to-gray-400 rounded-full hover:from-[#38BACC] hover:to-[#40CAC2] hover:scale-105 hover:shadow-lg hover:shadow-[#40CAC2]/30 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF]/10 to-[#FFFFFF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                                    <span className="relative flex items-center gap-2">
                                        <span>Xem tất cả {music.length} bài</span>
                                        <svg className="w-3.5 h-3.5 transform group-hover:translate-y-0.5 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleShowLess}
                                    className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-[#FFFFFF] transition-all duration-500 bg-[#000000]/60 border border-[#D1D1D1]/20 rounded-full hover:bg-[#000000]/80 hover:border-[#D1D1D1]/40 hover:scale-105 hover:shadow-lg hover:shadow-black/30 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#D1D1D1]/5 to-[#D1D1D1]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                                    <span className="relative flex items-center gap-2">
                                        <span>Thu gọn</span>
                                        <svg className="w-3.5 h-3.5 transform group-hover:-translate-y-0.5 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    </span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Songs Grid với khoảng cách nhỏ hơn */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2.5">
                    {displayedSongs.map((song, index) => {
                        const imageState = imageLoadStates[song.encodeId] || { loaded: false, error: false };

                        return (
                            <div
                                key={song.encodeId}
                                onClick={() => handleSongClick(song)}
                                className="relative bg-[#000000]/60 backdrop-blur-lg rounded-xl p-3.5 transition-all duration-500 hover:scale-[1.02] hover:bg-[#000000]/80 border border-[#D1D1D1]/5 hover:border-[#40CAC2]/30 overflow-hidden animate-slide-up cursor-pointer group"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animationFillMode: 'forwards'
                                }}
                            >
                                {/* Ranking badge */}
                                <div className="absolute -top-1.5 -right-1.5 z-20">
                                    <div className="w-7 h-7 bg-gradient-to-br from-[#40CAC2] to-[#38BACC] rounded-full flex items-center justify-center text-[#000000] font-bold text-xs shadow-lg">
                                        #{index + 1}
                                    </div>
                                </div>

                                {/* Floating particles effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-1000">
                                    <div className="absolute top-3 left-3 w-1 h-1 bg-[#40CAC2] rounded-full animate-float-1"></div>
                                    <div className="absolute top-6 right-6 w-1 h-1 bg-[#38BACC] rounded-full animate-float-2"></div>
                                    <div className="absolute bottom-4 left-6 w-1 h-1 bg-[#40CAC2]/80 rounded-full animate-float-3"></div>
                                </div>

                                <div className="flex items-center gap-3 w-full min-h-[70px] relative z-10">
                                    {/* Ảnh bài hát */}
                                    <div className="w-[60px] h-[60px] flex-shrink-0 overflow-hidden rounded-lg relative group/img">
                                        {!imageState.loaded && (
                                            <div className="w-full h-full flex items-center justify-center bg-[#000000]/50">
                                                <div className="w-5 h-5 border-2 border-[#40CAC2]/30 border-t-[#40CAC2] rounded-full animate-spin"></div>
                                            </div>
                                        )}

                                        {imageState.error ? (
                                            <div className="w-full h-full flex items-center justify-center text-[#D1D1D1] text-xl bg-[#000000]/50">
                                                🎵
                                            </div>
                                        ) : (
                                            <img
                                                src={song.thumbnail}
                                                alt={song.title}
                                                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 ${imageState.loaded ? 'opacity-100' : 'opacity-0'}`}
                                                onLoad={() => handleImageLoad(song.encodeId)}
                                                onError={() => handleImageError(song.encodeId)}
                                            />
                                        )}

                                        {/* Play overlay */}
                                        <div className="absolute inset-0 bg-[#000000]/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                                            <div className="w-7 h-7 bg-gradient-to-r from-[#40CAC2] to-[#38BACC] rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-2.5 h-2.5 text-[#000000] ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M8 5v10l7-5z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thông tin bài hát */}
                                    <div className="flex flex-col justify-center flex-1 space-y-1 min-w-0">
                                        <h3 className="font-bold text-[#FFFFFF] text-sm leading-tight line-clamp-2 group-hover:text-[#40CAC2] transition-colors duration-500">
                                            {song.title}
                                        </h3>
                                        <p className="text-[#D1D1D1]/70 text-xs line-clamp-1 group-hover:text-[#38BACC] transition-colors duration-500">
                                            {song.artistsNames}
                                        </p>
                                    </div>

                                    {/* Play button */}
                                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                        <div className="w-8 h-8 bg-gradient-to-r from-[#40CAC2] to-[#38BACC] rounded-full flex items-center justify-center shadow-lg hover:shadow-[#40CAC2]/30 transition-all duration-300">
                                            <svg className="w-3 h-3 text-[#000000] ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8 5v10l7-5z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Shimmer effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-[#40CAC2]/5 to-transparent"></div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                @keyframes gradient-x {
                    0%, 100% {
                        background-size: 200% 200%;
                        background-position: left center;
                    }
                    50% {
                        background-size: 200% 200%;
                        background-position: right center;
                    }
                }

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float-1 {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    33% { transform: translateY(-8px) translateX(4px); }
                    66% { transform: translateY(4px) translateX(-4px); }
                }

                @keyframes float-2 {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    33% { transform: translateY(6px) translateX(-6px); }
                    66% { transform: translateY(-4px) translateX(3px); }
                }

                @keyframes float-3 {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    33% { transform: translateY(-6px) translateX(-3px); }
                    66% { transform: translateY(8px) translateX(6px); }
                }

                .animate-gradient-x {
                    animation: gradient-x 3s ease infinite;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.6s cubic-bezier(0.23, 1, 0.320, 1) forwards;
                    opacity: 0;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out 0.5s forwards;
                    opacity: 0;
                }

                .animate-float-1 {
                    animation: float-1 4s ease-in-out infinite;
                }

                .animate-float-2 {
                    animation: float-2 5s ease-in-out infinite;
                }

                .animate-float-3 {
                    animation: float-3 4.5s ease-in-out infinite;
                }

                .animate-reverse {
                    animation-direction: reverse;
                }

                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default NewReleaseChart;