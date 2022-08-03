import { TodoAccess } from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { parseUserId } from '../auth/utils'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'

// creating TodoAccess new instance from the constructor
const todoAccess = new TodoAccess()
const logger = createLogger('Todos')

// TODO: Implement businessLogic
export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  // creating a log
  logger.info('getting todo list for user with ID:', userId)
  return todoAccess.getAllToDo(userId)
}

export function createToDo(
  createToDoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {
  const userId = parseUserId(jwtToken)
  const toDoId = uuid()
  const attachmentS3Bucket = process.env.ATTACHMENT_S3_BUCKET
  // creating a log
  logger.info('creating todo list for user with ID:', userId)
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
  // creating a log
  logger.info('updating todo list for user with ID:', userId)
  return todoAccess.updateToDo(updateTodoRequest, todoId, userId)
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken)
  // creating a log
  logger.info('deleting todo list for user with ID:', userId)
  return todoAccess.deleteToDo(todoId, userId)
}

export function generateUploadUrl(todoId: string): Promise<string> {
  // creating a log
  logger.info('generating a signed url')
  return todoAccess.generateUploadUrl(todoId)
}
