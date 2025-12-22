import { useQuery } from '@apollo/client/react'
import { ALL_AUTHORS } from './queries'
import Author from './Author'

const Authors = () => {
  const { loading, error, data } = useQuery(ALL_AUTHORS)

  if (loading) return <div>loading...</div>
  if (error) return <p>Error :( {error.message}</p>

  return (
    <div>
      <h2>authors</h2>
      <Author authors={data.allAuthors} />
    </div>
  )
}

export default Authors