import React, { useEffect, useState } from 'react'
import Structure from '../../../../../components/layout/structure'
import { ContainerFlex } from '../../../../../global/styles'
import { IProject } from '../../../../../interfaces/project'
import { listAllProject } from '../../../../../services/project_service'
import { Tag, Space, Button } from 'antd'
import { EyeOutlined } from '@ant-design/icons'

import MyTable from '../../../../../components/layout/table'
import { Link } from 'react-router-dom'

const columns = [
    {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Data de início',
        dataIndex: 'dateStart',
        key: 'dateStart',
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (status: string) => {
            let typeStatus = { color: '', text: '' }

            if (status === 'pending') {
                typeStatus.color = '#f9a03f'
                typeStatus.text = 'Pendente'
            } else if (status === 'adjust') {
                typeStatus.color = '#e1bc29'
                typeStatus.text = 'Correção'
            } else if (status === 'reproved') {
                typeStatus.color = '#f71735'
                typeStatus.text = 'Reprovado'
            } else if (status === 'approved') {
                typeStatus.color = '#40f99b'
                typeStatus.text = 'Aprovado'
            } else if (status === 'finish') {
                typeStatus.color = '#000000'
                typeStatus.text = 'Finalizado'
            }
            return (
                <Tag color={typeStatus.color} key={typeStatus.text}>
                    {typeStatus.text}
                </Tag>
            )
        },
    },
    {
        title: 'Ação',
        key: 'action',
        render: (text: string, record: IProject) => (
            <Space size="middle">
                <Button>
                    <Link to={{ pathname:'/dashboard/project/admin-view', state: record }} >
                        <EyeOutlined />
                        Revisar 
                    </Link>
                </Button>
            </Space>
        ),
    },
];

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<IProject[]>([])

    useEffect(() => {
        listAllProject().then(data => {
            console.log(data)
            setProjects(data)
        })
    }, [])

    return (
        <Structure title="todas as propostas">
            <ContainerFlex>
                <MyTable data={projects} columns={columns} />
            </ContainerFlex>
        </Structure>
    )
}

export default Projects