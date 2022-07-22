import { PrismaClient } from '@prisma/client'
import { DateTimeScalar } from 'graphql-date-scalars'
import { ApolloError } from 'apollo-server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const resolvers = {
  DateTime: DateTimeScalar,

  Query: {
    articles: () => {
      return prisma.articles.findMany()
    },
    users: () => {
      return prisma.users.findMany()
    },
  },

  Mutation: {
    createArticle: async (_, { title, markdown_detail }) => {
      await prisma.articles.create({
        data: {
          title: title,
          author_id: '62d9a84ef9c58885dc892734',
          markdown_detail: markdown_detail,
        },
      })
      return {
        title: title,
        markdown_detail: markdown_detail,
      }
    },
    createUser: async (_, { name, email, first_name, last_name, password }) => {
      //See of user already exists
      const user = await prisma.users.findUnique({
        where: {
          email: email,
        },
      })

      // Throw if user already exists
      if (user) {
        throw new ApolloError('A user is already exists', 'USER_ALREADY_EXISTS')
      }

      // Encrypt password
      const encrypted = await bcrypt.hash(password, 10)

      await prisma.users.create({
        data: {
          name: name,
          email: email,
          first_name,
          last_name,
          password: encrypted,
          token: '',
        },
      })

      const newUser = await prisma.users.findUnique({
        where: {
          email: email,
        },
      })

      // create jwt token
      const jwtToken = jwt.sign({ userId: newUser.id, email, name }, 'YOUR_MOM', { expiresIn: '2h' })

      // update user data with jwt token
      await prisma.users.update({
        where: {
          email: email,
        },
        data: {
          token: jwtToken,
        },
      })

      return {
        id: newUser.id,
      }
    },
    login: async (_, { email, password }) => {
      // See if user exists with email
      const user = await prisma.users.findUnique({
        where: {
          email: email,
        },
      })

      // Check if the entered password equals the encrypted password
      if (user && bcrypt.compare(password, user.password)) {
        // Create n NEW token
        const jwtToken = jwt.sign({ userId: user.id, email, name: user.name }, 'YOUR_MOM', { expiresIn: '2h' })

        // Attach token to user model
        await prisma.users.update({
          where: {
            email: email,
          },
          data: {
            token: jwtToken,
          },
        })

        return {
          id: user.id,
          user: {
            email: user.email,
            token: user.token
          }
        }
      } else {
        // If user doesn't exist, return error
        throw new ApolloError('Incorrect password', 'INCORRECT_PASSWORD')
      }
    },
  },
}
