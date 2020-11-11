import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Select } from 'antd';
import Structure from '../../../components/layout/structure';
import { IPrograms } from '../../../interfaces/programs';
import { listPrograms } from '../../../services/program_service';
import { listAllProject } from '../../../services/project_service';
import { IProject } from '../../../interfaces/project';

const { Option } = Select;

const HomeDashboard: React.FC = () => {
  const [projects, setProject] = useState<IProject[]>([])
  const [filteredProjects, setFilteredProject] = useState<IProject[]>([])
  const [programs, setPrograms] = useState<IPrograms[]>([])

  useEffect(() => {
    listPrograms().then(data => {
      setPrograms(data.programs)
      listAllProject().then(allProjects => {
        console.log(allProjects)
        setProject(allProjects)
      })
    })
  }, [])

  const handleChange = (event: any) => {
    console.log(event)
    const filterProjects = projects.filter(e => e.programId === event) as IProject[]
    console.log(filterProjects)
    setFilteredProject(filterProjects)
  }

  return (
    <Structure title="dashboard">
      <div>
        <Select defaultValue="Selecione" style={{ width: 200, margin: '8px 0' }} onChange={handleChange}>
          {programs.map(e => {
            if (e._id !== undefined) {
              return (
                <Option key={e._id} value={e._id}>{e.name}</Option>
              )
            }
          })}
        </Select>,
    </div>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8} style={{margin: '8px 0'}}>
            <Card title="Total de projetos" bordered={false}>
              {filteredProjects.length}
            </Card>
          </Col>
          <Col span={8} style={{margin: '8px 0'}}>
            <Card title="Projetos Aprovados" bordered={false}>
              {filteredProjects.filter(e => e.status === 'approved').length}
            </Card>
          </Col>
          <Col span={8} style={{margin: '8px 0'}}>
            <Card title="Projetos Reprovados" bordered={false}>
              {filteredProjects.filter(e => e.status === 'reproved').length}
            </Card>
          </Col>
          <Col span={8} style={{margin: '8px 0'}}>
            <Card title="Projetos Pendentes" bordered={false}>
              {filteredProjects.filter(e => e.status === 'pending' || e.status === 'adjust').length}
            </Card>
          </Col>
          <Col span={8} style={{margin: '8px 0'}}>
            <Card title="Projetos Selecionados" bordered={false}>
              {filteredProjects.filter(e => e.status === 'selected').length}
            </Card>
          </Col>
        </Row>
      </div>
    </Structure>
  )
}

export default HomeDashboard