import { UserTypes, User } from './types'
import { action } from 'typesafe-actions'

export const addUser = (data: User) => action(UserTypes.ADD_USER, { data })
export const removeUser = () => action(UserTypes.REMOVE_USER)
export const requestUser = () => action(UserTypes.REQUEST_USER)