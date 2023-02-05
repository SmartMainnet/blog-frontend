import { configureStore } from '@reduxjs/toolkit'
import { postsReducer } from './slices/posts.js'
import { authReducer } from './slices/auth.js'

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
  },
})

export default store
