import React, { useEffect, useState } from "react";
import { Card, Col, Row, Select } from "antd";

import { Program, isProgram } from "../../../interfaces/program";
import { Project } from "../../../interfaces/project";
import { listPrograms } from "../../../services/program_service";
import { listAllProject } from "../../../services/project_service";
import Structure from "../../../components/layout/structure";

const { Option } = Select;

export const HomeDashboard: React.FC = () =>
{
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() =>
  {
    (async () =>
    {
      const response = await listPrograms();
      setPrograms(response.programs);

      const projects = await listAllProject();
      setProjects(projects);
      setFilteredProjects(projects);
    })();
  }, []);

  const handleChange = (event: any) =>
  {
    setFilteredProjects(projects.filter((p: Project) => isProgram(p.program) ? p.program._id : p.program === event));
  }

  return (
    <Structure title="dashboard">
      <div>
        <Select
          defaultValue="Selecione"
          style={{ width: 200, margin: "8px 0" }}
          onChange={handleChange}
        >
          {programs.map(e => {
            if (e._id !== undefined) {
              return (
                <Option key={e._id} value={e._id}>{e.name}</Option>
              )
            }
          })}
        </Select>
      </div>

      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8} style={{margin: "8px 0"}}>
            <Card title="Total de projetos" bordered={false}>
              {filteredProjects.length}
            </Card>
          </Col>

          <Col span={8} style={{margin: "8px 0"}}>
            <Card title="Projetos Pendentes" bordered={false}>
              {filteredProjects.filter(e => e.status === "pending").length}
            </Card>
          </Col>

          <Col span={8} style={{margin: "8px 0"}}>
            <Card title="Projetos Reprovados" bordered={false}>
              {filteredProjects.filter(e => e.status === "reproved").length}
            </Card>
          </Col>

          <Col span={8} style={{margin: "8px 0"}}>
            <Card title="Projetos Aprovados" bordered={false}>
              {filteredProjects.filter(e => e.status === "notSelected").length}
            </Card>
          </Col>

          <Col span={8} style={{margin: "8px 0"}}>
            <Card title="Projetos Selecionados" bordered={false}>
              {filteredProjects.filter(e => e.status === "selected").length}
            </Card>
          </Col>
        </Row>
      </div>
    </Structure>
  )
};
