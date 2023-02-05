import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts')
  return data
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags')
  return data
})

export const fetchRemovePosts = createAsyncThunk(
  'posts/fetchRemovePosts',
  async id => await axios.delete(`/posts/${id}`)
)

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    // Получение статей
    [fetchPosts.pending]: state => {
      state.posts.items = []
      state.posts.status = 'loading'
    },
    [fetchPosts.fulfilled]: (state, actions) => {
      state.posts.items = actions.payload
      state.posts.status = 'loaded'
    },
    [fetchPosts.rejected]: state => {
      state.posts.items = []
      state.posts.status = 'error'
    },
    // Получение тегов
    [fetchTags.pending]: state => {
      state.tags.items = []
      state.tags.status = 'loading'
    },
    [fetchTags.fulfilled]: (state, actions) => {
      state.tags.items = actions.payload
      state.tags.status = 'loaded'
    },
    [fetchTags.rejected]: state => {
      state.tags.items = []
      state.tags.status = 'error'
    },
    // Удаление статьи
    [fetchRemovePosts.pending]: (state, actions) => {
      state.posts.items = state.posts.items.filter(
        post => post._id !== actions.meta.arg
      )
    },
  },
})

export const postsReducer = postsSlice.reducer
