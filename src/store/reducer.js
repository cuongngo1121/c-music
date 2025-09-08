// Cập nhật musicSlice.js của bạn

import { createSlice } from "@reduxjs/toolkit";
import { getNewReleaseChart, getHomeChart, getDetailSong, searchMusic } from "./thunk";

const musicSlice = createSlice({
    name: 'music',
    initialState: {
        homeChart: {
            data: [],
            loading: false,
            error: null,
        },
        newReleaseChart: {
            data: [],
            loading: false,
            error: null,
        },
        linkSong: {
            data: [],
            loading: false,
            error: null,
        },
        currentSong: {
            info: null,
            isPlaying: false,
        },
        infoSong: {
            data: [],
            loading: false,
            error: null,
        },
        // 🔍 THÊM: Search state
        search: {
            data: {
                songs: [],
                artists: [],
                playlists: []
            },
            loading: false,
            error: null,
            query: '',
            hasSearched: false
        },
    },

    reducers: {
        setCurrentSong: (state, action) => {
            state.currentSong.info = action.payload;
            state.currentSong.isPlaying = true;
        },
        clearCurrentSong: (state) => {
            state.currentSong.info = null;
            state.currentSong.isPlaying = false;
        },
        togglePlayPause: (state) => {
            state.currentSong.isPlaying = !state.currentSong.isPlaying;
        },
        setInfoSong: (state, action) => {
            state.infoSong.data = action.payload;
            state.infoSong.loading = false;
            state.infoSong.error = null;
        },
        // 🔍 THÊM: Search actions
        clearSearchResults: (state) => {
            state.search.data = {
                songs: [],
                artists: [],
                playlists: []
            };
            state.search.query = '';
            state.search.error = null;
            state.search.hasSearched = false;
        },
        setSearchQuery: (state, action) => {
            state.search.query = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder
            // ... existing cases ...
            .addCase(getHomeChart.pending, (state) => {
                state.homeChart.loading = true;
                state.homeChart.error = null;
            })
            .addCase(getHomeChart.fulfilled, (state, action) => {
                state.homeChart.data = action.payload;
                state.homeChart.loading = false;
            })
            .addCase(getHomeChart.rejected, (state, action) => {
                state.homeChart.loading = false;
                state.homeChart.error = action.payload;
            })

            .addCase(getNewReleaseChart.pending, (state) => {
                state.newReleaseChart.loading = true;
                state.newReleaseChart.error = null;
            })
            .addCase(getNewReleaseChart.fulfilled, (state, action) => {
                state.newReleaseChart.data = action.payload;
                state.newReleaseChart.loading = false;
            })
            .addCase(getNewReleaseChart.rejected, (state, action) => {
                state.newReleaseChart.loading = false;
                state.newReleaseChart.error = action.payload;
            })

            .addCase(getDetailSong.pending, (state) => {
                state.linkSong.loading = true;
                state.linkSong.error = null;
            })
            .addCase(getDetailSong.fulfilled, (state, action) => {
                state.linkSong.loading = false;
                state.linkSong.data = action.payload;

                if (action.payload && state.currentSong.info) {
                    state.currentSong.info = {
                        ...state.currentSong.info,
                        ...action.payload
                    };
                }
            })
            .addCase(getDetailSong.rejected, (state, action) => {
                state.linkSong.loading = false;
                state.linkSong.error = action.payload;
            })

            // 🔍 THÊM: Search cases
            .addCase(searchMusic.pending, (state) => {
                console.log('🔄 Search pending...');
                state.search.loading = true;
                state.search.error = null;
            })
            .addCase(searchMusic.fulfilled, (state, action) => {
                console.log('✅ Search successful:', action.payload);
                state.search.loading = false;
                state.search.data = {
                    songs: action.payload.songs || [],
                    artists: action.payload.artists || [],
                    playlists: action.payload.playlists || []
                };
                state.search.query = action.payload.query;
                state.search.hasSearched = true;
            })
            .addCase(searchMusic.rejected, (state, action) => {
                console.log('❌ Search failed:', action.payload);
                state.search.loading = false;
                state.search.error = action.payload;
                state.search.hasSearched = true;
            })
    }
})

// Export actions
export const {
    setCurrentSong,
    clearCurrentSong,
    togglePlayPause,
    setInfoSong,
    clearSearchResults,
    setSearchQuery
} = musicSlice.actions;

export default musicSlice.reducer;