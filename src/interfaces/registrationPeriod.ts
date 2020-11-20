export interface IRegistrationPeriod{
    _id: string,
    name: string,
    typePeriod: 'common' | 'specific',
    isActive: boolean
}