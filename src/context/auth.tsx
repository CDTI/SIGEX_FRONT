import { AxiosError } from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { notification } from "antd";
import { User } from "../interfaces/user";
import { httpClient } from "../services/httpClient";
import history from "../global/history";

export interface Login
{
  cpf: string;
  password: string;
}

interface AuthContextData
{
  signed: boolean;
  user: User | null;
  login(login: Login): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) =>
{
    // const initialValue = {
    //     email: "",
    //     password: "",
    //     lattes: "",
    //     cpf: "",
    //     name: "",
    //     _id: "",
    //     role: "",
    // }
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const storageUser = localStorage.getItem("@pp:user")
        const storageToken = localStorage.getItem("@pp:token")

        if (storageToken && storageUser) {
            setUser(JSON.parse(storageUser.toString()))
            httpClient.defaults.headers.Authorization = `Bearer ${storageToken}`
            history.push("/dashboard")
        }
    }, [])

    const logout = () => {
        setUser(null)

        localStorage.removeItem("@pp:user")
        localStorage.removeItem("@pp:token")
    }

    const login = async (login: Login) => {
        try {
            let status: "success" | "error" = "success"
            const response = await httpClient.post("/login", {
                cpf: login.cpf,
                password: login.password
            })
            console.log(response)
            status = response.data.status
            if (response.data.token !== null && response.data.status === "success") {
                notification[status]({ message: response.data.message })
                setUser(response.data.user)
                httpClient.defaults.headers.Authorization = `Bearer ${response.data.token}`

                localStorage.setItem("@pp:user", JSON.stringify(response.data.user))
                localStorage.setItem("@pp:token", response.data.token)


                history.push("/dashboard")
            } else if (response.data.token === null && response.data.status === "error") {
                notification[status]({ message: response.data.message })
            }
        } catch (err) {
            if (err && err.reponse) {
                const axiosError = err as AxiosError;
                console.log(axiosError);
                return axiosError.response?.data;
            }
            throw err;
        }
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