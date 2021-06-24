import { Tag } from "antd";
import { useLocation } from "react-router";
import { IRegister } from "../interfaces/feedback";

export const compareDate = (a: IRegister, b: IRegister) => {
    return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
}

export const typeUser = async (role: string[]) => {
    let type = []

    if (role.includes('teacher'))
        type.push('Professor')
    if (role.includes('admin'))
        type.push('Administrador')
    if (role.includes('ndePresident'))
        type.push('Presidente do NDE')
    if (role.includes('integrationCord'))
        type.push('Coordenador de integração')

    return type
}

export const useUrlQuery = () => new URLSearchParams(useLocation().search);