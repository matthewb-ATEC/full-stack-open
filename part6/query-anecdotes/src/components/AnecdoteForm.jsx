import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../contexts/NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote, 
    onSuccess: (createAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
      dispatchNotification({
        type: 'SET_NOTIFICATION',
        payload: `Anecdote ${createAnecdote.content} created!`,
      });
      setTimeout(() => {
        dispatchNotification({ 
          type: 'CLEAR_NOTIFICATION',
          payload: '' });
      }, 5000);
    },
    onError: () => {
      dispatchNotification({
        type: 'SET_NOTIFICATION',
        payload: `too short anecdote, must have length 5 or more`,
      });
      setTimeout(() => {
        dispatchNotification({ 
          type: 'CLEAR_NOTIFICATION',
          payload: '' });
      }, 5000);
    }
  })

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content, votes: 0})
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
