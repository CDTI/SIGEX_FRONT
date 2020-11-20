import { IRegistrationPeriod } from '../../interfaces/registrationPeriod'
import api from '../api'


export const getAllPeriods = async(): Promise<IRegistrationPeriod[]> => {
    const response = await api.get('registrationPeriod')

    return response.data
}

export const updatePeriod = async(period: IRegistrationPeriod): Promise<IRegistrationPeriod> => {
    const response = await api.put('registrationPeriod', period)

    return response.data
}