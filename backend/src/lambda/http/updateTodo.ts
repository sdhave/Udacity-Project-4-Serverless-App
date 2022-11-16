import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { db } from '../../helpers/db'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

// import { updateTodo } from '../../businessLogic/todos'
// import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
// import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
        try {
            // Parameters for adding item to db
            const params = {
                TableName: process.env.TODOS_TABLE,
                Key: todoId,
                Item: { todoId, ...updatedTodo }
            }
            // Adding the new item to the database
            await db.put(params).promise()
            // Response body for success
            return {
              statusCode: 200,
              body: JSON.stringify({
                message: "Successfully Updated Todo",
                data: updatedTodo
              })
            }
        } catch (e) {
            console.error(e)
            // Response body for failed
            return {
              statusCode: 500,
              body: JSON.stringify({
                message: "Failed to Update Todo",
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
