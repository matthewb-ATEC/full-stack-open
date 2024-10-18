import { increaseVotes } from '../reducers/anecdoteReducer'
import { notifyWithTimeout } from '../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'

const Anecdotes = () => {
    const anecdotes = useSelector(state => state.anecdotes.filter((anecdote) => anecdote.content.includes(state.filter)))
    const dispatch = useDispatch()

    const vote = (anecdote) => {
        dispatch(increaseVotes(anecdote.id))
        dispatch(notifyWithTimeout(`you voted '${anecdote.content}'`, 5))
    }

    return (
        <div>
        {anecdotes
            .sort((a, b) => b.votes - a.votes)
            .map(anecdote =>
            <div key={anecdote.id}>
                <div>
                {anecdote.content}
                </div>
                <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote)}>vote</button>
                </div>
            </div>
        )}
        </div>
    )
}

export default Anecdotes