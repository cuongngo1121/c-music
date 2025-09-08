import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

function MusicFrame() {
    const dispatch = useDispatch();
    const { data: infoSong } = useSelector(state => state.music.infoSong);
    const { data: linkData, loading: linkLoading, error: linkError } = useSelector(state => state.music.linkSong);
    const audioRef = useRef(null);
    const lyricsContainerRef = useRef(null);

    const [currentSong, setCurrentSong] = useState(null);
    const [audioSrc, setAudioSrc] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    // Audio state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Lyrics state
    const [showLyrics, setShowLyrics] = useState(false);
    const [lyrics, setLyrics] = useState(null);
    const [parsedLyrics, setParsedLyrics] = useState([]);
    const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
    const [lyricsLoading, setLyricsLoading] = useState(false);
    const [lyricsError, setLyricsError] = useState(null);

    // Parse LRC format lyrics
    const parseLRC = (lrcText) => {
        const lines = lrcText.split('\n');
        const parsed = [];

        const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2})\]/g;

        lines.forEach(line => {
            const matches = [...line.matchAll(timeRegex)];
            if (matches.length > 0) {
                matches.forEach(match => {
                    const minutes = parseInt(match[1]);
                    const seconds = parseInt(match[2]);
                    const milliseconds = parseInt(match[3]);
                    const time = minutes * 60 + seconds + milliseconds / 100;

                    const text = line.replace(timeRegex, '').trim();
                    if (text) {
                        parsed.push({ time, text });
                    }
                });
            }
        });

        return parsed.sort((a, b) => a.time - b.time);
    };

    // Find current lyric based on playback time
    useEffect(() => {
        if (parsedLyrics.length > 0 && isPlaying) {
            let index = -1;
            for (let i = parsedLyrics.length - 1; i >= 0; i--) {
                if (currentTime >= parsedLyrics[i].time) {
                    index = i;
                    break;
                }
            }

            if (index !== currentLyricIndex) {
                setCurrentLyricIndex(index);

                // Auto-scroll to current lyric
                if (lyricsContainerRef.current && index >= 0) {
                    const activeElement = lyricsContainerRef.current.querySelector(`[data-index="${index}"]`);
                    if (activeElement) {
                        activeElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }
            }
        }
    }, [currentTime, parsedLyrics, isPlaying, currentLyricIndex]);

    // Fetch lyrics function
    const fetchLyrics = async (songId) => {
        if (!songId) return;

        setLyricsLoading(true);
        setLyricsError(null);

        try {
            const response = await fetch(`http://localhost:5000/api/lyric/${songId}`);
            const data = await response.json();

            if (data.err === 0 && data.data) {
                setLyrics(data.data);

                // Try to parse different lyric formats
                if (data.data.file) {
                    const lrcParsed = parseLRC(data.data.file);
                    if (lrcParsed.length > 0) {
                        setParsedLyrics(lrcParsed);
                    } else {
                        // Fallback to plain text
                        const lines = data.data.file.split('\n').filter(line => line.trim());
                        setParsedLyrics(lines.map((text, index) => ({ time: index * 3, text })));
                    }
                } else if (data.data.sentences) {
                    const sentenceLyrics = data.data.sentences.map((sentence, index) => ({
                        time: index * 3,
                        text: sentence.words.map(word => word.data).join(' ')
                    }));
                    setParsedLyrics(sentenceLyrics);
                }
            } else {
                setLyricsError('Không tìm thấy lời bài hát');
            }
        } catch (error) {
            console.error('Error fetching lyrics:', error);
            setLyricsError('Lỗi khi tải lời bài hát');
        } finally {
            setLyricsLoading(false);
        }
    };

    // Toggle lyrics panel
    const toggleLyrics = () => {
        if (!showLyrics && currentSong && currentSong.encodeId) {
            fetchLyrics(currentSong.encodeId);
        }
        setShowLyrics(!showLyrics);
    };

    // Process linkData để lấy audio URL
    useEffect(() => {
        console.log('🔍 linkData received:', linkData);

        let audioLinks = null;

        if (linkData && linkData.data && typeof linkData.data === 'object') {
            audioLinks = linkData.data;
        } else if (linkData && typeof linkData === 'object' && (linkData['128'] || linkData['320'] || linkData['96'])) {
            audioLinks = linkData;
        }

        if (audioLinks && Object.keys(audioLinks).length > 0) {
            console.log('📊 Audio links available:', audioLinks);

            const isValidLink = (link) => {
                return link &&
                    typeof link === 'string' &&
                    link !== 'VIP' &&
                    link.trim() !== '' &&
                    (link.startsWith('http') || link.startsWith('//'));
            };

            let audioLink = null;
            const qualityOrder = ['320', '128', '96', '64'];

            for (const quality of qualityOrder) {
                if (audioLinks[quality] && isValidLink(audioLinks[quality])) {
                    audioLink = audioLinks[quality];
                    console.log(`✅ Selected ${quality}kbps link:`, audioLink);
                    break;
                }
            }

            if (audioLink) {
                if (audioLink.startsWith('//')) {
                    audioLink = 'https:' + audioLink;
                }

                setAudioSrc(audioLink);
                setIsVisible(true);

                setCurrentSong({
                    title: infoSong.title || 'Đang phát nhạc...',
                    artistsNames: infoSong.artistsNames || 'Không rõ ca sĩ',
                    thumbnail: infoSong.thumbnail || infoSong.thumbnailM || '',
                    encodeId: infoSong.encodeId
                });

                console.log('🎵 Audio source set successfully:', audioLink);
            } else {
                console.warn('❌ No valid audio link found');
                setIsVisible(true);
            }
        }
    }, [linkData]);

    // Handle audio events
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadStart = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleEnded = () => setIsPlaying(false);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('loadstart', handleLoadStart);
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('loadstart', handleLoadStart);
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, [audioSrc]);

    // Auto play when audio source is set
    useEffect(() => {
        if (audioSrc && audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.play().catch(console.error);
        }
    }, [audioSrc]);

    // Control functions
    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    };

    const handleSeek = (e) => {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * duration;

        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
        if (newVolume > 0) setIsMuted(false);
    };

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.volume = volume;
                setIsMuted(false);
            } else {
                audioRef.current.volume = 0;
                setIsMuted(true);
            }
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleClose = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsVisible(false);
        setAudioSrc('');
        setCurrentSong(null);
        setIsPlaying(false);
        setShowLyrics(false);
        setLyrics(null);
        setParsedLyrics([]);
        setCurrentLyricIndex(-1);
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    if (!isVisible && !linkLoading) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            {/* Audio element */}
            {audioSrc && (
                <audio
                    ref={audioRef}
                    src={audioSrc}
                    preload="auto"
                />
            )}

            {/* Lyrics Panel */}
            {showLyrics && (
                <div className="absolute bottom-full left-0 right-0 bg-[var(--color-background)]/95 backdrop-blur-xl border-t border-[var(--color-borderColor)]/20 shadow-2xl max-h-96 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[var(--color-primary)] font-bold text-lg flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                </svg>
                                Lời bài hát
                            </h3>
                            <button
                                onClick={() => setShowLyrics(false)}
                                className="w-8 h-8 bg-[var(--color-borderColor)]/20 hover:bg-[var(--color-borderColor)]/30 rounded-full flex items-center justify-center transition-all duration-300"
                            >
                                <svg className="w-4 h-4 text-[var(--color-borderColor)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div
                            ref={lyricsContainerRef}
                            className="overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-[var(--color-secondary)] scrollbar-track-transparent"
                        >
                            {lyricsLoading && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-[var(--color-secondary)]/30 border-t-[var(--color-secondary)] rounded-full animate-spin"></div>
                                    <span className="ml-3 text-[var(--color-borderColor)]">Đang tải lời bài hát...</span>
                                </div>
                            )}

                            {lyricsError && (
                                <div className="text-center py-8 text-[var(--color-borderColor)]/70">
                                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.901-6.064 2.379l2.122 2.122z" />
                                    </svg>
                                    <p>{lyricsError}</p>
                                </div>
                            )}

                            {parsedLyrics.length > 0 && !lyricsLoading && (
                                <div className="space-y-2 py-4">
                                    {parsedLyrics.map((lyric, index) => (
                                        <p
                                            key={index}
                                            data-index={index}
                                            className={`leading-relaxed text-lg transition-all duration-300 cursor-pointer hover:text-[var(--color-secondary)] px-4 py-2 rounded-lg ${index === currentLyricIndex
                                                    ? 'text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 font-bold transform scale-105 shadow-lg'
                                                    : index < currentLyricIndex
                                                        ? 'text-[var(--color-borderColor)]/50'
                                                        : 'text-[var(--color-primary)]'
                                                }`}
                                            onClick={() => {
                                                if (audioRef.current && lyric.time) {
                                                    audioRef.current.currentTime = lyric.time;
                                                }
                                            }}
                                        >
                                            {lyric.text}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {parsedLyrics.length === 0 && !lyricsLoading && !lyricsError && (
                                <p className="text-[var(--color-borderColor)]/70 text-center py-8">
                                    Không có lời bài hát
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Music player container */}
            <div className="bg-[var(--color-background)] backdrop-blur-2xl border-t border-[var(--color-borderColor)]/20 shadow-2xl music-frame-gradient">
                <div className="max-w-7xl mx-auto px-6 py-5">

                    {/* Loading state */}
                    {linkLoading && (
                        <div className="flex items-center justify-center py-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-8 h-8 border-3 border-[var(--color-secondary)]/30 border-t-[var(--color-secondary)] rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 w-8 h-8 border-3 border-transparent border-t-[var(--color-thirdary)] rounded-full animate-spin animate-reverse opacity-60"></div>
                                </div>
                                <span className="text-[var(--color-borderColor)] font-medium animate-pulse">Đang tải nhạc...</span>
                            </div>
                        </div>
                    )}

                    {/* Error state */}
                    {linkError && !linkLoading && (
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3 text-red-400">
                                <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">Lỗi: {linkError}</span>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 bg-[var(--color-background)]/60 border border-[var(--color-borderColor)]/30 hover:bg-[var(--color-borderColor)]/10 hover:border-[var(--color-borderColor)]/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                            >
                                <svg className="w-4 h-4 text-[var(--color-borderColor)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* VIP message */}
                    {isVisible && !audioSrc && !linkLoading && !linkError && linkData && (
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3 text-yellow-400">
                                <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">Bài hát yêu cầu tài khoản VIP</span>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 bg-[var(--color-background)]/60 border border-[var(--color-borderColor)]/30 hover:bg-[var(--color-borderColor)]/10 hover:border-[var(--color-borderColor)]/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                            >
                                <svg className="w-4 h-4 text-[var(--color-borderColor)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Main player */}
                    {audioSrc && !linkLoading && !linkError && (
                        <div className="flex items-center gap-6">
                            {/* Song info */}
                            {currentSong && (
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <div className="relative group">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-thirdary)] shadow-lg">
                                            {currentSong.thumbnail ? (
                                                <img
                                                    src={currentSong.thumbnail}
                                                    alt={currentSong.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[var(--color-primary)] text-2xl animate-pulse">
                                                    🎵
                                                </div>
                                            )}
                                        </div>
                                        {isPlaying && (
                                            <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-thirdary)] rounded-full flex items-center justify-center animate-pulse shadow-lg">
                                                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-ping"></div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-secondary)]/20 to-[var(--color-thirdary)]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-[var(--color-primary)] font-bold text-lg truncate max-w-[200px] leading-tight">
                                            {currentSong.title}
                                        </h4>
                                        <p className="text-[var(--color-borderColor)]/70 text-sm truncate max-w-[200px] mt-1">
                                            {currentSong.artistsNames}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Player controls */}
                            <div className="flex-1 flex flex-col gap-3">
                                {/* Control buttons */}
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={togglePlayPause}
                                        disabled={isLoading}
                                        className="w-16 h-16 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-thirdary)] hover:from-[var(--color-thirdary)] hover:to-[var(--color-secondary)] rounded-full flex items-center justify-center text-[var(--color-primary)] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {isLoading ? (
                                            <div className="w-6 h-6 border-2 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                                        ) : isPlaying ? (
                                            <svg className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-7 h-7 ml-1 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Progress bar */}
                                <div className="flex items-center gap-4 text-sm text-[var(--color-borderColor)]">
                                    <span className="w-12 text-right font-medium">{formatTime(currentTime)}</span>
                                    <div
                                        className="flex-1 h-3 bg-[var(--color-borderColor)]/20 rounded-full cursor-pointer group overflow-hidden"
                                        onClick={handleSeek}
                                    >
                                        <div className="relative h-full">
                                            <div
                                                className="h-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-thirdary)] rounded-full transition-all duration-300 shadow-sm"
                                                style={{ width: `${progressPercent}%` }}
                                            ></div>
                                            <div
                                                className="absolute top-1/2 w-5 h-5 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-thirdary)] rounded-full shadow-lg transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 border-2 border-[var(--color-primary)]"
                                                style={{ left: `${progressPercent}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                                            ></div>
                                        </div>
                                    </div>
                                    <span className="w-12 font-medium">{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Volume controls and Lyrics button */}
                            <div className="flex items-center gap-4 flex-shrink-0">
                                {/* Lyrics button */}
                                <button
                                    onClick={toggleLyrics}
                                    className={`p-2 rounded-full transition-all duration-300 ${showLyrics
                                            ? 'text-[var(--color-secondary)] bg-[var(--color-secondary)]/20'
                                            : 'text-[var(--color-borderColor)] hover:text-[var(--color-secondary)] hover:bg-[var(--color-borderColor)]/10'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                    </svg>
                                </button>

                                <button
                                    onClick={toggleMute}
                                    className="text-[var(--color-borderColor)] hover:text-[var(--color-secondary)] transition-colors duration-300 p-2 hover:bg-[var(--color-borderColor)]/10 rounded-full"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        {isMuted || volume === 0 ? (
                                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                        ) : (
                                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                        )}
                                    </svg>
                                </button>
                                <div className="w-24 h-2 bg-[var(--color-borderColor)]/20 rounded-full relative group">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={isMuted ? 0 : volume}
                                        onChange={handleVolumeChange}
                                        className="w-full h-2 bg-transparent appearance-none cursor-pointer volume-slider"
                                    />
                                </div>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 bg-[var(--color-background)]/60 border border-[var(--color-borderColor)]/30 hover:bg-[var(--color-borderColor)]/10 hover:border-[var(--color-borderColor)]/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0 group"
                            >
                                <svg className="w-5 h-5 text-[var(--color-borderColor)] group-hover:text-[var(--color-secondary)] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--color-secondary)] rounded-full opacity-20 animate-float-1"></div>
                    <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-[var(--color-thirdary)] rounded-full opacity-30 animate-float-2"></div>
                    <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-[var(--color-secondary)] rounded-full opacity-25 animate-float-3"></div>
                </div>
            </div>

            <style jsx>{`
                .music-frame-gradient {
                    background: linear-gradient(135deg, var(--color-background) 0%, rgba(64, 202, 194, 0.02) 50%, var(--color-background) 100%);
                }

                .volume-slider {
                    background: linear-gradient(to right, var(--color-secondary) 0%, var(--color-thirdary) ${isMuted ? 0 : volume * 100}%, rgba(209, 209, 209, 0.2) ${isMuted ? 0 : volume * 100}%, rgba(209, 209, 209, 0.2) 100%);
                    border-radius: 4px;
                }
                
                .volume-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    background: linear-gradient(45deg, var(--color-secondary), var(--color-thirdary));
                    border-radius: 50%;
                    cursor: pointer;
                    border: 2px solid var(--color-primary);
                    box-shadow: 0 2px 8px rgba(64, 202, 194, 0.3);
                    transition: all 0.3s ease;
                }
                
                .volume-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 12px rgba(64, 202, 194, 0.5);
                }
                
                .volume-slider::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    background: linear-gradient(45deg, var(--color-secondary), var(--color-thirdary));
                    border-radius: 50%;
                    cursor: pointer;
                    border: 2px solid var(--color-primary);
                    box-shadow: 0 2px 8px rgba(64, 202, 194, 0.3);
                    transition: all 0.3s ease;
                }

                .scrollbar-thin {
                    scrollbar-width: thin;
                }
                
                .scrollbar-thumb-\[var\(--color-secondary\)\] {
                    --scrollbar-thumb: var(--color-secondary);
                }
                
                .scrollbar-track-transparent {
                    --scrollbar-track: transparent;
                }

                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: var(--color-secondary);
                    border-radius: 3px;
                }
                
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: var(--color-thirdary);
                }
                
                @keyframes float-1 {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px) scale(1); 
                        opacity: 0.2;
                    }
                    33% { 
                        transform: translateY(-8px) translateX(4px) scale(1.1); 
                        opacity: 0.4;
                    }
                    66% { 
                        transform: translateY(4px) translateX(-4px) scale(0.9); 
                        opacity: 0.3;
                    }
                }

                @keyframes float-2 {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px) scale(1); 
                        opacity: 0.3;
                    }
                    33% { 
                        transform: translateY(6px) translateX(-6px) scale(1.2); 
                        opacity: 0.5;
                    }
                    66% { 
                        transform: translateY(-4px) translateX(3px) scale(0.8); 
                        opacity: 0.4;
                    }
                }

                @keyframes float-3 {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px) scale(1); 
                        opacity: 0.25;
                    }
                    33% { 
                        transform: translateY(-6px) translateX(-3px) scale(1.3); 
                        opacity: 0.4;
                    }
                    66% { 
                        transform: translateY(8px) translateX(6px) scale(0.7); 
                        opacity: 0.35;
                    }
                }
                
                @keyframes reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                
                .animate-reverse {
                    animation-direction: reverse;
                }

                .animate-float-1 {
                    animation: float-1 6s ease-in-out infinite;
                }

                .animate-float-2 {
                    animation: float-2 7s ease-in-out infinite;
                }

                .animate-float-3 {
                    animation: float-3 5.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default MusicFrame;