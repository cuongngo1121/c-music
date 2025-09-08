import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Heart, Share2, Download, Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin, TrendingUp, Users, Award, Star } from 'lucide-react';

const Footer = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(70);
    const [progress, setProgress] = useState(30);
    const [hoveredSocial, setHoveredSocial] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
            }, 200);
            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    const socialLinks = [
        { icon: Instagram, name: 'Instagram', color: '#E4405F', followers: '2.3M' },
        { icon: Twitter, name: 'Twitter', color: '#1DA1F2', followers: '850K' },
        { icon: Facebook, name: 'Facebook', color: '#4267B2', followers: '1.8M' },
        { icon: Youtube, name: 'YouTube', color: '#FF0000', followers: '3.1M' }
    ];

    const stats = [
        { icon: TrendingUp, label: 'Monthly Plays', value: '50M+', color: '#40CAC2' },
        { icon: Users, label: 'Active Users', value: '2.5M', color: '#38BACC' },
        { icon: Award, label: 'Awards Won', value: '127', color: '#40CAC2' },
        { icon: Star, label: 'Top Rating', value: '4.9/5', color: '#38BACC' }
    ];

    const quickLinks = [
        'Discover Music', 'Top Charts', 'New Releases', 'Podcasts', 'Live Radio',
        'Artist Hub', 'Music Videos', 'Playlists', 'Concerts', 'Premium'
    ];

    const genres = [
        'Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical',
        'Country', 'R&B', 'Indie', 'Alternative', 'Folk', 'Reggae'
    ];

    return (
        <footer className="relative bg-black text-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-10">
                {/* Floating Particles */}
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-gradient-to-r from-[#40CAC2] to-[#38BACC] rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    />
                ))}

                {/* Moving Waves */}
                <div className="absolute bottom-0 left-0 w-full h-32">
                    <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path
                            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
                            fill="url(#waveGradient)"
                            className="animate-pulse"
                        />
                        <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#40CAC2" stopOpacity="0.3" />
                                <stop offset="50%" stopColor="#38BACC" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#40CAC2" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-[#40CAC2]/20 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-[#38BACC]/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Dynamic Cursor Trail Effect */}
            <div
                className="fixed w-4 h-4 rounded-full pointer-events-none z-50 opacity-50 transition-all duration-300"
                style={{
                    left: mousePosition.x - 8,
                    top: mousePosition.y - 8,
                    background: `linear-gradient(135deg, #40CAC2, #38BACC)`,
                    boxShadow: `0 0 20px #40CAC2`,
                    transform: `scale(${hoveredSocial ? 2 : 1})`
                }}
            />

            <div className="relative z-10">
                {/* Top Section - Music Player Stats */}
                <div className="border-b border-gray-800 bg-gradient-to-r from-black/90 to-gray-900/90 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 backdrop-blur-sm border border-gray-700/50 hover:border-[#40CAC2]/50 transition-all duration-500 hover:scale-105 hover:rotate-1"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    onMouseEnter={() => setActiveSection(stat.label)}
                                    onMouseLeave={() => setActiveSection(null)}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#40CAC2]/10 to-[#38BACC]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative flex items-center space-x-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}
                                            style={{ background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}40)` }}>
                                            <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 group-hover:from-[#40CAC2] group-hover:to-[#38BACC] transition-all duration-500">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Animated progress bar */}
                                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#40CAC2] to-[#38BACC] transition-all duration-1000"
                                        style={{ width: activeSection === stat.label ? '100%' : '0%' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                        {/* Brand Section */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="group cursor-pointer">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#40CAC2] to-[#38BACC] rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                            <Music className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 group-hover:from-[#40CAC2] group-hover:to-[#38BACC] transition-all duration-500">
                                        MusicPro
                                    </h3>
                                </div>
                            </div>

                            <p className="text-gray-400 leading-relaxed">
                                Trải nghiệm âm nhạc không giới hạn với chất lượng Hi-Fi và những tính năng độc quyền dành riêng cho bạn.
                            </p>

                            {/* Live Stats */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Đang nghe</span>
                                    <span className="text-[#40CAC2] font-semibold animate-pulse">
                                        {(Math.random() * 50000 + 150000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} người
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Thời gian thực</span>
                                    <span className="text-[#38BACC] font-mono">
                                        {currentTime.toLocaleTimeString('vi-VN')}
                                    </span>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-3 pt-4 border-t border-gray-800">
                                <div className="flex items-center space-x-3 text-sm text-gray-400 hover:text-[#40CAC2] transition-colors duration-300 cursor-pointer">
                                    <Mail className="w-4 h-4" />
                                    <span>hello@musicpro.com</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-gray-400 hover:text-[#40CAC2] transition-colors duration-300 cursor-pointer">
                                    <Phone className="w-4 h-4" />
                                    <span>+84 123 456 789</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-gray-400 hover:text-[#40CAC2] transition-colors duration-300 cursor-pointer">
                                    <MapPin className="w-4 h-4" />
                                    <span>Hà Nội, Việt Nam</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                                Khám phá
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                {quickLinks.map((link, index) => (
                                    <a
                                        key={link}
                                        href="#"
                                        className="text-sm text-gray-400 hover:text-[#40CAC2] transition-all duration-300 hover:translate-x-2 hover:scale-105 py-1 px-2 rounded-lg hover:bg-gray-800/50"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        {link}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Genres */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                                Thể loại
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {genres.map((genre, index) => (
                                    <span
                                        key={genre}
                                        className="px-3 py-1 text-xs bg-gray-800/50 text-gray-400 rounded-full hover:bg-gradient-to-r hover:from-[#40CAC2]/20 hover:to-[#38BACC]/20 hover:text-white transition-all duration-300 cursor-pointer hover:scale-105"
                                        style={{ animationDelay: `${index * 0.03}s` }}
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Social Media & Newsletter */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                                Kết nối
                            </h4>

                            <div className="grid grid-cols-2 gap-3">
                                {socialLinks.map((social, index) => (
                                    <div
                                        key={social.name}
                                        className="group relative overflow-hidden rounded-xl bg-gray-800/30 p-4 backdrop-blur-sm border border-gray-700/30 hover:border-opacity-60 transition-all duration-500 cursor-pointer hover:scale-105 hover:-rotate-2"
                                        style={{
                                            borderColor: hoveredSocial === social.name ? social.color : undefined,
                                            boxShadow: hoveredSocial === social.name ? `0 10px 30px ${social.color}30` : undefined
                                        }}
                                        onMouseEnter={() => setHoveredSocial(social.name)}
                                        onMouseLeave={() => setHoveredSocial(null)}
                                    >
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{ background: `linear-gradient(135deg, ${social.color}10, ${social.color}05)` }} />

                                        <div className="relative flex items-center space-x-3">
                                            <social.icon
                                                className="w-5 h-5 transition-all duration-300 group-hover:scale-110"
                                                style={{ color: hoveredSocial === social.name ? social.color : '#9CA3AF' }}
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-white group-hover:text-opacity-100">
                                                    {social.name}
                                                </div>
                                                <div className="text-xs text-gray-400 group-hover:text-gray-300">
                                                    {social.followers}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Newsletter */}
                            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700/50">
                                <h5 className="text-sm font-medium text-white mb-3">Nhận thông tin mới nhất</h5>
                                <div className="flex">
                                    <input
                                        type="email"
                                        placeholder="Email của bạn..."
                                        className="flex-1 bg-gray-700/50 border border-gray-600 rounded-l-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#40CAC2] transition-colors duration-300"
                                    />
                                    <button className="px-4 py-2 bg-gradient-to-r from-[#40CAC2] to-[#38BACC] text-white rounded-r-lg hover:scale-105 transition-transform duration-300 font-medium">
                                        Đăng ký
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mini Music Player */}
                <div className="border-t border-gray-800 bg-gradient-to-r from-black/95 to-gray-900/95 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#40CAC2] to-[#38BACC] rounded-lg flex items-center justify-center relative overflow-hidden">
                                    <Music className="w-6 h-6 text-white z-10" />
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Đang phát: Nhạc thịnh hành</div>
                                    <div className="text-xs text-gray-400">Playlist tự động</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <button className="text-gray-400 hover:text-[#40CAC2] transition-colors duration-300 hover:scale-110">
                                    <SkipBack className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-10 h-10 bg-gradient-to-br from-[#40CAC2] to-[#38BACC] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
                                >
                                    {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-1" />}
                                </button>
                                <button className="text-gray-400 hover:text-[#40CAC2] transition-colors duration-300 hover:scale-110">
                                    <SkipForward className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex items-center space-x-4">
                                <Volume2 className="w-4 h-4 text-gray-400" />
                                <div className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#40CAC2] to-[#38BACC] transition-all duration-300"
                                        style={{ width: `${volume}%` }}
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors duration-300 cursor-pointer hover:scale-110" />
                                    <Share2 className="w-4 h-4 text-gray-400 hover:text-[#40CAC2] transition-colors duration-300 cursor-pointer hover:scale-110" />
                                    <Download className="w-4 h-4 text-gray-400 hover:text-[#38BACC] transition-colors duration-300 cursor-pointer hover:scale-110" />
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#40CAC2] to-[#38BACC] transition-all duration-500 relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute right-0 top-0 w-2 h-full bg-white rounded-full shadow-lg" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 bg-black/90 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                            <div className="text-sm text-gray-400">
                                © 2025 MusicPro. Tất cả quyền được bảo lưu. Made with ❤️ in Vietnam
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-400">
                                <a href="#" className="hover:text-[#40CAC2] transition-colors duration-300 hover:scale-105">Điều khoản</a>
                                <a href="#" className="hover:text-[#40CAC2] transition-colors duration-300 hover:scale-105">Bảo mật</a>
                                <a href="#" className="hover:text-[#40CAC2] transition-colors duration-300 hover:scale-105">Cookies</a>
                                <a href="#" className="hover:text-[#40CAC2] transition-colors duration-300 hover:scale-105">Hỗ trợ</a>
                            </div>

                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span>Hệ thống hoạt động bình thường</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;