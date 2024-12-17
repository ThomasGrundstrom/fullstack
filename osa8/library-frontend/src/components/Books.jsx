import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

const ALL_BOOKS = gql`
  query getBooksByGenre($genre: String!) {
    allBooks(genre: $genre) {
      title
      published
      genres
      author {
        name
      }
    }
  }
`

const Books = (props) => {
  if (!props.show) {
    return null
  }

  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')

  const result = useQuery(ALL_BOOKS, {
    pollInterval: 2000,
    errorPolicy: 'all',
    variables: { genre: selectedGenre }
  })

  useEffect(() => {
    if (result.data) {
      const uniqueGenres = new Set(genres)
      result.data.allBooks.forEach((book) => {
        book.genres.forEach((genre) => uniqueGenres.add(genre))
      })
      setGenres([...uniqueGenres])
    }
  }, [result.data])

  if (result.loading)  {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>
      {selectedGenre !== '' && (
        <div>
          in genre <b>{selectedGenre}</b>
        </div>
      )}

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => {
            return (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            )
            })}
        </tbody>
      </table>
      <button onClick={() => setSelectedGenre('')}>
          All genres
      </button>
      {genres.map((genre, index) => (
        <button onClick={() => setSelectedGenre(genre)} key={index}>
          {genre}
        </button>
      ))}
    </div>
  )
}

export default Books
