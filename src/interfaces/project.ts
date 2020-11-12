import { ILocal } from "../mocks/mockCalendar";

export interface IProject {
    _id: string
    name: string
    programId: string
    categoryId: string
    firstSemester: ILocal[]
    secondSemester: ILocal[]
    totalCH: number
    partnership: IPartnership[] | undefined
    specificCommunity: ISpecificCommunity
    description: string
    planning: IPlanning[]
    results: string
    resources: IResource
    attachments: string[]
    author: string
    dateStart: Date
    dateFinal: Date
    status: 'pending' | 'approved' | 'selected' | 'adjust' | 'reproved' | 'finish'
}

export interface IPartnership {
    text: string
    contacts: IContact[]
}

export interface IContact {
    name: string
    phone: string
}

export interface ISpecificCommunity {
    text: string
    location: string
    peopleInvolved: number
}

export interface IPlanning {
    text: string,
    developmentSite: string
    developmentMode: string
    startDate: string
    finalDate: string
}

export interface IResource {
    transport: ITransport | null
    materials: IMaterials[] | undefined
}

export interface ITransport {
    typeTransport: string
    description: string
    unity: string
    quantity: number
    unitaryValue: number
    totalPrice: number
}

export interface IMaterials {
    item: string
    description: string
    unity: string
    quantity: number
    unitaryValue: number
    totalPrice: number
}