import { AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken'

export const tokenVerify = (context) => {
  // context = { ...headers }
  const authHeader = context.req.headers.authorization
  if (authHeader) {
    // Bearer ....
    const token = authHeader.split(' ')[1]
    if (token) {
      try {
        const user = jwt.verify(token, 'YOUR_MOM')
        return user
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token')
      }
    } else {
      throw new AuthenticationError('Authentication token must be provided with Bearer')
    }
  } else {
    throw new AuthenticationError('Authentication header most be provided')
  }
}
