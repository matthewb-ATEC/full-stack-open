import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import Select from 'react-select'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [bornYear, setBornYear] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!selectedAuthor) return
    editAuthor({
      variables: { name: selectedAuthor.value, bornYear: parseInt(bornYear) },
    })
    setSelectedAuthor(null)
    setBornYear('')
  }

  if (!props.show) {
    return null
  }

  if (result.loading) return <div>Loading...</div>

  const authors = result.data.allAuthors
  const options = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }))

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <Select
            value={selectedAuthor}
            options={options}
            onChange={setSelectedAuthor}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={bornYear}
            onChange={(e) => setBornYear(e.target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
