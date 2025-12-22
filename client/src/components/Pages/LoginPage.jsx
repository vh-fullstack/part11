import { useState, useEffect } from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client/react'

const LoginPage = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => console.error(error)
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data])

  const submit = (e) => {
    e.preventDefault()

    login({ variables: { username, password } })

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>
            username: <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            password: <input value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginPage