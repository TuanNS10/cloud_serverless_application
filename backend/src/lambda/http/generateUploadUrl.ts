import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId: string = getUserId(event)
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    try{
      const signedUrl = await createAttachmentPresignedUrl(todoId, userId)
      return {
        statusCode: 200,
        headers:{
          'Access-Control-Allow-Origin': '*',
        },
        body : JSON.stringify({
          uploadURL: signedUrl
        })
      }
    }
    catch(err){ 
      return{
        statusCode: 500,
        headers:{
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          errror: err
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
