import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Select, Spin } from "antd";

import { Program } from "../../../interfaces/program";
import { listPrograms } from "../../../services/program_service";
import { countProjects } from "../../../services/project_service";
import Structure from "../../../components/layout/structure";
import { useForm } from "antd/lib/form/Form";
import { getAllDisciplines } from "../../../services/discipline_service";
import { Discipline } from "../../../interfaces/discipline";
import { Project } from "../../../interfaces/project";
import { User } from "../../../interfaces/user";
import Text from "antd/lib/typography/Text";

const { Option } = Select;

interface IProjectsCount {
  total: Project[];
  pendentes: Project[];
  reprovados: Project[];
  aprovados: Project[];
  selecionados: Project[];
}

export interface ISearchDashboardProjects {
  program: string | undefined;
  discipline: string | undefined;
  semester: string | undefined;
}

export const HomeDashboard: React.FC = () => {
  const [projectsCount, setProjectsCount] = useState<IProjectsCount>();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [resultsData, setResultsData] = useState({
    teachers: 0,
    students: 0,
    teams: 0,
    communityPeople: 0,
    affectedPeople: 0,
    reports: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const [form] = useForm();
  const [search, setSearch] = useState<ISearchDashboardProjects>({
    discipline: undefined,
    program: undefined,
    semester: undefined,
  });

  async function LoadProjectsCount(data: ISearchDashboardProjects) {
    setLoading(true);
    const programs = await listPrograms();
    const disciplines = await getAllDisciplines();
    setPrograms(programs);
    setDisciplines(disciplines);
    const projects: IProjectsCount = await countProjects(data);
    const projectsWithReports = projects.total.filter(
      (project: Project) => !!project.report
    );
    const results = {
      teachers: 0,
      students: 0,
      teams: 0,
      communityPeople: 0,
      affectedPeople: 0,
      reports: projectsWithReports.length,
    };

    const uniqueTeachersSet = new Set<string>();

    projectsWithReports.forEach((project: Project) => {
      const authorKey = `${(project.author as User).name} - ${
        (project.author as User)._id
      }`;

      if (project.report?.students && project.report.students > 0) {
        results.students += project.report.students;
      }
      if (project.report?.teams && project.report.teams > 0) {
        results.teams += project.report.teams;
      }
      if (
        project.report?.communityPeople &&
        project.report.communityPeople > 0
      ) {
        results.communityPeople += project.report.communityPeople;
      }
      if (project.report?.affectedPeople && project.report.affectedPeople > 0) {
        results.affectedPeople += project.report.affectedPeople;
      }

      const teachers: User[] | User = project.teachers;

      if (Array.isArray(teachers) && teachers.length > 0) {
        teachers.forEach((teacher) => {
          const teacherKey = `${teacher.name} - ${teacher._id}`;
          if (!uniqueTeachersSet.has(teacherKey)) {
            uniqueTeachersSet.add(teacherKey);
            results.teachers += 1;
          }
        });
      } else if (!Array.isArray(teachers) && !!teachers) {
        const teacherKey = `${(teachers as User).name} - ${
          (teachers as User)._id
        }`;
        if (!uniqueTeachersSet.has(teacherKey)) {
          uniqueTeachersSet.add(teacherKey);
          results.teachers += 1;
        }
      }

      if (!uniqueTeachersSet.has(authorKey)) {
        uniqueTeachersSet.add(authorKey);
        results.teachers += 1;
      }
    });
    setResultsData(results);
    setProjectsCount(projects);
    setLoading(false);
  }

  useEffect(() => {
    try {
      LoadProjectsCount(search);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSubmit = (data: ISearchDashboardProjects) => {
    LoadProjectsCount(data);
    setSearch(data);
  };

  return (
    <Structure title="dashboard">
      <div>
        <Form
          form={form}
          onFinish={handleSubmit}
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Form.Item name={"program"}>
            <Select
              defaultValue="Selecione um programa"
              style={{ width: 200, margin: "8px 0" }}
              showSearch
              optionFilterProp="label"
              options={programs.map((program) => ({
                label: program.name,
                value: program._id!,
                key: program._id!,
              }))}
            ></Select>
          </Form.Item>
          <Form.Item name={"discipline"}>
            <Select
              defaultValue="Selecione uma disciplina"
              style={{ width: 200, margin: "8px 0" }}
              showSearch
              optionFilterProp="label"
              options={disciplines.map((discipline) => ({
                label: discipline.name,
                value: discipline._id!,
                key: discipline._id!,
              }))}
            ></Select>
          </Form.Item>
          <Form.Item name={"semester"}>
            <Select
              defaultValue="Selecione um semestre"
              style={{ width: 200, margin: "8px 0" }}
            >
              <Option value={""}>Selecione um semestre</Option>
              <Option key={"1° Semestre"} value={"1° Semestre"}>
                {"1° Semestre"}
              </Option>
              <Option key={"2° Semestre"} value={"2° Semestre"}>
                {"2° Semestre"}
              </Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Pesquisar
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="button"
              onClick={() => {
                form.resetFields();
                LoadProjectsCount({
                  discipline: undefined,
                  program: undefined,
                  semester: undefined,
                });
              }}
            >
              Limpar Filtros
            </Button>
          </Form.Item>
        </Form>
      </div>
      {loading ? (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "50vh",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Spin tip="Carregando" size="large"></Spin>
        </div>
      ) : (
        <div className="site-card-wrapper">
          <Row gutter={16}>
            <Col span={8}>
              <Card title="Total de projetos" bordered={true} size="small">
                {projectsCount?.total.length}
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Projetos Pendentes" bordered={true} size="small">
                {projectsCount?.pendentes.length}
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Projetos Reprovados" bordered={true} size="small">
                {projectsCount?.reprovados.length}
              </Card>
            </Col>

            <Col span={8}>
              <Card
                title="Projetos Aprovados e Não selecionados"
                bordered={true}
                size="small"
              >
                {projectsCount?.aprovados.length}
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Projetos Selecionados" bordered={true} size="small">
                {projectsCount?.selecionados.length}
              </Card>
            </Col>

            <Col span={8}>
              <Card
                title="Professores com projetos selecionados"
                bordered={true}
                size="small"
              >
                {resultsData?.teachers}
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Alunos" bordered={true} size="small">
                {resultsData?.students}
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Equipes" bordered={true} size="small">
                {resultsData?.teams}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="Pessoas com interação direta"
                bordered={true}
                size="small"
              >
                {resultsData?.communityPeople}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="Aproximado de pessoas impactadas"
                bordered={true}
                size="small"
              >
                {resultsData?.affectedPeople}
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Relatórios entregues" bordered={true} size="small">
                {resultsData?.reports}
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </Structure>
  );
};
