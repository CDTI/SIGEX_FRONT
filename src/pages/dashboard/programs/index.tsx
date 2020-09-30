import React, { useEffect, useState } from 'react'
import { List,Button } from 'antd'
import { extensionPrograms, IPrograms } from '../../../mocks/mockPrograms'
import { Link } from 'react-router-guard';

const Programs: React.FC = () => {
    const [programs, setPrograms] = useState<IPrograms[]>()

    useEffect(() => {
        setPrograms(extensionPrograms)
    })

    return (
        <>
        <Button type="primary">
            <Link to="program/create">
                Criar
            </Link>
        </Button>
            <List
                itemLayout="horizontal"
                dataSource={programs}
                renderItem={item => (
                    <List.Item
                        actions={[<a key="list-loadmore-edit">Editar</a>, <a key="list-loadmore-more">Incluir Formulário</a>]}
                    >

                        <List.Item.Meta
                            title={<a href="#">{item.name}</a>}
                            description={item.course_unit.name}
                        />
                    </List.Item>
                )}
            />
        </>
    )
}

export default Programs