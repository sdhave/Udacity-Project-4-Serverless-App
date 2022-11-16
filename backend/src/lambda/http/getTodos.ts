import 'source-map-support/register'

import { APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { db } from '../../helpers/db'

// import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
// import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (): Promise<APIGatewayProxyResult> => {
    // Write your code here
    try {
        // Parameters for geting items from db
        const params = {
            TableName: process.env.TODOS_TABLE
        }
        // Adding the new item to the database
        const { Items } = await db.scan(params).promise()
        // Response body for success
        return {
              statusCode: 200,
              body: JSON.stringify({
                message: "Successfully Retrieved Todos",
                data: Items
              })
            }
    } catch (e) {
        console.error(e)
        // Response body for failed
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: "Failed to Retrive Todos",
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
