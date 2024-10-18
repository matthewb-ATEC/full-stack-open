import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdoteService'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      const id = action.payload.id
      const updatedAnecdote = action.payload.updatedAnecdote
      return state.map((anecdote) => anecdote.id === id ? updatedAnecdote : anecdote)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { appendAnecdote, setAnecdotes, updateAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (anecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const increaseVotes = (id) => {
  return async (dispatch, getState) => {
    const anecdotes = getState().anecdotes
    const anecdote = anecdotes.find((anecdote) => anecdote.id === id)
    const updatedAnecdote = {
      ...anecdote, 
      votes: anecdote.votes + 1
    }
    const response = await anecdoteService.update(id, updatedAnecdote)
    dispatch(updateAnecdote({id: id, updatedAnecdote: response}))
  }
}

export default anecdoteSlice.reducer