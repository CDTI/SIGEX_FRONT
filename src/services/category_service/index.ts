import { ICategory } from '../../interfaces/category'
import api from '../api'

interface ReturnRequest{
    message: string
    deleted?: boolean
    created?: boolean
}

export const createCategory = async (category: ICategory): Promise<ReturnRequest> => {
    try{
        const response = await api.post('/category', category)

        return response.data
    }catch(e){
        return e
    }
}

export const listCategories = async(): Promise<ICategory[]> => {
    const response = await api.get('/category')

    return response.data.categories
}

export const deleteCategory = async(id: string): Promise<ReturnRequest> => {
    const response = await api.delete(`/category/${id}`)

    return response.data as ReturnRequest
}