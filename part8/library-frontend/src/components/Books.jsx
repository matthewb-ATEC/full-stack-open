import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = () => {
  const result = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState(null)

  if (result.loading) return <div>Loading...</div>

  const books = result.data.allBooks
  const allGenres = [...new Set(books.flatMap((book) => book.genres))]
  const filteredBooks = filter
    ? books.filter((book) => book.genres.includes(filter))
    : books

  return (
    <div>
      <h2>books</h2>
      {filter ? (
        <div>
          in genre <strong>{filter}</strong>
        </div>
      ) : (
        <div>all books</div>
      )}
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
      {allGenres.map((genre) => (
        <button key={genre} onClick={() => setFilter(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setFilter(null)}>all genres</button>
    </div>
  )
}

export default Books
