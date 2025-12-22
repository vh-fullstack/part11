import { gql } from '@apollo/client'

// fragment
const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    published
    author {
      name
    }
    genres
  }
`

export const AUTHOR_COUNT = gql`
  query {
    authorCount
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const GET_BOOKS = gql`
  query AllBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      ...BookDetails
    }    
  }
  ${BOOK_DETAILS}
`

export const ALL_GENRES = gql`
  query {
    allGenres 
  }
`

export const ME = gql`
  query {
    me {
      username,
      favoriteGenre
    }
  }
`

export const ADD_BOOK = gql`
  mutation addNewBook(
    $title: String!,
    $author: String!,
    $published: Int!,
    $genres: [String!]!
  ) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      published
      author {
        name
        born
      }
      genres  
    }
  }
`

export const UPDATE_BIRTHYEAR = gql`
  mutation ($name: String!, $newBirthYear: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $newBirthYear
    ) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value  
    }
  }
`

export const CREATE_USER = gql`
  mutation ($username: String!, $favoriteGenre: String) {
    createUser(username: $username, favoriteGenre: $favoriteGenre) {
      username
      favoriteGenre
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`