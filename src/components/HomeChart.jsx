import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHomeChart, getDetailSong } from '../store/thunk';
import { setInfoSong } from '../store/reducer';

function HomeChart(props) {
    const dispatch = useDispatch();
    const selectHomeChart = (state) => state.music.homeChart;
    const { data: music, loading, error } = useSelector(selectHomeChart);
    const [imageLoadStates, setImageLoadStates] = useState({});
    const [showAll, setShowAll] = useState(false);

    const handleImageLoad = (songId) => {
        setImageLoadStates(prev => ({ ...prev, [songId]: { loaded: true, error: false } }));
    };

    const handleImageError = (songId) => {
        setImageLoadStates(prev => ({ ...prev, [songId]: { loaded: true, error: true } }));
    };

    // Đơn giản hóa: chỉ gọi API để phát nhạc
    const handleSongClick = (song) => {
        console.log('🎵 Clicking song:', song.title, 'ID:', song.encodeId);
        console.log('📋 Full song data:', song);

        // Lưu thông tin bài hát vào infoSong
        dispatch(setInfoSong(song));

        // Gọi API để lấy link phát nhạc
        console.log('🚀 Dispatching getDetailSong with ID:', song.encodeId);
        dispatch(getDetailSong(song.encodeId));
    };


    const handleArtistClick = (e, artist) => {
        e.stopPropagation(); // Prevent song click when clicking artist
        if (artist.link) {
            window.open(`https://zingmp3.vn${artist.link}`, '_blank', 'noopener,noreferrer');
        }
    };

    const handleShowMore = () => {
        setShowAll(true);
    };

    const handleShowLess = () => {
        setShowAll(false);
        document.querySelector('.homeChart-container')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    useEffect(() => {
        dispatch(getHomeChart())
    }, [dispatch]);

    const displayedSongs = showAll ? music : music.slice(0, 6);
    const hasMoreSongs = music.length > 6;

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] bg-[var(--color-background)]/95 backdrop-blur-sm rounded-3xl mx-4 my-8 border border-[var(--color-borderColor)]/20 overflow-hidden">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-[var(--color-borderColor)]/30 border-t-[var(--color-secondary)] rounded-full animate-spin mb-8"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-[var(--color-thirdary)] rounded-full animate-spin animate-reverse opacity-60"></div>
            </div>
            <p className="text-[var(--color-borderColor)] text-xl font-medium animate-pulse">🎵 Đang tải banner nhạc hot...</p>

            {/* Floating particles */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-float-1"></div>
                <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[var(--color-thirdary)] rounded-full animate-float-2"></div>
                <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-[var(--color-secondary)]/70 rounded-full animate-float-3"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-[400px] bg-[var(--color-background)]/95 backdrop-blur-sm rounded-3xl mx-4 my-8 p-8 border border-red-800/50 overflow-hidden">
            <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">❌</div>
                <p className="text-red-400 text-xl font-medium">Lỗi tải dữ liệu: {error}</p>
                <button
                    onClick={() => dispatch(getHomeChart())}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full hover:from-red-500 hover:to-red-400 transition-all duration-300 hover:scale-105"
                >
                    Thử lại
                </button>
            </div>
        </div>
    );

    return (
        <div className='homeChart-container max-w-7xl mx-auto px-4 py-8'>
            {/* Enhanced Header Section */}
            <div className='bg-[var(--color-background)]/80 backdrop-blur-lg rounded-2xl p-6 border border-[var(--color-borderColor)]/10 mb-8'>
                <div className='flex justify-between items-center mb-6'>
                    <div className="relative group">
                        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-thirdary)] to-[var(--color-secondary)] animate-gradient-x">
                            🏆 Home Chart
                        </h2>
                        <div className="absolute -inset-2 bg-gradient-to-r from-[var(--color-secondary)]/20 via-[var(--color-thirdary)]/20 to-[var(--color-secondary)]/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-700"></div>
                        <p className="text-[var(--color-borderColor)]/70 mt-2 text-sm">Những bài hát đang thịnh hành nhất</p>
                    </div>

                    {hasMoreSongs && (
                        <div>
                            {!showAll ? (
                                <button
                                    onClick={handleShowMore}
                                    className="group relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[var(--color-background)] transition-all duration-500 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-thirdary)] rounded-full hover:from-[var(--color-thirdary)] hover:to-[var(--color-secondary)] hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-secondary)]/30 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                                    <span className="relative flex items-center gap-2">
                                        <span>Xem tất cả</span>
                                        <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleShowLess}
                                    className="group relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-500 bg-[var(--color-background)]/60 border border-[var(--color-borderColor)]/20 rounded-full hover:bg-[var(--color-background)]/80 hover:border-[var(--color-borderColor)]/40 hover:scale-105 hover:shadow-lg hover:shadow-black/30 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-borderColor)]/5 to-[var(--color-borderColor)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                                    <span className="relative flex items-center gap-2">
                                        <span>Thu gọn</span>
                                        <svg className="w-3.5 h-3.5 transform group-hover:-translate-x-1 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Enhanced Songs List */}
                <div className="space-y-3">
                    {displayedSongs.map((song, index) => {
                        const imageState = imageLoadStates[song.encodeId] || { loaded: false, error: false };

                        return (
                            <div
                                key={song.encodeId}
                                onClick={() => handleSongClick(song)}
                                className="group relative flex items-center p-4 border border-[var(--color-borderColor)]/5 hover:border-[var(--color-secondary)]/30 bg-[var(--color-background)]/40 hover:bg-[var(--color-background)]/70 backdrop-blur-lg rounded-xl transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden animate-slide-up"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animationFillMode: 'forwards'
                                }}
                            >
                                {/* Ranking badge */}
                                <div className="absolute -top-1 -left-1 z-20">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-thirdary)] rounded-full flex items-center justify-center text-[var(--color-background)] font-bold text-xs shadow-lg">
                                        #{index + 1}
                                    </div>
                                </div>

                                {/* Floating particles effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-1000">
                                    <div className="absolute top-4 left-4 w-1 h-1 bg-[var(--color-secondary)] rounded-full animate-float-1"></div>
                                    <div className="absolute top-8 right-8 w-1 h-1 bg-[var(--color-thirdary)] rounded-full animate-float-2"></div>
                                    <div className="absolute bottom-6 left-16 w-1 h-1 bg-[var(--color-secondary)]/70 rounded-full animate-float-3"></div>
                                </div>

                                {/* Song thumbnail */}
                                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg mr-6 relative group/img">
                                    {!imageState.loaded && (
                                        <div className="w-full h-full flex items-center justify-center bg-[var(--color-background)]/50">
                                            <div className="w-5 h-5 border-2 border-[var(--color-secondary)]/30 border-t-[var(--color-secondary)] rounded-full animate-spin"></div>
                                        </div>
                                    )}

                                    {imageState.error ? (
                                        <div className="w-full h-full flex items-center justify-center text-[var(--color-borderColor)] text-xl bg-[var(--color-background)]/50">
                                            🎵
                                        </div>
                                    ) : (
                                        <img
                                            src={song.thumbnail}
                                            alt={song.title}
                                            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2 ${imageState.loaded ? 'opacity-100' : 'opacity-0'}`}
                                            onLoad={() => handleImageLoad(song.encodeId)}
                                            onError={() => handleImageError(song.encodeId)}
                                        />
                                    )}

                                    {/* Play overlay */}
                                    <div className="absolute inset-0 bg-[var(--color-background)]/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                                        <div className="w-8 h-8 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-thirdary)] rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-3 h-3 text-[var(--color-background)] ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8 5v10l7-5z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Song info */}
                                <div className="flex-1 min-w-0 relative z-10">
                                    <h3 className="text-lg font-bold text-[var(--color-primary)] mb-1 line-clamp-1 group-hover:text-[var(--color-secondary)] transition-colors duration-500">
                                        {song.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-1">
                                        {song.artists && song.artists.map((artist, artistIndex) => (
                                            <React.Fragment key={artist.id || artistIndex}>
                                                <span
                                                    onClick={(e) => handleArtistClick(e, artist)}
                                                    className="text-sm text-[var(--color-borderColor)]/70 hover:text-[var(--color-thirdary)] hover:underline cursor-pointer transition-colors duration-300"
                                                >
                                                    {artist.name}
                                                </span>
                                                {artistIndex < song.artists.length - 1 && (
                                                    <span className="text-sm text-[var(--color-borderColor)]/50">, </span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                        {!song.artists && (
                                            <span className="text-sm text-[var(--color-borderColor)]/70">
                                                {song.artistsNames}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                    <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-thirdary)] rounded-full flex items-center justify-center shadow-lg hover:shadow-[var(--color-secondary)]/30 transition-all duration-300">
                                        <svg className="w-4 h-4 text-[var(--color-background)] ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 5v10l7-5z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Shimmer effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-[var(--color-secondary)]/5 to-transparent"></div>
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
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes float-1 {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    33% { transform: translateY(-6px) translateX(3px); }
                    66% { transform: translateY(3px) translateX(-3px); }
                }

                @keyframes float-2 {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    33% { transform: translateY(4px) translateX(-4px); }
                    66% { transform: translateY(-3px) translateX(2px); }
                }

                @keyframes float-3 {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    33% { transform: translateY(-4px) translateX(-2px); }
                    66% { transform: translateY(6px) translateX(4px); }
                }

                .animate-gradient-x {
                    animation: gradient-x 3s ease infinite;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.5s cubic-bezier(0.23, 1, 0.320, 1) forwards;
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
            `}</style>
        </div>
    );
}

export default HomeChart;