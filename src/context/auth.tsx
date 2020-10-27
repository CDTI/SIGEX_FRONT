import React, { createContext, useContext, useState, useEffect } from 'react'
import { UserInterface } from '../interfaces/user'
import api from '../services/api'
import history from '../global/history'

export interface Login {
    email: string
    password: string
}

interface AuthContextData {
    signed: boolean
    user: UserInterface | null
    login(login: Login): Promise<void>
    logout(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }) => {
    // const initialValue = {
    //     email: '',
    //     password: '',
    //     lattes: '',
    //     cpf: '',
    //     name: '',
    //     _id: '',
    //     role: '',
    // }
    const [user, setUser] = useState<UserInterface | null>(null)

    useEffect(() => {
        const storageUser = localStorage.getItem('@pp:user')
        const storageToken = localStorage.getItem('@pp:token')

        if (storageToken && storageUser) {
            setUser(JSON.parse(storageUser.toString()))
            api.defaults.headers.Authorization = `Bearer ${storageToken}`
            history.push('/dashboard')
        }
    }, [])

    const logout = () => {
        setUser(null)

        localStorage.removeItem('@pp:user')
        localStorage.removeItem('@pp:token')
    }

    const login = async (login: Login) => {
        const response = await api.post('/login', {
            email: login.email,
            password: login.password
        })

        setUser(response.data.user)
        api.defaults.headers.Authorization = `Bearer ${response.data.token}`

        localStorage.setItem('@pp:user', JSON.stringify(response.data.user))
        localStorage.setItem('@pp:token', response.data.token)

        history.push('/dashboard')
    }

    return (
        <AuthContext.Provider value={{ signed: Boolean(user), user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    return context
}