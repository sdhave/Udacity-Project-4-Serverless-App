import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { db } from '../../helpers/db'

// import { deleteTodo } from '../../businessLogic/todos'
// import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Get post id from Parameters
        const todoId = event.pathParameters.todoId
        // Parameters for adding item to db
        const params = {
            TableName: process.env.TODOS_TABLE,
            Key: todoId
        }
        // Adding the new item to the database
        const deletedTodo = await db.delete(params).promise()
        // Response body for success
        return {
              statusCode: 200,
              body: JSON.stringify({
                message: "Successfully Deleted Todo",
                data: deletedTodo
              })
          }
    } catch (e) {
        console.error(e)
        // Response body for failed
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: "Failed to Delete Todo",
            errorMsg: e.message,
            errorStack: e.stack
          })
        }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
