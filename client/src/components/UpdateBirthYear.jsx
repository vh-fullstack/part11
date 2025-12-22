import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { ALL_AUTHORS, UPDATE_BIRTHYEAR } from './queries'

const UpdateBirthYear = () => {
  const [name, setName] = useState('')
  const [birthyear, setBirthyear] = useState('')

  const [updateBirthyear] = useMutation(UPDATE_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    // onCompleted: (data) => null,
    // onError: (error) => console.log('error while updating birth year:', error.message)
  })

  const result = useQuery(ALL_AUTHORS)

  useEffect(() => {
    if (result.data && result.data.allAuthors.length > 0) {
      setName(result.data.allAuthors[0].name)
    }
  }, [result.data])

  const authorNames = result.data.allAuthors.map((a) => a.name)

  const submit = async (event) => {
    event.preventDefault()

    const birthyearInt = parseInt(birthyear)
    updateBirthyear({ variables: { name, newBirthYear: birthyearInt } })
    setBirthyear('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="author-select">Name </label>
          <select value={name} onChange={(event) => setName(event.target.value)}>
            {authorNames.map((authorName) => (
              <option key={authorName} value={authorName}>
                {authorName}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            value={birthyear}
            onChange={({ target }) => setBirthyear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default UpdateBirthYear