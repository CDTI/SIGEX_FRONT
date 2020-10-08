import React from 'react'
import { IFormProgram } from '../../../interfaces/formProgram'
import { ListQuestions, TitleGroups, QuestionItem } from './style'

interface Props {
    form: IFormProgram
}

const ListGroups: React.FC<Props> = ({ form }) => {
    console.log(form)
    return (
        <>
            {form.groups.map((group, index) => (
                <>
                    <TitleGroups key={index}>{group.name}</TitleGroups>
                    <ListQuestions key={index}>
                        {group.questions.map((question, indexQuestion) => (
                            <QuestionItem key={indexQuestion}>{question.textQuestion}</QuestionItem>
                        ))}
                    </ListQuestions>
                </>
            ))}
        </>
    )
}

export default ListGroups