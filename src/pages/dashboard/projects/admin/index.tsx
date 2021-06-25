import React, { useEffect, useState } from "react";
import Structure from "../../../../components/layout/structure";
import { ContainerFlex } from "../../../../global/styles";
import { IProject } from "../../../../interfaces/project";
import { listAllProject } from "../../../../services/project_service";
import { Tag, Space, Button, Select, Modal, Input, Row, Col } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import AdminViewProject from "../admin/admin-view-projects";

import MyTable from "../../../../components/layout/table";
import { IPrograms } from "../../../../interfaces/programs";
import { listPrograms } from "../../../../services/program_service";
import { base_url } from "../../../../services/api";
import { newProject } from "../../../../mocks/mockDefaultValue";
import { INotice } from "../../../../interfaces/notice";
import { getAllNotices } from "../../../../services/notice_service";
import { ICategory } from "../../../../interfaces/category";
import { getAllCategories } from "../../../../services/category_service";
import IUser from "../../../../interfaces/user";

const { Option } = Select;

interface IModal
{
  project: IProject;
  visible: boolean;
  category: ICategory | undefined;
}

interface State
{
  notice?: string
  program?: string
  category?: string
}

const Projects: React.FC = () =>
{
  const [projects, setProjects] = useState<IProject[]>([]);
  const [filteredProject, setFilteredProjects] = useState<IProject[]>([]);
  const [category, setCategory] = useState<ICategory>();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [programs, setPrograms] = useState<IPrograms[]>([]);
  const [periods, setPeriods] = useState<INotice[]>([]);
  const [modal, setModal] = useState<IModal>(
  {
    visible: false,
    project: newProject,
    category: undefined
  });

  const [state, setState] = useState<State>({});
  const [initialState, setInitialState] = useState(0);

  useEffect(() =>
  {
    getAllCategories().then((data) => setCategories(data));
    listAllProject().then((data) =>
    {
      setProjects(data);
      setFilteredProjects(data);
      listPrograms().then((listPrograms) =>
        getAllNotices().then((listNotices) =>
        {
          setPrograms(listPrograms.programs);
          setPeriods(listNotices);
        }));
    });
  }, [state]);

  const handleChange = () =>
  {
    setFilteredProjects(projects.filter((p: IProject) =>
    {
      let shouldKeep = true;
      if (state.program !== undefined)
        shouldKeep = shouldKeep && p.programId === state.program;

      if (state.category !== undefined)
      shouldKeep = shouldKeep && (p.category as ICategory)._id === state.category;

      if (state.notice !== undefined)
      shouldKeep = shouldKeep && (p.notice as INotice)._id === state.notice;

      return shouldKeep;
    }));
  };

  const handleFilterByProgram = (program: string) =>
  {
    state.program = program !== "0" ? program : undefined;
    handleChange();
  };

  const handleFilterByNotice = (notice: string) =>
  {
    state.notice = notice !== "0" ? notice : undefined;
    handleChange();
  };

  const handleFilterByCategory = (category: string) =>
  {
    state.category = category !== "0" ? category : undefined;
    handleChange();
  }

  const openModal = (project: IProject) =>
  {
    setInitialState(initialState + 1);
    setCategory(project.category as ICategory);
    setModal({ visible: true, project: project, category: category });
  };

  const closeModal = () => setModal({ visible: false, project: newProject, category: undefined });

  const handleFilterByName = (ev: any) =>
  {
    setFilteredProjects(ev.target.value.length >= 3
      ? projects.filter((p: IProject) =>
          p.name.toLocaleUpperCase().includes(ev.target.value.toLocaleLowerCase()))
      : projects);
  };

  const handleFilterByAuthor = (ev: any) =>
  {
    setFilteredProjects(ev.target.value.length >= 3
      ? projects.filter((p: IProject) =>
          (p.author as IUser)?.name.toLocaleUpperCase().includes(ev.target.value.toLocaleUpperCase()))
      : projects);
  };

  const columns =
  [{
    title: "Nome",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Data de início",
    dataIndex: "dateStart",
    key: "dateStart",
    render: (dateStart: string) => (<>{new Date(dateStart).toLocaleString("pt-BR")}</>)
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (status: string) =>
    {
      switch (status)
      {
        case "pending":
          return (<Tag color="#f9a03f" key="Pendente" style={{ color: "#000" }}>Pendente</Tag>);

        case "reproved":
          return (<Tag color="#acc5cf" key="Reprovado" style={{ color: "#000" }}>Reprovado</Tag>);

        case "notSelected":
          return (<Tag color="#b3afc8" key="AprovadoENãoSelecionado" style={{ color: "#000" }}>Aprovado e não selecionado</Tag>);

        case "selected":
          return (<Tag color="#8dc898" key="EmAndamento" style={{ color: "#000" }}>Selecionado</Tag>);

        case "finished":
          return (<Tag color="#fff" key="Finalizado" style={{ color: "#000" }}>Finalizado</Tag>);
      }
    },
  },
  {
    title: "Ação",
    key: "action",
    render: (text: string, record: IProject) => (
      <Space size="middle">
        <Button onClick={() => openModal(record)}>
          <EyeOutlined /> Revisar
        </Button>
      </Space>),
  }];

  return (
    <Structure title="todas as propostas">
      <Row gutter={[8, 8]}>
        <Col xs={24} lg={12} xl={8}>
          <Select defaultValue="0" style={{ width: "100%" }} onChange={handleFilterByCategory}>
            <Option value="0">Selecione uma Categoria</Option>
            {categories.map((e) =>
            {
              if (e._id !== undefined)
                return (<Option key={e._id} value={e._id}>{e.name}</Option>);
            })}
          </Select>
        </Col>

        <Col xs={24} lg={12} xl={8}>
          <Select defaultValue="0" style={{ width: "100%" }} onChange={handleFilterByProgram}>
            <Option value="0">Selecione um Programa</Option>
            {programs.map((e) =>
            {
              if (e._id !== undefined)
                return (<Option key={e._id} value={e._id}>{e.name}</Option>);
            })}
          </Select>
        </Col>

        <Col xs={24} xl={8}>
          <Select defaultValue="0" style={{ width: "100%" }} onChange={handleFilterByNotice}>
            <Option value="0">Selecione um Edital</Option>
            {periods.map((e) =>
            {
              if (e._id !== undefined)
                return (<Option key={e._id} value={e._id}>{e.name}</Option>);
            })}
          </Select>
        </Col>

        <Col xs={24} md={12} xl={6}>
          <Input placeholder="Nome do autor" style={{ width: "100%" }} onChange={handleFilterByAuthor} />
        </Col>

        <Col xs={24} md={12} xl={6}>
          <Input placeholder="Nome do projeto" style={{ width: "100%" }} onChange={handleFilterByName} />
        </Col>

        <Col xs={12} xl={6}>
          <Button
            block
            type="default"
            shape="round"
            icon={<DownloadOutlined />}
            href={base_url?.concat("extensao/downloadCsv/").concat(state.program !== undefined ? state.program : "")}
          >
            Projetos
          </Button>
        </Col>

        <Col xs={12} xl={6}>
          <Button
            block
            type="default"
            shape="round"
            icon={<DownloadOutlined />}
            href={base_url?.concat("extensao/downloadCSVHours/").concat(state.program !== undefined ? state.program : "")}
          >
            Horários
          </Button>
        </Col>

        <Col span={24}>
          <MyTable data={filteredProject} columns={columns} />
        </Col>
      </Row>

      <Modal
        visible={modal.visible}
        centered={true}
        width="85%"
        footer={<Button onClick={closeModal} type="primary">Sair</Button>}
        onCancel={closeModal}
      >
        <Row>
          <Col span={24}>
            <AdminViewProject project={modal.project} key={initialState} />
          </Col>
        </Row>
      </Modal>
    </Structure>);
};

export default Projects;
