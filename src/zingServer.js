import express from 'express';
import cors from 'cors';
import { ZingMp3 } from 'zingmp3-api-full';

const app = express();
app.use(cors());

// 🔊 Get Song
app.get('/api/song/:id', async (req, res) => {
    try {
        const data = await ZingMp3.getSong(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy bài hát' });
    }
});

// 📜 Get Lyric
app.get('/api/lyric/:id', async (req, res) => {
    try {
        const data = await ZingMp3.getLyric(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy lời bài hát' });
    }
});

// 🎶 Get Song Info
app.get('/api/info/:id', async (req, res) => {
    try {
        const data = await ZingMp3.getInfoSong(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy thông tin bài hát' });
    }
});

// 📂 Get Detail Playlist
app.get('/api/playlist/:id', async (req, res) => {
    try {
        const data = await ZingMp3.getDetailPlaylist(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy playlist' });
    }
});

// 🏠 Get Home
app.get('/api/home', async (req, res) => {
    try {
        const data = await ZingMp3.getHome();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy trang chủ' });
    }
});

// 🔝 Get Top 100
app.get('/api/top100', async (req, res) => {
    try {
        const data = await ZingMp3.getTop100();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy Top 100' });
    }
});

// 📈 Get Chart Home
app.get('/api/chart-home', async (req, res) => {
    try {
        const data = await ZingMp3.getChartHome();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy bảng xếp hạng' });
    }
});

// 🆕 Get New Release Chart
app.get('/api/new-release', async (req, res) => {
    try {
        const data = await ZingMp3.getNewReleaseChart();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy nhạc mới phát hành' });
    }
});

// 👤 Get Artist Info
app.get('/api/artist/:name', async (req, res) => {
    try {
        const data = await ZingMp3.getArtist(req.params.name);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy thông tin nghệ sĩ' });
    }
});

// 🎵 Get List Song by Artist
app.get('/api/artist-songs/:id/:page/:count', async (req, res) => {
    try {
        const { id, page, count } = req.params;
        const data = await ZingMp3.getListArtistSong(id, page, count);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách bài hát của nghệ sĩ' });
    }
});

// 🔍 Search Song
app.get('/api/search/:query', async (req, res) => {
    try {
        const data = await ZingMp3.search(req.params.query);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi tìm kiếm bài hát' });
    }
});

// 🎬 Get List MV
app.get('/api/mv-list/:id/:page/:count', async (req, res) => {
    try {
        const { id, page, count } = req.params;
        const data = await ZingMp3.getListMV(id, page, count);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách MV' });
    }
});

// 🗂️ Get Category MV
app.get('/api/mv-category/:id', async (req, res) => {
    try {
        const data = await ZingMp3.getCategoryMV(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy thể loại MV' });
    }
});

// 📺 Get Video MV
app.get('/api/video/:id', async (req, res) => {
    try {
        const data = await ZingMp3.getVideo(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy video MV' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Zing MP3 API Server đang chạy tại http://localhost:${PORT}`);
});
