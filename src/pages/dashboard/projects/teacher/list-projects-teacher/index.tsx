import React, { useEffect, useState } from 'react'
import Structure from '../../../../../components/layout/structure'
import { ContainerFlex } from '../../../../../global/styles'
import { IProject } from '../../../../../interfaces/project'
import { deleteProject, listProjectForTeacher } from '../../../../../services/project_service'
import { Tag, Space, Button, Spin, notification } from 'antd'

import MyTable from '../../../../../components/layout/table'
import { Link } from 'react-router-dom'

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<IProject[]>([])
    const [loading, setLoading] = useState(false)
    const [initialState, setInitialState] = useState(0)

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

                if (status === 'pending' || status === 'pending') {
                    typeStatus.color = '#f9a03f'
                    typeStatus.text = 'Pendente'
                } else if (status === 'adjust') {
                    typeStatus.color = '#e1bc29'
                    typeStatus.text = 'Correção'
                } else if (status === 'reproved') {
                    typeStatus.color = '#f71735'
                    typeStatus.text = 'Reprovado'
                } else if (status === 'selected') {
                    typeStatus.color = '#40f99b'
                    typeStatus.text = 'Selecionado'
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
                    {(record.status === 'pending' || record.status === 'adjust') && (
                        <>
                            <Button>
                                <Link to={{ pathname: '/dashboard/project/create', state: record }}>
                                    Editar
                            </Link>
                            </Button>
                            {(record.status === 'adjust' || record.status === 'pending') && (
                                <Button onClick={async () => {
                                    const deleted = await deleteProject(record._id)

                                    notification[deleted.result]({ message: deleted.message })
                                    setInitialState(initialState + 1)
                                }}>Delete</Button>
                            )}
                        </>
                    )}
                </Space>
            ),
        },
    ];

    useEffect(() => {
        setLoading(true)
        listProjectForTeacher().then(data => {
            console.log(data)
            setProjects(data)
            setTimeout(() => { setLoading(false) }, 2000)
        })
    }, [])

    return (
        <Structure title="Meus Projetos">
            <ContainerFlex>
                {loading ? <Spin /> : <MyTable data={projects} columns={columns} />}
            </ContainerFlex>
        </Structure>
    )
}

export default Projects