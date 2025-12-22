import { useState } from 'react'

const FindBook = ({ onSearch }) => {
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    onSearch({ author, genre })
    setAuthor('')
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          search for:
        </div>
        <div>
          <label>
            author: <input value={author} onChange={(e) => setAuthor(e.target.value)} name="author" />
          </label>
        </div>
        <div>
          <label>
            genre: <input value={genre} onChange={(e) => setGenre(e.target.value)} name="genre" />
          </label>
        </div>
        <button type='submit'>find this book!</button>
      </form>

    </div>
  )
}

export default FindBook