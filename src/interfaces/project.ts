// import { Teacher } from "./teacher";

export interface IProject {
    id: number
    name: string
    program_id: number
    unity: number[]
    // related_teachers: Teacher[]
    partnership: IPartnership[]
    specific_community: ISpecificCommunity
    description: string
    planning: IPlanning
    results: string
    resources: IResource
    attachments: string[]
}

export interface IPartnership {
    text: string
    contacts: IContact[]
}

export interface IContact {
    id: number
    name: string
    phone: string
}

export interface ISpecificCommunity {
    text: string
    location: string
    people_involved: number
}

export interface IPlanning {
    activities: string[]
    development_site: string
    development_mode: string
    start_date: string
    final_date: string
}

export interface IResource {
    transport: ITransport
    materials: IMaterials
}

export interface ITransport {
    type: string
    description: string
    unity: string
    quantity: number
    unitary_value: number
    total_price: number
}

export interface IMaterials {
    item: string
    description: string
    unity: string
    quantity: number
    unitary_value: number
    total_price: number
}