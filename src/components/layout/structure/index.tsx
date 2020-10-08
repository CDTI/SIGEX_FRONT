import React from 'react'
import { Divider } from 'antd'
import { Title } from '../../../global/styles'

interface Props {
    title: string
}

const Structure: React.FC<Props> = ({ title, children }) => {
    return (
        <>
            <Title>{title}</Title>
            <Divider />
            <>
                {children}
            </>
        </>
    )
}

export default Structure