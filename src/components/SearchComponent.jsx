import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Search,
    X,
    Music,
    User,
    List,
    Loader,
    Play,
    Clock,
    Heart,
    MoreHorizontal,
    TrendingUp,
    History
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMusic, getDetailSong } from '../store/thunk';
import { clearSearchResults, setSearchQuery, setInfoSong } from '../store/reducer';

const SearchComponent = () => {
    const dispatch = useDispatch();
    const { search, currentSong } = useSelector(state => state.music);

    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [activeTab, setActiveTab] = useState('songs');
    const [searchHistory, setSearchHistory] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);

    const searchInputRef = useRef(null);
    const searchTimeout = useRef(null);
    const modalRef = useRef(null);

    // Trending searches mock data
    const trendingSearches = [
        'Chúng Ta Của Hiện Tại',
        'See You Again',
        'Perfect',
        'Thinking Out Loud',
        'Shape of You'
    ];

    // Load search history
    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const recent = JSON.parse(localStorage.getItem('musicRecentSearches') || '[]');
        setSearchHistory(history.slice(0, 8));
        setRecentSearches(recent.slice(0, 5));
    }, []);

    // Auto focus when modal opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    // Debounced search
    const debouncedSearch = useCallback((searchQuery) => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (searchQuery.trim().length >= 2) {
            searchTimeout.current = setTimeout(() => {
                dispatch(searchMusic(searchQuery.trim()));
            }, 400);
        }
    }, [dispatch]);

    useEffect(() => {
        debouncedSearch(inputValue);
        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [inputValue, debouncedSearch]);

    const handleOpen = () => {
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const handleClose = () => {
        setIsOpen(false);
        setInputValue('');
        setActiveTab('songs');
        document.body.style.overflow = 'unset';
    };

    const handleSearch = (searchQuery) => {
        const finalQuery = searchQuery || inputValue;
        if (!finalQuery.trim()) return;

        dispatch(searchMusic(finalQuery.trim()));

        // Save to history
        const newHistory = [finalQuery, ...searchHistory.filter(item => item !== finalQuery)].slice(0, 8);
        const newRecent = [finalQuery, ...recentSearches.filter(item => item !== finalQuery)].slice(0, 5);

        setSearchHistory(newHistory);
        setRecentSearches(newRecent);

        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        localStorage.setItem('musicRecentSearches', JSON.stringify(newRecent));
    };

    const handleSongClick = (song) => {
        console.log('🎵 Clicking song:', song.title, 'ID:', song.encodeId);
        console.log('📋 Full song data:', song);

        // Lưu thông tin bài hát vào infoSong
        dispatch(setInfoSong(song));

        // Gọi API để lấy link phát nhạc
        console.log('🚀 Dispatching getDetailSong with ID:', song.encodeId);
        dispatch(getDetailSong(song.encodeId));

        // Đóng modal search
        handleClose();
    };

    const clearSearch = () => {
        setInputValue('');
        setActiveTab('songs');
        dispatch(clearSearchResults());
        dispatch(setSearchQuery(''));
    };

    const removeFromHistory = (item, type = 'history') => {
        if (type === 'history') {
            const newHistory = searchHistory.filter(h => h !== item);
            setSearchHistory(newHistory);
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        } else {
            const newRecent = recentSearches.filter(h => h !== item);
            setRecentSearches(newRecent);
            localStorage.setItem('musicRecentSearches', JSON.stringify(newRecent));
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const SearchEmptyState = () => (
        <div className="px-6 pb-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                            <History className="w-4 h-4" />
                            Tìm kiếm gần đây
                        </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {recentSearches.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setInputValue(item);
                                    handleSearch(item);
                                }}
                                className="group flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-200"
                            >
                                <span>{item}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromHistory(item, 'recent');
                                    }}
                                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all duration-200"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Trending */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-white font-semibold">Xu hướng tìm kiếm</h4>
                </div>
                <div className="space-y-2">
                    {trendingSearches.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setInputValue(item);
                                handleSearch(item);
                            }}
                            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-800/50 text-left transition-all duration-200 group"
                        >
                            <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-emerald-500 to-cyan-400 rounded text-xs font-bold text-white">
                                {index + 1}
                            </div>
                            <span className="text-gray-300 group-hover:text-white transition-colors duration-200">
                                {item}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Tips */}
            <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-cyan-400" />
                </div>
                <p className="text-gray-400 mb-2">Tìm kiếm bài hát, nghệ sĩ, album yêu thích</p>
                <p className="text-sm text-gray-500">Nhập ít nhất 2 ký tự để bắt đầu</p>
            </div>
        </div>
    );

    const SearchResults = () => {
        if (search.loading) {
            return (
                <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-cyan-400 font-medium">Đang tìm kiếm...</span>
                    </div>
                </div>
            );
        }

        if (search.error) {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-red-400">
                    <X className="w-12 h-12 mb-3 opacity-50" />
                    <p className="font-medium">{search.error}</p>
                    <button
                        onClick={() => handleSearch(inputValue)}
                        className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors duration-200"
                    >
                        Thử lại
                    </button>
                </div>
            );
        }

        if (!search.hasSearched || !inputValue.trim()) {
            return <SearchEmptyState />;
        }

        const { songs = [], artists = [], playlists = [] } = search.data;
        const hasResults = songs.length > 0 || artists.length > 0 || playlists.length > 0;

        if (!hasResults) {
            return (
                <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 mb-2">Không tìm thấy kết quả cho "{search.query}"</p>
                    <p className="text-sm text-gray-500">Hãy thử tìm kiếm với từ khóa khác</p>
                </div>
            );
        }

        return (
            <div className="px-6 pb-6">
                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-gray-800/30 p-1 rounded-xl">
                    {[
                        { id: 'songs', label: 'Bài hát', count: songs.length, icon: Music },
                        { id: 'artists', label: 'Nghệ sĩ', count: artists.length, icon: User },
                        { id: 'playlists', label: 'Playlist', count: playlists.length, icon: List }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }`}
                        >
                            {tab.icon && <tab.icon className="w-4 h-4" />}
                            <span>{tab.label}</span>
                            {tab.count > 0 && (
                                <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-700'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Results */}
                <div className="space-y-6">
                    {/* Songs */}
                    {activeTab === 'songs' && songs.length > 0 && (
                        <div>
                            <div className="space-y-2">
                                {songs.map((song, index) => (
                                    <div
                                        key={song.encodeId || index}
                                        onClick={() => handleSongClick(song)}
                                        className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={song.thumbnailM || song.thumbnail}
                                                alt={song.title}
                                                className="w-12 h-12 rounded-lg object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16 10,8"/></svg>';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-all duration-300">
                                                <Play className="w-5 h-5 text-white fill-white" />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-medium truncate group-hover:text-cyan-400 transition-colors duration-300">
                                                {song.title}
                                            </h4>
                                            <p className="text-sm text-gray-400 truncate">
                                                {song.artistsNames}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <span className="text-xs text-gray-500 font-mono">
                                                {formatDuration(song.duration)}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Handle favorite
                                                }}
                                                className="p-1.5 hover:bg-gray-700 rounded-full transition-colors duration-200"
                                            >
                                                <Heart className="w-4 h-4 text-gray-400 hover:text-red-400" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Handle more options
                                                }}
                                                className="p-1.5 hover:bg-gray-700 rounded-full transition-colors duration-200"
                                            >
                                                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Artists */}
                    {activeTab === 'artists' && artists.length > 0 && (
                        <div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {artists.map((artist, index) => (
                                    <div
                                        key={artist.id || index}
                                        className="group bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl p-4 hover:from-gray-700/40 hover:to-gray-800/40 transition-all duration-300 cursor-pointer hover:scale-105"
                                    >
                                        <div className="text-center">
                                            <img
                                                src={artist.thumbnailM || artist.thumbnail}
                                                alt={artist.name}
                                                className="w-16 h-16 mx-auto rounded-full object-cover mb-3 ring-2 ring-gray-700 group-hover:ring-cyan-400 transition-all duration-300"
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                                                }}
                                            />
                                            <h4 className="text-white font-medium truncate group-hover:text-cyan-400 transition-colors duration-300 mb-1">
                                                {artist.name}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {artist.totalFollow?.toLocaleString()} người theo dõi
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Playlists */}
                    {activeTab === 'playlists' && playlists.length > 0 && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {playlists.map((playlist, index) => (
                                    <div
                                        key={playlist.encodeId || index}
                                        className="group bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl p-4 hover:from-gray-700/40 hover:to-gray-800/40 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={playlist.thumbnailM || playlist.thumbnail}
                                                alt={playlist.title}
                                                className="w-16 h-16 rounded-lg object-cover ring-2 ring-gray-700 group-hover:ring-cyan-400 transition-all duration-300"
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15V6"/><path d="M21 21H3V18"/><path d="M19 3H5"/><path d="M3 9h16v6H3z"/></svg>';
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-medium truncate group-hover:text-cyan-400 transition-colors duration-300 mb-1">
                                                    {playlist.title}
                                                </h4>
                                                <p className="text-sm text-gray-400 truncate">
                                                    {playlist.artistsNames}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {playlist.song?.total || 0} bài hát
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="relative">
            {/* Search Trigger */}
            <button
                onClick={handleOpen}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/50 backdrop-blur-sm rounded-xl hover:bg-gray-700/50 transition-all duration-300 text-gray-300 hover:text-white group border border-gray-700/50 hover:border-gray-600"
            >
                <Search className="w-4 h-4 group-hover:text-cyan-400 transition-colors duration-300" />
                <span className="hidden sm:block">Tìm kiếm nhạc...</span>
                <span className="hidden lg:block text-xs text-gray-500 ml-2">Ctrl+K</span>
            </button>

            {/* Search Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-16 px-4"
                    onClick={(e) => e.target === e.currentTarget && handleClose()}
                >
                    <div
                        ref={modalRef}
                        className="w-full max-w-4xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden animate-in slide-in-from-top-4 duration-300"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-4 p-6 border-b border-gray-700/50">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Tìm kiếm bài hát, nghệ sĩ, album..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-800/50 rounded-xl text-white placeholder-gray-400 border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                                />
                                {inputValue && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-gray-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={handleClose}
                                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors duration-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Results */}
                        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <SearchResults />
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(55, 65, 81, 0.1);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.5);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(156, 163, 175, 0.7);
                }
            `}</style>
        </div>
    );
};

export default SearchComponent;