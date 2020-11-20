import React, { useEffect, useState } from 'react'
import Structure from '../../../../components/layout/structure'
import { ContainerFlex } from '../../../../global/styles'
import { IProject } from '../../../../interfaces/project'
import { downloadCSV, listAllProject } from '../../../../services/project_service'
import { Tag, Space, Button, Select, Modal } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import AdminViewProject from '../admin/admin-view-projects'

import MyTable from '../../../../components/layout/table'
import { Link } from 'react-router-dom'
import { IPrograms } from '../../../../interfaces/programs'
import { listPrograms } from '../../../../services/program_service'
import { base_url } from '../../../../services/api'
import { newProject } from '../../../../mocks/mockDefaultValue'

const { Option } = Select

interface IModal {
    project: IProject
    visible: boolean
}

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<IProject[]>([])
    const [filteredProject, setFilteredProjects] = useState<IProject[]>([])
    const [programs, setPrograms] = useState<IPrograms[]>([])
    const [event, setEvent] = useState('')
    const [modal, setModal] = useState<IModal>({ visible: false, project: newProject })

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
        setEvent(event)
        if (event !== 'null') {
            const filter = projects.filter(e => e.programId === event)
            setFilteredProjects(filter)
        } else {
            setFilteredProjects(projects)
        }
    }

    const openModal = (project: IProject) => {
        setModal({ visible: true, project: project })
    }

    const closeModal = () => {
        setModal({ visible: false, project: newProject })
    }

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
                    <Button onClick={() => openModal(record)}>
                        <EyeOutlined />
                            Revisar

                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Structure title="todas as propostas">
            <Space>
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
                {event !== 'null' && (
                    <Button type='link' target='_blank' href={base_url?.concat('extensao/downloadCsv/').concat(event)}>Baixar projetos</Button>
                )}
                {event === 'null' && (
                    <Button type='link' target='_blank' href={base_url?.concat('extensao/downloadCsv/')}>Baixar projetos</Button>
                )}
                {event !== 'null' && (
                    <Button type='link' target='_blank' href={base_url?.concat('extensao/downloadCSVHours/').concat(event)}>Baixar horários</Button>
                )}
                {event === 'null' && (
                    <Button type='link' target='_blank' href={base_url?.concat('extensao/downloadCSVHours/')}>Baixar horários</Button>
                )}
            </Space>
            <ContainerFlex>
                <MyTable data={filteredProject} columns={columns} />
            </ContainerFlex>
            <Modal
                visible={modal.visible}
                onCancel={closeModal}
                footer={[]}
                width='90%'
                style={{ minHeight: '90%' }}
            >
                <>
                    <AdminViewProject project={modal.project} />
                    <Space style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        <p></p>
                        <Button onClick={closeModal} type='primary'>
                            Sair
                        </Button>
                    </Space>
                </>
            </Modal>
        </Structure>
    )
}

export default Projects