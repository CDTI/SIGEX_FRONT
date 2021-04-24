export interface ILocal {
    _id?: string,
    name: string,
    turn: string,
    day: string
}

export interface ICalendar {
    categoryId: string,
    local: ILocal[]
}

export const calendar: ICalendar[] = [
    {
        categoryId: '5f866ce9425bcf27a4a6917a',
        local: [
            {
                name: 'Campus Ecoville',
                turn: 'Manhã',
                day: '2ª Feira'
            },
            {
                name: 'Campus Ecoville',
                turn: 'Noite',
                day: '4ª Feira'
            },
            {
                name: 'Unidade Praça Osório',
                turn: 'Manhã',
                day: '3ª Feira'
            },
            {
                name: 'Unidade Praça Osório',
                turn: 'Noite',
                day: '5ª Feira'
            },
            {
                name: 'Unidade Santos Andrade',
                turn: 'Manhã',
                day: '4ª Feira',
            },
            {
                name: 'Unidade Santos Andrade',
                turn: 'Noite',
                day: '6ª Feira',
            },
            {
                name: 'Campus Londrina',
                turn: 'Manhã',
                day: '2ª Feira'
            },
            {
                name: 'Campus Londrina',
                turn: 'Noite',
                day: '4ª Feira'
            }
        ]
    },
    {
        categoryId: '5f866db8ffabe94b908e42ab',
        local: [
            {
                name: 'Campus Ecoville',
                turn: 'Manhã',
                day: '3ª Feira'
            },
            {
                name: 'Campus Ecoville',
                turn: 'Noite',
                day: '6ª Feira'
            },
            {
                name: 'Unidade Praça Osório',
                turn: 'Manhã',
                day: '4ª Feira'
            },
            {
                name: 'Unidade Praça Osório',
                turn: 'Noite',
                day: '4ª Feira'
            },
            {
                name: 'Unidade Santos Andrade',
                turn: 'Manhã',
                day: '2ª Feira'
            },
            {
                name: 'Unidade Santos Andrade',
                turn: 'Noite',
                day: '3ª Feira'
            },
            {
                name: 'Campus Londrina',
                turn: 'Manhã',
                day: '3ª Feira'
            },
            {
                name: 'Campus Londrina',
                turn: 'Noite',
                day: '6ª Feira'
            }
        ]
    },
    {
        categoryId: '5f866ddbffabe94b908e42ac',
        local: [
            {
                name: 'Campus Ecoville',
                turn: 'Manhã',
                day: '4ª Feira'
            },
            {
                name: 'Campus Ecoville',
                turn: 'Noite',
                day: '2ª Feira'
            },{
                name: 'Unidade Praça Osório',
                turn: 'Manhã',
                day: '5ª Feira'
            },
            {
                name: 'Unidade Praça Osório',
                turn: 'Noite',
                day: '3ª Feira'
            },
            {
                name: 'Unidade Santos Andrade',
                turn: 'Manhã',
                day: '6ª Feira'
            },
            {
                name: 'Unidade Santos Andrade',
                turn: 'Noite',
                day: '5ª Feira'
            },
            {
                name: 'Campus Londrina',
                turn: 'Manhã',
                day: '4ª Feira'
            },
            {
                name: 'Campus Londrina',
                turn: 'Noite',
                day: '2ª Feira'
            }
        ]
    },
    {
        categoryId: '5f866de9ffabe94b908e42ad',
        local: [
            {
                name: 'Campus Ecoville',
                turn: 'Manhã',
                day: '5ª Feira'
            },
            {
                name: 'Campus Ecoville',
                turn: 'Noite',
                day: '3ª Feira'
            },
            {
                name: 'Unidade Praça Osório',
                turn: 'Manhã',
                day: '6ª Feira'
            },
            {
                name: 'Unidade Praça Osório',
                turn: 'Noite',
                day: '2ª Feira'
            },
            {
                name: 'Unidade Santos Andrade',
                turn: 'Manhã',
                day: '3ª Feira'
            },
            {
                name: 'Unidade Santos Andrade',
                turn: 'Noite',
                day: '4ª Feira'
            },
            {
                name: 'Campus Londrina',
                turn: 'Manhã',
                day: '5ª Feira'
            },
            {
                name: 'Campus Londrina',
                turn: 'Noite',
                day: '3ª Feira'
            }
        ]
    }
]