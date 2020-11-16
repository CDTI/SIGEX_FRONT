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

export const typeUser = (role: string) => {
    let type = ''
    
    if (role === 'teacher')
        type = 'Professor'
    if (role === 'admin')
        type = 'Administrador'
    if (role === 'ndePresident')
        type = 'Presidente do NDE'
    if (role === 'integrationCord')
        type = 'Coordenador de integração'

    return type
}