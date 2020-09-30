export const mockProjects = [
    {
        id: 1,
        name: 'Projeto 1',
        program_id: 1,
        status: 'approved',
        author: 'Daniel Candido'
    },
    {
        id: 2,
        name: 'Projeto 2',
        program_id: 1,
        status: 'approved',
        author: 'Carlos Souza'
    },
    {
        id: 3,
        name: 'Projeto 3',
        program_id: 1,
        status: 'approved',
        author: 'Evelyn Coutinho'
    },
    {
        id: 4,
        name: 'Projeto 4',
        program_id: 1,
        status: 'approved',
        author: 'Luan Santana'
    },
    {
        id: 5,
        name: 'Projeto 5',
        program_id: 1,
        status: 'approved',
        author: 'Daniel Candido'
    },
    {
        id: 6,
        name: 'Projeto 6',
        program_id: 2,
        status: 'approved',
        author: 'Jucicléia Mendez'
    },
    {
        id: 7,
        name: 'Projeto 7',
        program_id: 2,
        status: 'approved',
        author: 'Zuleide'
    },
    {
        id: 8,
        name: 'Projeto 8',
        program_id: 2,
        status: 'approved',
        author: 'Suzana Vieira'
    },
    {
        id: 9,
        name: 'Projeto 9',
        program_id: 2,
        status: 'approved',
        author: 'Caio Castro'
    },
    {
        id: 10,
        name: 'Projeto 10',
        program_id: 2,
        status: 'approved',
        author: 'Marcelo Moreno'
    },
    {
        id: 11,
        name: 'Projeto 11',
        program_id: 1,
        status: 'reproved',
        author: 'Daniel Candido'
    },
    {
        id: 12,
        name: 'Projeto 12',
        program_id: 2,
        status: 'reproved',
        author: 'Daniel Candido'
    },
    {
        id: 13,
        name: 'Projeto 13',
        program_id: 2,
        status: 'reproved',
        author: 'Daniel Candido'
    }
]

export interface Project {
    id: number
    name: string
    program_id: number
    status: string
    author: string
}