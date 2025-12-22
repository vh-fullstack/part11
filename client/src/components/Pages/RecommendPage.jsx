import { useQuery } from '@apollo/client/react'
import { ME, GET_BOOKS } from '../queries'
import BookList from '../BookList'

const RecommendPage = () => {
  // First query: get the current user's info
  const { loading: meLoading, error: meError, data: meData } = useQuery(ME)
  // Personal reminder: onCompleted may not fire if data was already available in cache!

  // will be undefined if data not yet loaded
  const favoriteGenre = meData?.me?.favoriteGenre

  // Second query: get books based on the favorite genre
  // It will be skipped until favoriteGenre has a value
  const { data: booksData, loading: booksLoading, error: booksError } = useQuery(GET_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre, // Crucial: Don't run this query until we have the genre
  })

  // handle primary loading/error states
  if (meLoading) return <div>loading info</div>
  if (meError) return <div>`error occured ${meError.message}`</div>

  // handle specific state where user is loaded but has no favorite genre
  if (!favoriteGenre) {
    return (
      <div>
        <h2>Recommendations</h2>
        <p>To get recommendations, please set a favorite genre in your profile.</p>
      </div>
    )
  }

  // From here on in, we can safely assume `favoriteGenre` is a string
  return (
    <div>
      <h2>recommendations</h2>
      <p>
        {(meData.me.username).toUpperCase()}&apos;s favorite genre: <strong>{favoriteGenre}</strong>
      </p>


      {/* Handle the loading/error states for the SECOND query */}
      {booksLoading && <div>Loading recommended books...</div>}
      {booksError && <div>Error loading books: {booksError.message}</div>}

      {/*
        Render the table only when book data is available.
        Using optional chaining `?.` is an extra layer of safety. It prevents an
        error if `booksData` is defined but `allBooks` is missing for some reason.
      */}
      {booksData && <BookList books={booksData.allBooks} />}
    </div>
  )
}

export default RecommendPage