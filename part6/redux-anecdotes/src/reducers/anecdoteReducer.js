import { createSlice } from '@reduxjs/toolkit'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

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
      const anecdote = action.payload
      state.push(asObject(anecdote))
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