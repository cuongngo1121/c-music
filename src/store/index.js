
// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import musicSlice from './reducer' // Import the slice

const store = configureStore({
    reducer: {
        music: musicSlice // Use the slice reducer and give it a key
    }
})

export * from './thunk'
export default store