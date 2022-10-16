import { TodoAccess } from '../helpers/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate';

// TODO: Implement businessLogic
const todoAcess: TodoAccess = new TodoAccess()
const attachmentUtils = new AttachmentUtils()
const logger = createLogger('bussiness Layer Logger')

export async function getTodosForUser(userId: string) {
    try{
        let todos = await todoAcess.getTodoList(userId)
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
        await todoAcess.insertTodoItem(todoItem)
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

export async function updateTodo(todoId: string, userId: string, updatedTodoItem: UpdateTodoRequest) {
    const todoUpdate: TodoUpdate = {
        ...updatedTodoItem
    }

    try {
        await todoAcess.updateTodoItem(todoId, userId, todoUpdate)
    } catch (err) {
        return err
    }
}

export async function deleteTodo(todoId: string, userId: string){
    try{
        await todoAcess.deleteTodoItem(todoId, userId)
    }
    catch(error){
        return error
    }
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string){
    try{
        const imageId = uuid.v4()
        let url = await attachmentUtils.generateSignedUrl(imageId)
        await todoAcess.updateTodoItemAttachmentUrl(todoId, userId, imageId)
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