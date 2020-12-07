import React, { useEffect, useState } from 'react'
import Structure from '../../../../../components/layout/structure'
import { ContainerFlex } from '../../../../../global/styles'
import { IPrograms } from '../../../../../interfaces/programs'
import { IProject } from '../../../../../interfaces/project'
import { listPrograms } from '../../../../../services/program_service'
import { listApprovedProjects } from '../../../../../services/project_service'
import { Tag, Select, Table } from 'antd'

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
        key: 'dateStart'
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
    }
];

const SelectProjects: React.FC = () => {
    const [projects, setProjects] = useState<IProject[]>([])
    const [filteredProjects, setFilteredProjects] = useState<IProject[]>([])
    const [programs, setPrograms] = useState<IPrograms[]>([])
    const selectedProjects: number[] = []

    useEffect(() => {
        listApprovedProjects().then(data => {
            setProjects(data.projects)
            setFilteredProjects(data.projects)
            listPrograms().then(list => {
                setPrograms(list.programs)
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

    const onSelectChange = (selectedProjects: any) => {
        console.log('selectedRowKeys changed: ', selectedProjects);
    }

    const rowSelection = {
        selectedProjects,
        onChange: onSelectChange,
    }

    return (
        <Structure title='Selecionar projetos'>
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
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredProjects} />
            </ContainerFlex>
        </Structure>
    )
}

export default SelectProjects