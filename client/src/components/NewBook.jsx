import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { ADD_BOOK, ALL_AUTHORS, GET_BOOKS, ALL_GENRES } from './queries'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  useQuery(ALL_GENRES)

  const [addNewBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    update: (cache, response) => {
      const newBook = response.data.addBook

      try {
        cache.updateQuery({ query: GET_BOOKS }, ({ allBooks }) => {
          return {
            allBooks: allBooks.concat(newBook),
          }
        })
      } catch (error) {
        // console.log('GET_BOOKS query not found in cache, skipping update')
      }

      // Update the ALL_GENRES query
      try {
        cache.updateQuery({ query: ALL_GENRES }, ({ allGenres }) => {
          const genresToAdd = newBook.genres.filter((genre) =>
            !allGenres.includes(genre))

          if (genresToAdd.length === 0) {
            return { allGenres }
          }

          return {
            allGenres: allGenres.concat(genresToAdd)
          }
        })
      } catch (error) {
        console.log('ALL_GENRES query not found in cache, skipping update')
      }
    },
    /*onCompleted: (data) => console.log('data added', data),*/
    // onError: (error) => console.log('adding book error', error),
  })

  const submit = async (event) => {
    event.preventDefault()

    const publishedInt = parseInt(published)

    addNewBook({ variables: { title, author, published: publishedInt, genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook