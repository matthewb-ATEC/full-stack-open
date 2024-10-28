import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = () => {
  const [filter, setFilter] = useState(undefined)
  const { loading: allBooksLoading, data: allBooksData } = useQuery(ALL_BOOKS)
  const {
    loading: filteredBooksLoading,
    data: filteredBooksData,
    refetch: filteredBooksRefetch,
  } = useQuery(ALL_BOOKS, { variables: { genre: filter } })

  if (allBooksLoading || filteredBooksLoading) return <div>Loading...</div>

  const allBooks = allBooksData.allBooks
  const filteredBooks = filteredBooksData.allBooks
  const allGenres = [...new Set(allBooks.flatMap((book) => book.genres))]

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
        <button
          key={genre}
          onClick={() => {
            setFilter(genre)
            filteredBooksRefetch({ genre: genre })
          }}
        >
          {genre}
        </button>
      ))}
      <button
        onClick={() => {
          setFilter(undefined)
          filteredBooksRefetch({ genre: undefined })
        }}
      >
        all genres
      </button>
    </div>
  )
}

export default Books
