import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { Tag, Space, Button, Spin, notification, Select, Col, Row, Modal } from "antd";
import Structure from "../../../../components/layout/structure";
import { IProject } from "../../../../interfaces/project";
import { deleteProject, listProjectForTeacher } from "../../../../services/project_service";
import { listFeedbackProject } from "../../../../services/feedback_service";

import MyTable from "../../../../components/layout/table";
import { Link } from "react-router-dom";
import { IPrograms } from "../../../../interfaces/programs";
import { listPrograms } from "../../../../services/program_service";
import { INotice } from "../../../../interfaces/notice";
import { IRegister } from "../../../../interfaces/feedback";
import { compareDate } from "../../../../util";

const { Option } = Select;

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([]);
  const [programs, setPrograms] = useState<IPrograms[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: "", content: "" });
  const [initialState, setInitialState] = useState(0);

  useEffect(() =>
  {
    setLoading(true);
    listProjectForTeacher().then((data) =>
    {
      setProjects(data);
      setFilteredProjects(data);
      listPrograms().then((list) =>
      {
        setPrograms(list.programs);
        setTimeout(() => setLoading(false), 2000);
      });
    });
  }, [initialState]);

  const dialog = useMemo(() =>
  {
    const dialogVisibilityHandler = () => setShowDialog(false);

    return (
      <Modal
        visible={showDialog}
        title={dialogContent.title}
        footer={<Button type="primary" onClick={dialogVisibilityHandler}>OK</Button>}
        onOk={dialogVisibilityHandler}
      >
        <p>{dialogContent.content}</p>
      </Modal>
    );
  }, [showDialog, dialogContent]);

  const handleChange = (event: string) =>
  {
    setFilteredProjects(event !== "null"
      ? projects.filter((p: IProject) => p.programId === event)
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
    render: (dateStart: string) => new Date(dateStart).toLocaleString("pt-BR")
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
          return (
            <Tag
              key="Pendente"
              color="#f9a03f"
              style={{ color: "#000" }}
            >
              Pendente
            </Tag>
          );

        case "reproved":
          return (
            <Tag
              key="Reprovado"
              color="#acc5cf"
              style={{ color: "#000" }}
            >
              Reprovado
            </Tag>
          );

        case "notSelected":
          return (
            <Tag
              key="AprovadoENãoSelecionado"
              color="#b3afc8"
              style={{ color: "#000" }}
            >
              Aprovado e não selecionado
            </Tag>
          );

        case "selected":
          return (
            <Tag
              key="EmAndamento"
              color="#8dc898"
              style={{ color: "#000" }}
            >
              Selecionado
            </Tag>
          );

        case "finished":
          return (
            <Tag
              key="Finalizado"
              color="#fff"
              style={{ color: "#000" }}
            >
              Finalizado
            </Tag>
          );
      }
    },
  },
  {
    title: "Ação",
    key: "action",
    render: (text: string, record: IProject) =>
    {
      return (
        <Space size="middle">
          {record.status !== "pending" && record.status !== "finished" && (
            <Button
              onClick={async () =>
              {
                switch (record.status)
                {
                  case "reproved":
                    const response = await listFeedbackProject(record._id);
                    const denialJustification = response.feedback.registers
                      .filter((r: IRegister) => r.typeFeedback === "user")
                      .sort(compareDate)[0].text;

                    setDialogContent(
                    {
                      title: "Não aprovado",
                      content: denialJustification
                    });

                    break;

                  case "notSelected":
                    setDialogContent(
                    {
                      title: "Não selecionado",
                      content:
                        "Professor, seu projeto atende os requisitos da extensão, " +
                        "entretanto não foi possível alocá-lo nas turmas disponíveis."
                    });

                    break;

                  case "selected":
                    setDialogContent(
                    {
                      title: "Selecionado",
                      content:
                        "Parabéns, seu projeto foi selecionado. " +
                        "Por favor, confira as turmas para as quais " +
                        "foi alocado no edital de resultados."
                    });

                    break;
                }

                setShowDialog(true);
              }}
            >
              Informações
            </Button>
          )}

          {(record.notice as INotice).isActive && (record.status === "pending" || record.status === "reproved") && (
            <>
              <Button>
                <Link to={{ pathname: "/dashboard/project/create", state: record }}>Editar</Link>
              </Button>

              <Button
                onClick={async () =>
                {
                  const deleted = await deleteProject(record._id);

                  notification[deleted.result]({ message: deleted.message });
                  setInitialState(initialState + 1);
                }}
              >
                Deletar
              </Button>
            </>
          )}
        </Space>
    )},
  }];

  return (
    <>
      {ReactDOM.createPortal(dialog, document.getElementById("dialog-overlay")!)}

      <Structure title="Meus Projetos">
        <Row gutter={[8, 8]}>
          <Col xs={24}>
            <Select defaultValue="null" onChange={handleChange} style={{ width: "100%" }}>
              <Option value="null">Sem filtro</Option>
              {programs.map((e) =>
              {
                if (e._id !== undefined)
                  return (<Option key={e._id} value={e._id}>{e.name}</Option>);
              })}
            </Select>
          </Col>

          <Col span={24} style={loading ? { width: "100%", display: "flex", justifyContent: "center" } : {}}>
            {loading
              ? <Spin />
              : <MyTable data={filteredProjects} columns={columns}/>}
          </Col>
        </Row>
      </Structure>
    </>
  );
};

export default Projects;
