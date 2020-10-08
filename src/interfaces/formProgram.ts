export interface IFormProgram {
    id: number
    groups: IGroupsProgram[]
}

export interface IGroupsProgram {
    id: number
    name: string
    questions: IQuestionsProgram[]
}

export interface IQuestionsProgram {
    id: number
    textQuestion: string
    typeAnswer: string
    answers: IAnswersProgram[]
}

export interface IAnswersProgram {
    id: number,
    textAnswer: string
}