import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    },
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('libraryApp-user-token', token)
      navigate('/')
    }
  }, [result.data])

  const handleSubmit = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        username{' '}
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{' '}
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default Login
