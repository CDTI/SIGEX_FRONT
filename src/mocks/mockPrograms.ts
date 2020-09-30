export const extensionPrograms = [
    {
        id: 1,
        name: 'Inverno 2020',
        period: 1,
        mode: 'presencial',
        category: 'obrigatória',
        course_unit: {
            name: 'GESTÃO DE PROJETOS',
            code: '12389ba'
        },
        offer: {
            allocation: 'COMUM UP',
            evaluation_type: 'NOTAS'
        },
        workload: {
            hours_in_class: {
                ch_total_course_unit: 120,
                ch_total_extension: 60
            },
            clock_time: {
                ch_total_course: 100
            }
        }
    },
    {
        id: 2,
        name: 'Verão 2020',
        period: 1,
        mode: 'semi-presencial',
        category: 'opcional',
        course_unit: {
            name: 'GESTÃO DE MARKETING',
            code: '16589ba'
        },
        offer: {
            allocation: 'COMUM UP',
            evaluation_type: 'RESULTADOS'
        },
        workload: {
            hours_in_class: {
                ch_total_course_unit: 120,
                ch_total_extension: 60
            },
            clock_time: {
                ch_total_course: 100
            }
        }
    }
]


export interface IPrograms {
    id: number
    name: string
    period: number
    mode: string
    category: string
    course_unit: CourseUnit
    offer: Offer
    workload: WorkLoad

}

interface CourseUnit {
    name: string
    code: string
}

interface Offer {
    allocation: string
    evaluation_type: string
}

interface WorkLoad {
    hours_in_class: HourInClass
    clock_time: ClockTime
}

interface HourInClass{
    ch_total_course_unit: number
    ch_total_extension: number
}

interface ClockTime {
    ch_total_course: number
}