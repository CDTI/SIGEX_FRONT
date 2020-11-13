import React, { useEffect, useState } from 'react'
import Structure from '../../../../../components/layout/structure'
import { ContainerFlex } from '../../../../../global/styles'
import { IProject } from '../../../../../interfaces/project'
import { listAllProject } from '../../../../../services/project_service'
import { Tag, Space, Button, Select } from 'antd'
import { EyeOutlined } from '@ant-design/icons'

import MyTable from '../../../../../components/layout/table'
import { Link } from 'react-router-dom'
import { IPrograms } from '../../../../../interfaces/programs'
import { listPrograms } from '../../../../../services/program_service'

const { Option } = Select

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
                    <Link to={{ pathname: '/dashboard/project/admin-view', state: record }} >
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
    const [filteredProject, setFilteredProjects] = useState<IProject[]>([])
    const [programs, setPrograms] = useState<IPrograms[]>([])

    useEffect(() => {
        listAllProject().then(data => {
            setProjects(data)
            setFilteredProjects(data)
            listPrograms().then(listPrograms => {
                setPrograms(listPrograms.programs)
            })
        })
    }, [])

    const handleChange = (event: string) => {
        if (event !== 'null') {
            const filter = projects.filter(e => e.programId === event)
            setFilteredProjects(filter)
        } else {
            setFilteredProjects(projects)
        }
    }

    return (
        <Structure title="todas as propostas">
            <Select defaultValue="null" style={{ width: 200, margin: '8px 0' }} onChange={handleChange}>
                <Option value='null'>Sem filtro</Option>
                {programs.map(e => {
                    if (e._id !== undefined) {
                        return (
                            <Option key={e._id} value={e._id}>{e.name}</Option>
                        )
                    }
                })}
            </Select>
            <ContainerFlex>
                <MyTable data={filteredProject} columns={columns} />
            </ContainerFlex>
        </Structure>
    )
}

export default Projects