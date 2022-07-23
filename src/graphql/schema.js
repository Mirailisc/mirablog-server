import { gql } from 'apollo-server'

export const schemas = gql`
  scalar DateTime

  type Article {
    id: String
    title: String
    author: User
    author_id: String
    markdown_detail: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type User {
    id: String
    name: String
    email: String
    first_name: String!
    last_name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    password: String
    token: String!
    blogs: [Article!]!
  }

  type AuthData {
    user: User
    token: String!
  }

  type Query {
    articles: [Article]
    users: [User]
  }

  type Mutation {
    createArticle(title: String, markdown_detail: String!, author_id: String): Article
    createUser(name: String, email: String, first_name: String, last_name: String, password: String): User
    login(email: String, password: String!): AuthData
  }
`
