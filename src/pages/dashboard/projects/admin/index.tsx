import React, { useEffect, useState } from "react";
import Structure from "../../../../components/layout/structure";
import { ContainerFlex } from "../../../../global/styles";
import { IProject } from "../../../../interfaces/project";
import { downloadCSV, listAllProject } from "../../../../services/project_service";
import { Tag, Space, Button, Select, Modal, Input } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import AdminViewProject from "../admin/admin-view-projects";

import MyTable from "../../../../components/layout/table";
import { IPrograms } from "../../../../interfaces/programs";
import { listPrograms } from "../../../../services/program_service";
import { base_url } from "../../../../services/api";
import { newProject } from "../../../../mocks/mockDefaultValue";
import { INotice } from "../../../../interfaces/notice";
import { getAllNotices } from "../../../../services/notice_service";
import { ICategory } from "../../../../interfaces/category";
import { getActiveCategories } from "../../../../services/category_service";

const { Option } = Select;

interface IModal {
  project: IProject;
  visible: boolean;
  category: ICategory | undefined;
}
interface State {
  period?: string;
  program?: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [filteredProject, setFilteredProjects] = useState<IProject[]>([]);
  const [category, setCategory] = useState<ICategory>();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [programs, setPrograms] = useState<IPrograms[]>([]);
  const [periods, setPeriods] = useState<INotice[]>([]);
  const [program, setProgram] = useState("");
  const [period, setPeriod] = useState("");
  const [modal, setModal] = useState<IModal>({ visible: false, project: newProject, category: undefined });
  const [state, setState] = useState<State>({
    period: "null",
    program: "null",
  });
  const [initialState, setInitialState] = useState(0);

  useEffect(() => {
    getActiveCategories().then((data) => {
      setCategories(data);
    });
    listAllProject().then((data) => {
      setProjects(data);
      setFilteredProjects(data);
      listPrograms().then((listPrograms) => {
        getAllNotices().then((listNotices) => {
          setPrograms(listPrograms.programs);
          setPeriods(listNotices);
          setProgram("null");
          setPeriod("null");
        });
      });
    });
  }, [state]);

  const handleChange = () => {
    if (state.program != "null" && state.period != "null") {
      const filter = projects.filter((e) => e.programId === state.program && e.noticeId === state.period);
      setFilteredProjects(filter);
    } else if (state.program != "null") {
      const filter = projects.filter((e) => e.programId === state.program);
      setFilteredProjects(filter);
    } else if (state.period != "null") {
      const filter = projects.filter((e) => e.noticeId === state.period);
      console.log();
      setFilteredProjects(filter);
    } else {
      setFilteredProjects(projects);
    }
  };

  const handleProgram = (program: string) => {
    state.program = program;
    handleChange();
  };

  const handlePeriod = (period: string) => {
    state.period = period;
    handleChange();
  };

  const openModal = (project: IProject) => {
    setInitialState(initialState + 1);
    setCategory(categories.find((c) => c._id === project.categoryId));
    setModal({ visible: true, project: project, category: category });
  };

  const closeModal = () => {
    setModal({ visible: false, project: newProject, category: undefined });
  };

  const handleInput = (e: any) => {
    const texto: string = e.target.value;
    if (texto.length >= 3) {
      const filter = projects.filter((e) => e.name.toLocaleLowerCase().includes(texto.toLocaleLowerCase()));
      setFilteredProjects(filter);
    } else {
      setFilteredProjects(projects);
    }
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Data de início",
      dataIndex: "dateStart",
      key: "dateStart",
      render: (dateStart: string) => {
        let date = new Date(dateStart).toLocaleString("pt-BR");
        return <>{date}</>;
      },
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        let typeStatus = { color: "", text: "" };

        if (status === "pending") {
          typeStatus.color = "#f9a03f";
          typeStatus.text = "Pendente";
        } else if (status === "adjust") {
          typeStatus.color = "#e1bc29";
          typeStatus.text = "Correção";
        } else if (status === "reproved") {
          typeStatus.color = "#f71735";
          typeStatus.text = "Reprovado";
        } else if (status === "approved") {
          typeStatus.color = "#40f99b";
          typeStatus.text = "Aprovado";
        } else if (status === "finish") {
          typeStatus.color = "#000000";
          typeStatus.text = "Finalizado";
        }
        return (
          <Tag color={typeStatus.color} key={typeStatus.text}>
            {typeStatus.text}
          </Tag>
        );
      },
    },
    {
      title: "Ação",
      key: "action",
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
        <Select defaultValue="null" style={{ width: 200, margin: "8px 0" }} onChange={handlePeriod}>
          <Option value="null">Selecione um Edital</Option>
          {periods.map((e) => {
            if (e._id !== undefined) {
              return (
                <Option key={e._id} value={e._id}>
                  {e.name}
                </Option>
              );
            }
          })}
        </Select>
        <Select defaultValue="null" style={{ width: 200, margin: "8px 0" }} onChange={handleProgram}>
          <Option value="null">Selecione um Programa</Option>
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
        <Input placeholder="Nome do projeto" onChange={handleInput} />
        {program !== "null" && (
          <Button type="link" target="_blank" href={base_url?.concat("extensao/downloadCsv/").concat(program)}>
            Baixar projetos
          </Button>
        )}
        {program === "null" && (
          <Button type="link" target="_blank" href={base_url?.concat("extensao/downloadCsv/")}>
            Baixar projetos
          </Button>
        )}
        {program !== "null" && (
          <Button type="link" target="_blank" href={base_url?.concat("extensao/downloadCSVHours/").concat(program)}>
            Baixar horários
          </Button>
        )}
        {program === "null" && (
          <Button type="link" target="_blank" href={base_url?.concat("extensao/downloadCSVHours/")}>
            Baixar horários
          </Button>
        )}
      </Space>
      <ContainerFlex>
        <MyTable data={filteredProject} columns={columns} />
      </ContainerFlex>
      <Modal visible={modal.visible} onCancel={closeModal} footer={[]} width="90%" style={{ minHeight: "90%" }}>
        <>
          <AdminViewProject project={modal.project} key={initialState} />
          <Space style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
            <p></p>
            <Button onClick={closeModal} type="primary">
              Sair
            </Button>
          </Space>
        </>
      </Modal>
    </Structure>
  );
};

export default Projects;
