import { IProject } from '../../interfaces/project'
import api from '../api'

export interface ReturnResponse {
    message: string,
    project: IProject,
    result: 'error' | 'success',
}

export const listAllProject = async (): Promise<IProject[]> => {
    const response = await api.get('/project')

    return response.data.projects
}

export const listProjectForTeacher = async (): Promise<IProject[]> => {
    const response = await api.get('/projectForTeacher')

    return response.data.projects
}

export const createProject = async (project: IProject): Promise<IProject> => {
    const response = await api.post('/project', project)

    return response.data
}

export const updateProject = async (project: IProject): Promise<ReturnResponse> => {
    const response = await api.put('/project', project)

    return response.data
}