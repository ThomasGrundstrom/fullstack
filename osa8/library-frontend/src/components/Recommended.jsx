import { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'

const RECOMMENDED_BOOKS = gql`
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

const Recommended = (props) => {
  if (!props.show) {
    return null
  }

  const [books, setBooks] = useState([])

  const result = useQuery(RECOMMENDED_BOOKS, {
    variables: { genre: props.favoriteGenre },
    errorPolicy: 'all',
    skip: !props.favoriteGenre
  })

  useEffect(() => {
    result.data && setBooks(result.data.allBooks)
  }, [result.data])

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h1>Recommendations</h1>
      <div>
        <p>books in your favorite genre <b>{props.favoriteGenre}</b></p>
      </div>
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
    </div>
  )
}

export default Recommended