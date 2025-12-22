import { useQuery } from '@apollo/client/react'
import { ALL_GENRES } from './queries'

const DisplayGenreButtons = ({ onClick }) => {
  const { data, loading, error } = useQuery(ALL_GENRES)

  const genres = data?.allGenres || []

  if (loading) return <div>loading genres</div>
  if (error) return <div>error occured! `${error.message}</div>
  if (!genres || genres.length === 0) return <div>loading genres...</div>

  return (
    <div>
      {genres.map((genre) => {
        return <button key={genre} onClick={() => onClick(genre)}>{genre}</button>
      })}
      <button onClick={() => onClick(null)}>show all</button>
    </div>
  )
}

export default DisplayGenreButtons