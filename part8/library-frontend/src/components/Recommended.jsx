import { useLazyQuery, useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommended = () => {
  const { loading: loadingUser, data: userData } = useQuery(ME)

  const [loadBooks, { called, loading: loadingBooks, data: booksData }] =
    useLazyQuery(ALL_BOOKS)

  if (loadingUser) return <div>Loading...</div>

  const { favoriteGenre } = userData.me
  if (!called) {
    loadBooks({ variables: { genre: favoriteGenre } })
  }

  if (loadingUser || (called && loadingBooks)) return <div>Loading...</div>

  const filteredBooks = booksData?.allBooks || []

  return (
    <div>
      <h2>recommended</h2>

      <div>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
