import React, { useEffect, useState } from 'react'
import { List, Button } from 'antd'
import Structure from '../../../components/layout/structure';
import { IPrograms } from '../../../interfaces/programs';
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/auth';
import { listPrograms } from '../../../services/program_service';


const Programs: React.FC = () => {
    const [programs, setPrograms] = useState<IPrograms[]>()
    const { user } = useAuth()

    useEffect(() => {
        listPrograms().then(data => {
            setPrograms(data.programs)
        })
    }, [])

    return (
        <Structure title="Lista de Programas">
            <List
                itemLayout="horizontal"
                dataSource={programs}
                renderItem={item => (
                    <List.Item
                    >

                        <List.Item.Meta
                            title={<Button type="link">{item.name}</Button>}
                            description={item.description}
                        />
                    </List.Item>
                )}
            />
        </Structure>
    )
}

export default Programs