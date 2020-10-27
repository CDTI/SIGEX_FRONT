import { IRegister } from "../interfaces/feedback";
import { IProject } from "../interfaces/project";

export const currentProject = (project: IProject) => {
    let current = -1

    if (project.status === 'pending' || project.status === 'adjust' || project.status === 'reproved')
        current = 0
    if (project.status === 'approved')
        current = 1
    if (project.status === 'selected')
        current = 2
    if (project.status === 'finish')
        current = 3

    return current
}

export const compareDate = (a: IRegister, b: IRegister) => {
    return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
}