import { IProject } from '../../interfaces/project'
import { IReport } from '../../interfaces/report'
import api from '../api'

export interface ReturnResponse {
    message: string,
    project: IProject,
    result: 'error' | 'success',
}

export interface GetResponse {
    message: string,
    projects: IProject[]
}

export const listAllProject = async (): Promise<IProject[]> => {
    const response = await api.get('project')

    return response.data.projects
}

export const listProjectForTeacher = async (): Promise<IProject[]> => {
    const response = await api.get('projectForTeacher')

    return response.data.projects
}

export const createProject = async (project: IProject): Promise<IProject> => {
    const response = await api.post('project', project)

    return response.data
}

export const updateProject = async (project: IProject): Promise<ReturnResponse> => {
    const response = await api.put('project', project)

    return response.data
}

export const listApprovedProjects = async(): Promise<GetResponse> => {
    const response =  await api.get('listApprovedProject')

    return response.data
}

export const deleteProject = async(projectId: string): Promise<ReturnResponse> => {
    const response = await api.delete(`project/${projectId}`)

    return response.data
}

export const downloadCSV = async(programId: string): Promise<any> => {
    if(programId !== 'null'){
        const response = await api.get('downloadCsv/'.concat(programId), { responseType: 'blob' })
        console.log(response.headers)
        window.open(response.data)
        return response.data
    } else {
        const response = await api.get('downloadCsv')
        window.open(response.data)
        return response.data
    }
}

export async function createReport(projectId: string, report: IReport): Promise<string>
{
  const response = await api.post(`project/report/${projectId}`, report);

  return response.data;
}

export async function updateReport(id: string, report: IReport): Promise<string>
{
  const response = await api.put(`project/report/${id}`, report);

  return response.data;
}