const FilteredBookList = ({ books, loading, error }) => {

  if (loading) return <div>loading books...</div>

  if (error) return <div>Error: {error.message}</div>

  // display nothing when no search made
  if (!books) return ''

  // display if search returns a null array
  if (books.length === 0) return <div>No books found with these criteria.</div>


  return (
    <div>
      <h3>Results</h3>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
            <th>Genres</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FilteredBookList