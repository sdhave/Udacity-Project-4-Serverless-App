import * as AWS from 'aws-sdk';
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),    
        private readonly indextodos = process.env.TODOS_CREATED_AT_INDEX,    
        private readonly Todos_Table = process.env.TODOS_TABLE,
        ){}

    // CREATE TODO
    async createToDo(todoItem: TodoItem): Promise<TodoItem> {
        const params = {
            TableName: this.Todos_Table,
            Item: todoItem,
        };

        await this.docClient.put(params).promise();

        return todoItem as TodoItem;
    }

    //get all todos by userId
    async  getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.Todos_Table,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        
        return result.Items  as TodoItem[]
    }

    //update todos
    async  updateTodos(userId: string, todoId: string, todoUpdate: UpdateTodoRequest): Promise<UpdateTodoRequest> {
        await this.docClient.update({
            TableName: this.Todos_Table,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            }

        }).promise()
        return todoUpdate
    }

    //datalogic to delete todos
    async deleteToDo(todoId: string, userId: string): Promise<string> {
        console.log("Deleting todo");

        const params = {
            TableName: this.Todos_Table,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        };

        const result = await this.docClient.delete(params).promise();
        console.log(result);

        return "" as string;
    }

    //add
    async addAttachment(todo: TodoItem): Promise<TodoItem> {
        const result = await this.docClient.update({
            TableName: this.Todos_Table,
            Key: {
                userId: todo.userId,
                todoId: todo.todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': todo.attachmentUrl
            }
        }).promise()
        return result.Attributes as TodoItem
    }

    //get all todos by todoID
    async getAllTodoById(todoId: string):Promise<TodoItem>  {
    const output= await this.docClient.query({
            TableName: this.Todos_Table,
            IndexName: this.indextodos,
            KeyConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues: {
                ':todoId': todoId
            }
        }).promise()
        const item = output.Items
        const result= (item.length !==0)?  item[0] as TodoItem :null
        return result;
    }
}

//connect to DynamoDBClient
function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
}