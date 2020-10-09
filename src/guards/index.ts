import { ApplicationState } from "../store"
import { User } from "../store/ducks/user/types"

const getUser = async (): Promise<any> => {
    const getUser = localStorage.getItem('persist:@ext')
    console.log(getUser)
    if (getUser != null) {
        const userAuth = JSON.parse(JSON.parse(getUser).user).data
        console.log(userAuth)
        return userAuth
    }

    return null
}

export function isNotLogged() {
    return new Promise(async (resolve, reject) => {
        const userAuth = await getUser() as User
        if (userAuth !== undefined && userAuth.role.length > 0) {
            resolve({ login: true })
        } else {
            reject(new Error('/login'))
        }
    })
}

export function isLogged() {
    return new Promise(async (resolve, reject) => {
        const userAuth = await getUser() as User
        console.log(userAuth)
        if (userAuth !== undefined && userAuth.role.length === 0) {
            resolve({ login: true })
        } else {
            reject(new Error('/dashboard'))
        }
    })
}


export function isAdminAuth() {
    return new Promise(async (resolve, reject) => {
        const userAuth = await getUser() as User
        if (userAuth.role === 'admin') {
            resolve({ login: true })
        } else {
            reject(new Error('/Dashboard'))
        }
    })
}

export function isDocenteAuth() {
    return new Promise(async (resolve, reject) => {
        const userAuth = await getUser() as User
        if (userAuth.role === 'teacher') {
            resolve({ login: true })
        } else {
            reject(new Error('/Dashboard'))
        }
    })
}