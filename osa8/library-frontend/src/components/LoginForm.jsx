import { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import { jwtDecode } from 'jwt-decode'

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

const LoginForm = ({ setToken, show, setPage, setFavoriteGenre }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      const favoriteGenre = jwtDecode(token).favoriteGenre
      setFavoriteGenre(favoriteGenre)
    }
  }, [result.data])
  const submit = async (event) => {
    event.preventDefault()

    const response = await login({ variables: { username, password } })
    console.log(response)
    response.data
      ? setPage('authors')
      : setError('Login unsuccessful')
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => {
              setUsername(target.value)
              setError(null)
            }}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => {
              setPassword(target.value)
              setError(null)
            }}
          />
        </div>
        <button type='submit'>login</button>
      </form>
      {error && (
        <div>
          {error}
        </div>
      )}
    </div>
  )
}

export default LoginForm