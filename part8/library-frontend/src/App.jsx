import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useApolloClient } from '@apollo/client'
import Recommended from './components/Recommended'

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const navigate = useNavigate()

  useEffect(() => {
    const existingToken = localStorage.getItem('libraryApp-user-token')
    if (existingToken) setToken(existingToken)
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    navigate('/')
  }

  return (
    <div>
      <div>
        <Link to="/authors">
          <button>authors</button>
        </Link>{' '}
        <Link to="/books">
          <button>books</button>
        </Link>{' '}
        {token ? (
          <>
            <Link to="/add">
              <button>add book</button>
            </Link>{' '}
            <Link to="/recommended">
              <button>recommended</button>
            </Link>{' '}
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <Link to="/login">
            <button>login</button>
          </Link>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/add" element={<NewBook />} />
        <Route path="/recommended" element={<Recommended />} />
      </Routes>
    </div>
  )
}

export default App
