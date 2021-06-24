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
        render: (status: string) =>
        {
          switch (status)
          {
            case "pending":
              return (<Tag color="#f9a03f" key="Pendente">Pendente</Tag>);

            case "reproved":
              return (<Tag color="#f71735" key="Reprovado">Reprovado</Tag>);

            case "notSelected":
              return (<Tag color="#40f99b" key="Aprovado">Aprovado</Tag>);

            case "selected":
              return (<Tag color="#ffffff" key="EmAndamento">Em andamento</Tag>);

            case "finished":
              return (<Tag color="#000000" key="Finalizado">Finalizado</Tag>);
          }
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