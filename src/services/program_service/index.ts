import { IPrograms } from '../../interfaces/programs'
import api from '../api'

declare type ResultResponse = 'success' | 'error'

export interface ReturnResponsePost {
    program?: IPrograms,
    message: string,
    created: boolean,
    result: ResultResponse
}

interface ReturnResponseGet {
    message: string,
    programs: IPrograms[]
}

export const createProgram = async (program: IPrograms): Promise<ReturnResponsePost> => {
    const response = await api.post('/program', program)

    return response.data
}

export const listPrograms = async (): Promise<ReturnResponseGet> => {
    const response = await api.get('/program')

    return response.data
}