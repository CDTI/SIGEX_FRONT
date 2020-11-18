import { IRegister } from "../interfaces/feedback";
import { IProject } from "../interfaces/project";

export const currentProject = (project: IProject) => {
    let current = -1

    if (project.status === 'pending' || project.status === 'adjust' || project.status === 'reproved' || project.status === 'approved')
        current = 0
    if (project.status === 'selected')
        current = 1
    if (project.status === 'finish')
        current = 2
    if (project.status === 'finish')
        current = 3

    return current
}

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