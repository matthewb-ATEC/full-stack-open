import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author {
        name
      }
      id
      genres
    }
  }
`

export const ADD_BOOK = gql`
  mutation createBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      title
      published
      author
      id
      genres
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $bornYear: Int!) {
    editAuthor(name: $name, setBornTo: $bornYear) {
      name
      born
      id
    }
  }
`
