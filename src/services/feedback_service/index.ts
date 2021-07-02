import { IFeedback } from '../../interfaces/feedback'
import api from '../api'

interface ReturnResponse {
    created?: boolean,
    status: 'error' | 'success',
    message: string,
    feedback: IFeedback
}

export const listFeedbackProject = async (projectId: string): Promise<ReturnResponse> => {
    const response = await api.get(`/feedback/${projectId}`)

    return response.data
}

export const createFeedbackProject = async (projectId: string, value: {text: string}): Promise<ReturnResponse> => {
    const response = await api.put(`/feedback/${projectId}`, value)

    return response.data
}