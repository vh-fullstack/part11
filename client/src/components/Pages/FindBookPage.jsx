import { useLazyQuery } from '@apollo/client/react'
import { GET_BOOKS } from '../queries' // Assuming a GraphQL query
import FindBook from '../FindBook'
import FilteredBookList from '../FilteredBookList'

const FindBookPage = () => {
  const [findBooks, { loading, error, data }] = useLazyQuery(GET_BOOKS, {
    // onCompleted: (data) => console.log('succesful find: ', data),
    // onError: (error) => console.log('error occured: ', error)
  })

  const handleSearch = ({ author, genre }) => {
    findBooks({ variables: { author, genre } })
  }

  const books = data ? data.allBooks : null

  return (
    <div>
      <h2>Find Books</h2>
      {/* Pass the handler function down as a prop */}
      <FindBook onSearch={handleSearch} />

      <hr />

      {/* Pass the results down to the display component */}
      <FilteredBookList books={books} loading={loading} error={error} />
    </div>
  )
}

export default FindBookPage