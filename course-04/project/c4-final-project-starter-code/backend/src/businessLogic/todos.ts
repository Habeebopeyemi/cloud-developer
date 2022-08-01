import { TodoAccess } from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { parseUserId } from '../auth/utils'
import { TodoUpdate } from '../models/TodoUpdate'

// creating TodoAccess new instance from the constructor
const todoAccess = new TodoAccess()

// TODO: Implement businessLogic
export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  return todoAccess.getAllToDo(userId)
}

export function createToDo(
  createToDoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {
  const userId = parseUserId(jwtToken)
  const toDoId = uuid()
  const attachmentS3Bucket = process.env.ATTACHMENT_S3_BUCKET

  return todoAccess.createToDo({
    userId: userId,
    todoId: toDoId,
    attachmentUrl: `https://${attachmentS3Bucket}.s3.amazonaws.com/${toDoId}`,
    createdAt: new Date().getTime().toString(),
    done: false,
    ...createToDoRequest
  })
}

export function updateToDo(
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  jwtToken: string
): Promise<TodoUpdate> {
  const userId = parseUserId(jwtToken)
  return todoAccess.updateToDo(updateTodoRequest, todoId, userId)
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken)
  return todoAccess.deleteToDo(todoId, userId)
}

export function generateUploadUrl(todoId: string): Promise<string> {
  return todoAccess.generateUploadUrl(todoId)
}
