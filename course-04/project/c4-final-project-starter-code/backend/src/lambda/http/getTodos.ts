import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAllToDo } from '../../businessLogic/todos'
// import { getUserId } from '../utils'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const authorization = event.headers.Authorization
    const bearerToken = authorization.split(' ')
    let jwtToken = bearerToken[1]
    const todos = await getAllToDo(jwtToken)

    return {
      statusCode: 200,
      body: JSON.stringify({
        "items": todos
      })
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
