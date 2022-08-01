import * as AWS from 'aws-sdk'
import { Types } from 'aws-sdk/clients/s3'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

// const XAWS = AWSXRay.captureAWS(AWS)
// const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly toDosTable = process.env.TODOS_TABLE,
    private readonly s3Bucket: Types = new AWS.S3({ signatureVersion: 'v4' }),
    private readonly attachementS3Bucket = process.env.ATTACHMENT_S3_BUCKET
  ) {}

  // define a method to get all todos
  async getAllToDo(userId: string): Promise<TodoItem[]> {
    const resourceParameter = {
      TableName: this.toDosTable,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }
    const res = await this.docClient.query(resourceParameter).promise()
    const toDos = res.Items
    return toDos as TodoItem[]
  }
  // define a method to create a todos
  async createToDo(toDoItem: TodoItem): Promise<TodoItem> {
    const resourceParameter = {
      TableName: this.toDosTable,
      Item: toDoItem
    }

    await this.docClient.put(resourceParameter).promise()
    return toDoItem as TodoItem
  }
  // define a method to update a todo
  async updateToDo(
    toDoUpdate: TodoUpdate,
    toDoId: string,
    userId: string
  ): Promise<TodoUpdate> {
    const resourceParameter = {
      TableName: this.toDosTable,
      Key: {
        userId: userId,
        todoId: toDoId
      },
      UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done'
      },
      ExpressionAttributeValues: {
        ':name': toDoUpdate['name'],
        ':dueDate': toDoUpdate['dueDate'],
        ':done': toDoUpdate['done']
      },
      ReturnValues: 'ALL_NEW'
    }

    const res = await this.docClient.update(resourceParameter).promise()
    let attribute = res.Attributes

    return attribute as TodoUpdate
  }
  // define a method to delete a todo
  async deleteToDo(toDoId: string, userId: string): Promise<string> {
    const resourceParameter = {
      TableName: this.toDosTable,
      Key: {
        userId: userId,
        todoId: toDoId
      }
    }

    await this.docClient.delete(resourceParameter).promise()
    return 'delete successful!!!' as string
  }
  // define a method to presigned s3 upload url
  async generateUploadUrl(toDoId: string): Promise<string> {
    let url = this.s3Bucket.getSignedUrl('putObject', {
      Bucket: this.attachementS3Bucket,
      Key: toDoId,
      Expires: 2000
    })
    console.log(url)
    return url as string
  }
}
