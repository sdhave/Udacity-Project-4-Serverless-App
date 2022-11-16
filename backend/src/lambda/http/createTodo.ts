import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import uuid from 'uuid'

import { db } from '../../helpers/db'
// import { getUserId } from '../utils';
// import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
        try {
            // Get post id from Parameters
            const todoId = uuid.v4()
            // Parameters for adding item to db
            const params = {
                TableName: process.env.TODOS_TABLE,
                Key: todoId,
                Item: { todoId, ...newTodo }
            }
            // Adding the new item to the database
            await db.put(params).promise()
            // Response body for success
            return {
              statusCode: 200,
              body: JSON.stringify({
                message: "Successfully Added Todo",
                data: newTodo
              })
            }

        } catch (e) {
            console.error(e)
            // Response body for failed
            return {
              statusCode: 500,
              body: JSON.stringify({
                message: "Failed to Add Todo",
                errorMsg: e.message,
                errorStack: e.stack
              })
            }
        }
      }
)

handler.use(
  cors({
    credentials: true
  })
)
