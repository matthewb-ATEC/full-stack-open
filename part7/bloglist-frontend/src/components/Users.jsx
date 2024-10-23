import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUsers } from '../reducers/usersReducer'
import usersService from '../services/users'

const Users = () => {
  const dispatch = useDispatch()
  const users = useSelector((state) => state.users)

  useEffect(() => {
    const getUsers = async () => {
      const users = await usersService.get()
      console.log(users)
      dispatch(setUsers(users))
    }
    getUsers()
  }, [])

  if (!users) return <div>loading...</div>

  return (
    <table>
      <thead>
        <tr>
          <th />
          <th>
            <strong>blogs created</strong>
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Users
