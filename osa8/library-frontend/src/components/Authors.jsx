import { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const UPDATE_AUTHOR = gql`
  mutation updateAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
        name
        born
      }
  }
`

const Authors = (props) => {
  if (!props.show) {
    return null
  }

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ updateAuthor ] = useMutation(UPDATE_AUTHOR)

  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 2000
  })

  useEffect(() => {
    result.data && setName(result.data.allAuthors[0].name)
  }, [result])

  if (result.loading)  {
    return <div>loading...</div>
  }
  
  const authors = result.data.allAuthors

  const submit = async (event) => {
    event.preventDefault()

    console.log('updating author...')
    const response = await updateAuthor({ variables: { name, setBornTo: parseInt(born) } })
    console.log(response)

    setName('')
    setBorn('')
  }

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
          {authors.map((author) => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token &&
        <div>
          <h3>set birthyear</h3>
          <form onSubmit={submit}>
            <div>
              name
              <select
                value={name}
                onChange={({ target }) => setName(target.value)}
              >
                {authors.map((author) => (
                  <option key={author.name} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              born
              <input
                type='number'
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type='submit'>update author</button>
          </form>
        </div>
      }
    </div>
  )
}

export default Authors
