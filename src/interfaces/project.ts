import { ICategory } from "./category";
import { INotice, ISchedule } from "./notice";
import IUser from "./user";

export interface IProject {
    _id: string
    key?: string
    name: string
    programId: string
    category: ICategory | string
    notice: INotice | string
    typeProject: 'common' | 'extraCurricular' | 'curricularComponent'
    firstSemester: ISchedule[]
    secondSemester: ISchedule[]
    totalCH: number
    partnership: IPartnership[] | undefined
    specificCommunity: ISpecificCommunity
    description: string
    planning: IPlanning[]
    results: string
    resources: IResource
    attachments: string[]
    author: IUser | string;
    dateStart: Date
    dateFinal: Date
    status: 'pending' | 'reproved' | 'notSelected' | 'selected' |  'finished'
    disciplines: IDiscipline[]
    teachers : ITeacher[]
    maxClasses: number
}

export interface IPartnership {
    text: string
    contacts: IContact[]
}

export interface ITeacher {
    name: string
    registration: string
    cpf: string
    email: string
    phone: string
    totalCH: number | undefined
}
export interface IDiscipline {
    name: string
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