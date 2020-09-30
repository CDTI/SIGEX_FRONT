import React, { useState } from 'react'
import { Card, Col, Row, Select } from 'antd';
import { extensionPrograms } from '../../../mocks/mockPrograms'
import { mockProjects, Project } from '../../../mocks/mockProjects'

const { Option, OptGroup } = Select;

const HomeDashboard: React.FC = () => {
  const [projects, setProject] = useState<Project[]>([])

  const handleChange = (event: any) => {
    const filterProjects = mockProjects.filter(e => e.program_id === event) as Project[]
    console.log(filterProjects)
    setProject(filterProjects)
  }

  return (
    <>
      <div>
        <Select defaultValue="Selecione" style={{ width: 200 }} onChange={handleChange}>
          {extensionPrograms.map(e => {
            return (
              <Option value={e.id}>{e.name}</Option>
            )
          })}
        </Select>,
    </div>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Total de projetos" bordered={false}>
              {projects.length}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Projetos Aprovados" bordered={false}>
              {projects.filter(e => e.status === 'approved').length}
        </Card>
          </Col>
          <Col span={8}>
            <Card title="Projetos Reprovados" bordered={false}>
            {projects.filter(e => e.status === 'reproved').length}
        </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default HomeDashboard