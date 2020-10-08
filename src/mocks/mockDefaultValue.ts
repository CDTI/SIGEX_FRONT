import { IProject, ITransport } from "../interfaces/project";

export const newProject: IProject = {
    id: 0,
    name: '',
    description: '',
    partnership: [],
    planning: {
        activities: [],
        development_mode: '',
        development_site: '',
        final_date: '',
        start_date: ''
    },
    program_id: 0,
    resources: {
        transport: {
            description: '',
            quantity: 0,
            total_price: 0,
            type: '',
            unitary_value: 0,
            unity: ''
        },
        materials: {
            description: '',
            item: '',
            quantity: 0,
            total_price: 0,
            unitary_value: 0,
            unity: ''
        }
    },
    results: '',
    specific_community: {
        location: '',
        people_involved: 0,
        text: ''
    },
    unity: [],
    attachments: []
}

export const newTransport: ITransport = {
    description: '',
    quantity: 0,
    total_price: 0,
    type: '',
    unitary_value: 0,
    unity: ''
}