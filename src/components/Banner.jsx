import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { useDispatch, useSelector } from 'react-redux';
import { getNewReleaseChart, getDetailSong } from '../store/thunk';
import { setInfoSong } from '../store/reducer';

// Import CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

function Banner(props) {
    const dispatch = useDispatch();
    const selectNewReleaseChart = (state) => state.music.newReleaseChart;

    const { data: music, loading, error } = useSelector(selectNewReleaseChart);

    const [imageLoadStates, setImageLoadStates] = useState({});
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleImageLoad = (songId) => {
        setImageLoadStates(prev => ({ ...prev, [songId]: { loaded: true, error: false } }));
    };

    const handleImageError = (songId) => {
        setImageLoadStates(prev => ({ ...prev, [songId]: { loaded: true, error: true } }));
    };

    useEffect(() => {
        dispatch(getNewReleaseChart());
    }, [dispatch]);
    const handleSongClick = (song) => {
        console.log('🎵 Clicking song:', song.title, 'ID:', song.encodeId);
        console.log('📋 Full song data:', song);

        // Lưu thông tin bài hát vào infoSong
        dispatch(setInfoSong(song));

        // Gọi API để lấy link phát nhạc
        console.log('🚀 Dispatching getDetailSong with ID:', song.encodeId);
        dispatch(getDetailSong(song.encodeId));
    };


    const displayedSongs = music.slice(0, 6);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] bg-black/95 backdrop-blur-sm rounded-3xl mx-4 my-8 border border-gray-800 overflow-hidden">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin mb-8"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-500 rounded-full animate-spin animate-reverse opacity-60"></div>
            </div>
            <p className="text-gray-300 text-xl font-medium animate-pulse">🎵 Đang tải banner nhạc hot...</p>

            {/* Floating particles */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-float-1"></div>
                <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-400 rounded-full animate-float-2"></div>
                <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-purple-300 rounded-full animate-float-3"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-[400px] bg-black/95 backdrop-blur-sm rounded-3xl mx-4 my-8 p-8 border border-red-800/50 overflow-hidden">
            <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">❌</div>
                <p className="text-red-400 text-xl font-medium">Lỗi tải dữ liệu: {error}</p>
                <button
                    onClick={() => dispatch(getNewReleaseChart())}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full hover:from-red-500 hover:to-red-400 transition-all duration-300 hover:scale-105"
                >
                    Thử lại
                </button>
            </div>
        </div>
    );

    return (
        <div className="banner-container max-w-7xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center mb-12">
                <div className="relative inline-block group">
                    <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary via-gray-200 to-thirdary mb-4 animate-gradient-x">
                        🎵 Nhạc Hot Trending
                    </h2>
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-700"></div>
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mx-auto rounded-full animate-gradient-x"></div>
                <p className="text-gray-400 mt-4 text-lg animate-fade-in-up">Những bài hát đang làm mưa làm gió</p>
            </div>

            {/* Enhanced Swiper */}
            <div className="relative">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView="auto"
                    coverflowEffect={{
                        rotate: 15,
                        stretch: 0,
                        depth: 300,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    navigation={{
                        prevEl: '.swiper-button-prev-custom',
                        nextEl: '.swiper-button-next-custom',
                    }}
                    pagination={{
                        el: '.swiper-pagination-custom',
                        clickable: true,
                        renderBullet: function (index, className) {
                            return `<span class="${className} custom-bullet"></span>`;
                        },
                    }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
                    loop={true}
                    className="banner-swiper"
                >
                    {displayedSongs.map((song, index) => {
                        const imageState = imageLoadStates[song.encodeId] || { loaded: false, error: false };

                        return (
                            <SwiperSlide key={song.encodeId}
                                onClick={() => handleSongClick(song)} className="swiper-slide-custom">
                                <div className="relative w-full max-w-md h-[450px] overflow-hidden rounded-3xl group cursor-pointer mx-auto">
                                    {/* Background gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>

                                    {/* Floating particles effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-1000 z-20">
                                        <div className="absolute top-8 left-8 w-1 h-1 bg-purple-400 rounded-full animate-float-1"></div>
                                        <div className="absolute top-16 right-12 w-1 h-1 bg-pink-400 rounded-full animate-float-2"></div>
                                        <div className="absolute bottom-20 left-12 w-1 h-1 bg-purple-300 rounded-full animate-float-3"></div>
                                        <div className="absolute bottom-32 right-8 w-1 h-1 bg-pink-300 rounded-full animate-float-1"></div>
                                    </div>

                                    {/* Main image */}
                                    <div className="relative w-full h-full">
                                        {!imageState.loaded && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black z-30">
                                                <div className="relative">
                                                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin"></div>
                                                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-pink-500 rounded-full animate-spin animate-reverse opacity-60"></div>
                                                </div>
                                            </div>
                                        )}

                                        {imageState.error ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gradient-to-br from-gray-900 to-black">
                                                <div className="text-6xl mb-4">🎵</div>
                                                <p className="text-lg">Không tải được ảnh</p>
                                            </div>
                                        ) : (
                                            <img
                                                src={song.thumbnail}
                                                alt={song.title}
                                                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageState.loaded ? 'opacity-100' : 'opacity-0'}`}
                                                onLoad={() => handleImageLoad(song.encodeId)}
                                                onError={() => handleImageError(song.encodeId)}
                                            />
                                        )}

                                        {/* Play overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm z-30">
                                            <div className="relative transform group-hover:scale-110 transition-transform duration-300">
                                                <div className="w-20 h-20 bg-gradient-to-r from-secondary to-thirdary rounded-full flex items-center justify-center shadow-2xl">
                                                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M8 5v10l7-5z" />
                                                    </svg>
                                                </div>
                                                <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-secondary to-thirdary rounded-full animate-ping opacity-30"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="px-3 py-1 bg-gradient-to-r from-secondary/80 to-thirdary/80 rounded-full backdrop-blur-sm">
                                                    <span className="text-white text-sm font-semibold">TOP #{index + 1}</span>
                                                </div>
                                                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                                            </div>

                                            <h3 className="font-black text-white text-2xl leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors duration-500 drop-shadow-2xl">
                                                {song.title}
                                            </h3>

                                            <p className="text-gray-300 text-lg line-clamp-1 group-hover:text-gray-200 transition-colors duration-500 drop-shadow-lg">
                                                {song.artistsNames}
                                            </p>

                                            {/* Action buttons */}
                                            <div className="flex gap-4 pt-2">
                                                <a
                                                    href={`https://zingmp3.vn${song.link}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 bg-gradient-to-r from-secondary via-gray-400 to-thirdary hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 text-center text-base"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M8 5v10l7-5z" />
                                                        </svg>
                                                        Nghe ngay
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent z-40"></div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                {/* Custom Navigation */}
                <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600/20 hover:border-purple-500/50 transition-all duration-300 group">
                    <svg className="w-6 h-6 text-white group-hover:text-purple-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </div>

                <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600/20 hover:border-purple-500/50 transition-all duration-300 group">
                    <svg className="w-6 h-6 text-white group-hover:text-purple-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>

                {/* Custom Pagination */}
                <div className="swiper-pagination-custom flex justify-center mt-8 gap-2"></div>
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
                    33% { transform: translateY(-12px) translateX(8px); }
                    66% { transform: translateY(8px) translateX(-6px); }
                }

                @keyframes float-2 {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    33% { transform: translateY(10px) translateX(-10px); }
                    66% { transform: translateY(-8px) translateX(4px); }
                }

                @keyframes float-3 {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    33% { transform: translateY(-10px) translateX(-4px); }
                    66% { transform: translateY(12px) translateX(10px); }
                }

                .animate-gradient-x {
                    animation: gradient-x 3s ease infinite;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out 0.5s forwards;
                    opacity: 0;
                }

                .animate-float-1 {
                    animation: float-1 6s ease-in-out infinite;
                }

                .animate-float-2 {
                    animation: float-2 8s ease-in-out infinite;
                }

                .animate-float-3 {
                    animation: float-3 7s ease-in-out infinite;
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

                .banner-swiper {
                    padding: 20px 0 60px 0;
                }

                .swiper-slide-custom {
                    width: 380px !important;
                    height: auto;
                }

                .custom-bullet {
                    width: 12px;
                    height: 12px;
                    background: rgba(209, 209, 209, 0.4);
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .custom-bullet.swiper-pagination-bullet-active {
                    background: #40CAC2;
                    transform: scale(1.3);
                    box-shadow: 0 0 15px rgba(64, 202, 194, 0.5);
                }

                .custom-bullet:hover {
                    background: rgba(64, 202, 194, 0.7);
                    transform: scale(1.1);
                }

                .swiper-3d .swiper-slide-shadow-left,
                .swiper-3d .swiper-slide-shadow-right {
                    background-image: linear-gradient(to right, rgba(139, 92, 246, 0.2), transparent),
                                      linear-gradient(to left, rgba(236, 72, 153, 0.2), transparent);
                }
            `}</style>
        </div>
    );
}

export default Banner;