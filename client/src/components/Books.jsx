import BookList from './BookList'
import { GET_BOOKS } from './queries'
import { useQuery } from '@apollo/client/react'
import DisplayGenreButtons from './DisplayGenres'
import { useState } from 'react'

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState(null)

  // Query 1: Always fetches all books to get the genre list and for the default view
  const { loading: loadingAllBooks, error: errorAllBooks, data: dataAllBooks } = useQuery(GET_BOOKS)

  // Query 2: Fetches books for a SPECIFIC genre.
  // It is SKIPPED if no genre is selected.
  const { loading: loadingGenreBooks, error: errorGenreBooks, data: genreBooks } = useQuery(GET_BOOKS, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre,
  })

  // Decide which list of books to render.
  // If the filtered query (`genreBooks`) has returned data, use that.
  // Otherwise, use the data from the initial query (`dataAllBooks`).
  const booksToDisplay = genreBooks?.allBooks || dataAllBooks?.allBooks

  // Handle all loading and error states
  if (loadingAllBooks || loadingGenreBooks) return <div>loading...</div>
  if (errorAllBooks) return <div>Error loading books: {errorAllBooks.message}</div>
  if (errorGenreBooks) return <div>Error loading genre books: {errorGenreBooks.message}</div>

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre === 'All Genres' ? null : genre)
  }

  return (
    <div>
      <h2>books</h2>
      <BookList books={booksToDisplay} />
      <DisplayGenreButtons onClick={handleGenreSelect} />
      <p>genre selected: <strong>{selectedGenre || 'All Genres'}</strong></p>
    </div>
  )
}

export default Books