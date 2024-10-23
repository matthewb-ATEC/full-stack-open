import { createSlice } from '@reduxjs/toolkit'

const generateId = () => {
  return Math.floor(Math.random(1000) * 1000)
}

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    createBlog(state, action) {
      return [...state, { ...action.payload, id: generateId() }]
    },
    updateBlog(state, action) {
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog
      )
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload.id)
    },
  },
})

export const { setBlogs, createBlog, updateBlog, removeBlog } =
  blogsSlice.actions
export default blogsSlice.reducer
