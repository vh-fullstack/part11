import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import FindBookPage from './components/Pages/FindBookPage'
import AddBookPage from './components/Pages/AddBookPage'
import LoginPage from './components/Pages/LoginPage'
import { useApolloClient, useSubscription } from '@apollo/client/react'
import UpdateBirthYear from './components/UpdateBirthYear'
import RecommendPage from './components/Pages/RecommendPage'
import { GET_BOOKS, BOOK_ADDED } from './components/queries'
import { Footer } from './components/Footer'

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same book twice
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allPersons: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      updateCache(client.cache, { query: GET_BOOKS }, addedBook)
    }
  })

  const client = useApolloClient()

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <nav>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('find')}>find book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={() => setPage('updateBirthyear')}>update author</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </nav>

      {page === 'authors' && <Authors />}
      {page === 'books' && <Books />}

      {token && page === 'add' && <AddBookPage />}
      {token && page === 'find' && <FindBookPage />}
      {token && page === 'updateBirthyear' && <UpdateBirthYear />}
      {token && page === 'recommend' && <RecommendPage />}
      {!token && page === 'login' && <LoginPage setToken={setToken} />}
      <Footer />
    </div>
  )
}

export default App