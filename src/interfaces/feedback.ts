export interface IRegister {
    text: string,
    date: Date,
    typeFeedback: 'system' | 'user'
}

export interface IFeedback{
    projectId: string,
    registers: IRegister[]
}
