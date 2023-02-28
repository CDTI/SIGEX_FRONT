import React, { useEffect, useState } from "react";
import { Card, Col, Row, Select } from "antd";

import { Program } from "../../../interfaces/program";
import { listPrograms } from "../../../services/program_service";
import { countProjects } from "../../../services/project_service";
import Structure from "../../../components/layout/structure";

const { Option } = Select;

interface IProjectsCount {
  total: number;
  pendentes: number;
  reprovados: number;
  aprovados: number;
  selecionados: number;
}

export const HomeDashboard: React.FC = () => {
  const [projectsCount, setProjectsCount] = useState<IProjectsCount>();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programFilter, setProgramFilter] = useState<string>("");

  async function LoadProjectsCount() {
    const response = await listPrograms();
    setPrograms(response.programs);

    const projects = await countProjects(programFilter);
    setProjectsCount(projects);
  }

  useEffect(() => {
    try {
      LoadProjectsCount();
    } catch (error) {
      console.log(error);
    } finally {
    }
  }, [programFilter]);

  const handleChange = (event: any) => {
    setProgramFilter(event);
  };

  return (
    <Structure title="dashboard">
      <div>
        <Select
          defaultValue="Selecione"
          style={{ width: 200, margin: "8px 0" }}
          onChange={handleChange}
        >
          <Option value={""}>Selecione</Option>
          {programs.map((e) => {
            if (e._id !== undefined) {
              return (
                <Option key={e._id} value={e._id}>
                  {e.name}
                </Option>
              );
            }
          })}
        </Select>
      </div>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8} style={{ margin: "8px 0" }}>
            <Card title="Total de projetos" bordered={false}>
              {projectsCount?.total}
            </Card>
          </Col>

          <Col span={8} style={{ margin: "8px 0" }}>
            <Card title="Projetos Pendentes" bordered={false}>
              {projectsCount?.pendentes}
            </Card>
          </Col>

          <Col span={8} style={{ margin: "8px 0" }}>
            <Card title="Projetos Reprovados" bordered={false}>
              {projectsCount?.reprovados}
            </Card>
          </Col>

          <Col span={8} style={{ margin: "8px 0" }}>
            <Card title="Projetos Aprovados" bordered={false}>
              {projectsCount?.aprovados}
            </Card>
          </Col>

          <Col span={8} style={{ margin: "8px 0" }}>
            <Card title="Projetos Selecionados" bordered={false}>
              {projectsCount?.selecionados}
            </Card>
          </Col>
        </Row>
      </div>
    </Structure>
  );
};
