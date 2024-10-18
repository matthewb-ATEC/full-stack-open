import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    increaseVotes(state, action) {
      const anecdote = state.find(anecdote => anecdote.id === action.payload)
      if (anecdote) anecdote.votes += 1
      state.sort((a, b) => b.votes - a.votes)
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})


export const { increaseVotes, createAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer