import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest }from '../requests/UpdateTodoRequest';
import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataAccess/todosAcess';
import { parseUserId } from "../auth/utils";

const todosAccess = new TodosAccess();
const uuidv4 = require('uuid/v4');

export function getAllTodosByUserId(userId:string):Promise<TodoItem[]>{
    return todosAccess.getAllTodosByUserId(userId)
}

export function createToDo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const userId = parseUserId(jwtToken);
    const todoId =  uuidv4();
    const s3BucketName = process.env.S3_BUCKET_NAME;
    
    return todosAccess.createToDo({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export async function updateTodos(userId: string, todoId: string, todoUpdate: UpdateTodoRequest): Promise<UpdateTodoRequest> {
    return await todosAccess.updateTodos(todoId, userId,todoUpdate);
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return todosAccess.deleteToDo(todoId, userId);
}

export async function getAllTodoById(todoId: string) {
    return await todosAccess.getAllTodoById(todoId);
}

export async function addAttachment(todo: TodoItem): Promise<TodoItem> {
    return await todosAccess.addAttachment(todo);
}