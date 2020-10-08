import { IPrograms } from "../interfaces/programs";

export const extensionPrograms: IPrograms[] = [
    {
        id: 1,
        name: 'Campanha 2020',
        start_period: '19/01/2020',
        final_period: '19/11/2020',
        mode: 'Presencial',
        categoryId: 1,
        course_unity: 'sa123',
        type: 'presencial',
        allocation: 'Comum UP',
        type_evaluation: 'Nota',
        total_workload: 60,
        extension_workload: 60,
        weekly: 3,
        hour_clock: 50,
        form_id: 1
    },
    {
        id: 2,
        name: 'Campanha 2021',
        start_period: '19/01/2021',
        final_period: '19/11/2021',
        mode: 'Presencial',
        categoryId: 1,
        course_unity: 'jk645',
        type: 'presencial',
        allocation: 'Comum UP',
        type_evaluation: 'Nota',
        total_workload: 60,
        extension_workload: 60,
        weekly: 3,
        hour_clock: 50,
        form_id: 0
    }
]