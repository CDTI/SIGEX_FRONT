import { IProject, ITransport } from "../interfaces/project";

export const newProject: IProject = {
    _id: '',
    name: '',
    description: '',
    partnership: [],
    planning: [{
        text: '',
        developmentMode: '',
        developmentSite: '',
        finalDate: '',
        startDate: ''
    }],
    programId: '',
    categoryId: '',
    resources: {
        transport: {
            description: '',
            quantity: 0,
            totalPrice: 0,
            typeTransport: '',
            unitaryValue: 0,
            unity: ''
        },
        materials: [{
            description: '',
            item: '',
            quantity: 0,
            totalPrice: 0,
            unitaryValue: 0,
            unity: ''
        }],
    },
    results: '',
    specificCommunity: {
        location: '',
        peopleInvolved: 0,
        text: ''
    },
    unity: [],
    attachments: [],
    author: '',
    dateStart: new Date(),
    dateFinal: new Date(),
    status: 'pending'
}

export const newTransport: ITransport = {
    description: '',
    quantity: 0,
    totalPrice: 0,
    typeTransport: '',
    unitaryValue: 0,
    unity: ''
}