import { ApolloServer } from 'apollo-server'
import { schemas as typeDefs } from './graphql/schema.js'
import { resolvers } from './graphql/resolvers.js'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import dotenv from 'dotenv'

dotenv.config().parsed

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
})

// The `listen` method launches a web server.
server.listen(process.env.PORT || 4000).then(async ({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
