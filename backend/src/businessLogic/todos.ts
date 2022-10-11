import { TodoAccess } from '../helpers/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todosAcess: TodoAccess = new TodoAccess()
const attachmentUtils = new AttachmentUtils()
const logger = createLogger('bussiness Layer Logger')

export async function getTodosForUser(userId: string) {
    try{
        let todos = await todosAcess.getTodoList(userId)
        return todos
    }   
    catch(err){
        logger.error('Unable to get todo list',{
            userId,
            error: err
        })
        return err
    } 
}

export async function createTodo(todoRequest: CreateTodoRequest, userId: string){
    const todoId = uuid.v4()
    const todoItem: TodoItem = {
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toLocaleDateString(),
        name: todoRequest.name,
        dueDate: todoRequest.dueDate,
        done: false,
        attachmentUrl: todoRequest.attachmentUrl
    }

    try{
        await todosAcess.insertTodoItem(todoItem)
        return todoItem
    }
    catch(error){
        logger.error('Unable to insert Todo Item',{
            methodName: 'todos.insertTodoItem',
            userId,
            error: error
        })
    }
}

export async function deleteTodo(todoId: string, userId: string){
    try{
        await todosAcess.deleteTodoItem(todoId, userId)
    }
    catch(error){
        return error
    }
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string){
    try{
        const imageId = uuid.v4()
        let url = await attachmentUtils.generateSignedUrl(imageId)
        await todosAcess.updateTodoItemAttachmentUrl(todoId, userId, imageId)
        return url
    }
    catch(error){  
        logger.error('Unable to update Todo Item attachment Url',{
            methodName: 'todos.createAttachmentPresignedUrl',
            userId,
            error: error
        })
    }
}