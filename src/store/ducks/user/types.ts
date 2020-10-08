export enum UserTypes {
    ADD_USER = '@user/ADD_USER',
    REMOVE_USER = '@user/REMOVE_USER',
    REQUEST_USER = '@user/REQUEST_USER'
}

export interface User {
    id: number
    cpf: string
    name: string
    password: string
    role: string
}

export interface UserState {
    readonly data: User
}