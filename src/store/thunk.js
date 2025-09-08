import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL =
    import.meta.env.MODE === 'development'
        ? 'http://localhost:5000/api'
        : 'https://api-zing-p20v.onrender.com/api';


export const getNewReleaseChart = createAsyncThunk(
    'song/getNewReleaseChart',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${BASE_URL}/new-release`);
            console.log('📦 Dữ liệu từ API new-release:', res.data);

            // Kiểm tra dữ liệu hợp lệ             
            if (res.data.err === 0 && res.data.data?.items) {
                return res.data.data.items;
            } else {
                return rejectWithValue('Không có dữ liệu bài hát mới.');
            }
        } catch (err) {
            return rejectWithValue('Lỗi khi tải danh sách mới.');
        }
    }
);

export const getHomeChart = createAsyncThunk(
    'song/getHomeChart',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${BASE_URL}/chart-home`)
            console.log('📦 Dữ liệu từ API chart-home:', res.data);
            if (res.data.err === 0 && res.data.data?.RTChart.items) {
                return res.data.data.RTChart.items;
            } else {
                return rejectWithValue('Không có dữ liệu bài hát mới.');
            }
        } catch (error) {
            return rejectWithValue('Lỗi khi tải danh sách mới.');
        }
    }
);

export const getDetailSong = createAsyncThunk(
    'song/getDetailSong',
    async (songId, { rejectWithValue }) => {
        try {
            console.log('🚀 Making API call to:', `${BASE_URL}/song/${songId}`);
            console.log('🆔 Song ID:', songId);

            const res = await axios.get(`${BASE_URL}/song/${songId}`);

            console.log('📨 Raw API Response:', res);
            console.log('📊 Response status:', res.status);
            console.log('📋 Response headers:', res.headers);
            console.log('📦 Response data:', res.data);

            if (res.data.err === 0 && res.data?.data) {
                console.log('✅ API call successful, data:', res.data.data);
                return res.data.data;
            } else {
                console.log('❌ API response error:', res.data);
                return rejectWithValue('Không có dữ liệu link bài hát.');
            }
        } catch (error) {
            console.error('🚨 API call failed with error:', error);
            console.error('🔍 Error details:', {
                message: error.message,
                response: error.response,
                request: error.request,
                stack: error.stack
            });

            if (error.response) {
                console.error('📋 Error response data:', error.response.data);
                console.error('📊 Error response status:', error.response.status);
            }

            return rejectWithValue(`Lỗi khi tải link bài hát: ${error.message}`);
        }
    }
);

// 🔍 THÊM: Search Music Function
export const searchMusic = createAsyncThunk(
    'music/searchMusic',
    async (query, { rejectWithValue }) => {
        try {
            console.log('🔍 Searching for:', query);

            if (!query || query.trim() === '') {
                return rejectWithValue('Vui lòng nhập từ khóa tìm kiếm.');
            }

            const res = await axios.get(`${BASE_URL}/search/${encodeURIComponent(query)}`);

            console.log('📦 Search API Response:', res.data);

            if (res.data.err === 0 && res.data.data) {
                const { songs = [], artists = [], playlists = [] } = res.data.data;

                return {
                    songs,
                    artists,
                    playlists,
                    query: query.trim()
                };
            } else {
                return rejectWithValue('Không tìm thấy kết quả nào.');
            }
        } catch (error) {
            console.error('🚨 Search API failed:', error);

            if (error.response?.status === 404) {
                return rejectWithValue('Không tìm thấy kết quả nào.');
            }

            return rejectWithValue(`Lỗi khi tìm kiếm: ${error.message}`);
        }
    }
);