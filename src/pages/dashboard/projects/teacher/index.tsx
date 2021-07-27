import React, { useEffect, useMemo, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import { Tag, Space, Button, notification, Select, Col, Row, Modal, Table } from "antd";
import Structure from "../../../../components/layout/structure";
import { IProject } from "../../../../interfaces/project";
import { deleteProject, listProjectForTeacher } from "../../../../services/project_service";
import { listFeedbackProject } from "../../../../services/feedback_service";

import { Link } from "react-router-dom";
import { IPrograms } from "../../../../interfaces/programs";
import { listPrograms } from "../../../../services/program_service";
import { INotice } from "../../../../interfaces/notice";
import { IRegister } from "../../../../interfaces/feedback";
import { compareDate } from "../../../../util";
import { isReport } from "../../../../interfaces/report";

interface IAction
{
  type: string;
  data?: any
}

interface DialogState
{
  isVisible: boolean;
  title: string;
  content: string;
  isWorking?: boolean;
  targetId?: string;
}

const dialogReducer = (state: DialogState, action: IAction): DialogState =>
{
  switch (action.type)
  {
    case "SHOW_DIALOG":
      return { ...state, isVisible: true };

    case "HIDE_DIALOG":
      return { ...state, isVisible: false };

    case "WORKING":
      return { ...state, isWorking: true };

    case "NOT_WORKING":
      return { ...state, isWorking: false };

    case "SET_CONTENT":
      return (
      {
        ...state,
        title: action.data.title,
        content: action.data.content,
        targetId: action.data.targetId
      });

    default:
      throw new Error();
  }
}

const Projects: React.FC = () =>
{
  const [projects, setProjects] = useState<IProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([]);
  const [programs, setPrograms] = useState<IPrograms[]>([]);
  const [loading, setLoading] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);

  const [infoDialogState, dispatchInfoDialogState] = useReducer(
    dialogReducer,
    {
      isVisible: false,
      title: "",
      content: ""
    });

  const [actionDialogState, dispatchActionDialogState] = useReducer(
    dialogReducer,
    {
      isVisible: false,
      title: "",
      content: "",
      isWorking: false,
      targetId: ""
    });

  useEffect(() =>
  {
    setLoading(true);
    if (shouldReload)
      setShouldReload(false);

    listProjectForTeacher().then((data) =>
    {
      setProjects(data);
      setFilteredProjects(data);
      listPrograms().then((list) =>
      {
        setPrograms(list.programs);
        setLoading(false);
      });
    });
  }, [shouldReload]);

  const infoDialog = useMemo(() =>
  {
    const dialogVisibilityHandler = () =>
      dispatchInfoDialogState({ type: "HIDE_DIALOG" });

    return (
      <Modal
        visible={infoDialogState.isVisible}
        title={infoDialogState.title}
        footer={<Button type="primary" onClick={dialogVisibilityHandler}>OK</Button>}
        onOk={dialogVisibilityHandler}
      >
        <p>{infoDialogState.content}</p>
      </Modal>
    );
  }, [infoDialogState]);

  const actionDialog = useMemo(() =>
  {
    const cancelationHandler = () =>
      dispatchActionDialogState({ type: "HIDE_DIALOG" });

    const confirmationHandler = async (id: string) =>
    {
      dispatchActionDialogState({ type: "WORKING" });

      const response = await deleteProject(id);
      notification[response.result]({ message: response.message });

      dispatchActionDialogState({ type: "NOT_WORKING" });
      dispatchActionDialogState({ type: "HIDE_DIALOG" });

      setShouldReload(true);
    }

    return (
      <Modal
        visible={actionDialogState.isVisible}
        title={actionDialogState.title}
        confirmLoading={actionDialogState.isWorking}
        onCancel={cancelationHandler}
        onOk={async () => await confirmationHandler(actionDialogState.targetId!)}
      >
        <p>{actionDialogState.content}</p>
      </Modal>
    );
  }, [actionDialogState]);

  const handleChange = (event: string) =>
  {
    setFilteredProjects(event !== ""
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
              color="#f9a03f"
              style={{ color: "#000" }}
            >
              Pendente
            </Tag>
          );

        case "reproved":
          return (
            <Tag
              color="#acc5cf"
              style={{ color: "#000" }}
            >
              Não aprovado
            </Tag>
          );

        case "notSelected":
          return (
            <Tag
              color="#b3afc8"
              style={{ color: "#000" }}
            >
              Aprovado e não selecionado
            </Tag>
          );

        case "selected":
          return (
            <Tag
              color="#8dc898"
              style={{ color: "#000" }}
            >
              Selecionado
            </Tag>
          );

        case "finished":
          return (
            <Tag
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
    render: (text: string, project: IProject) =>
    {
      return (
        <Space size="middle">
          {project.status !== "pending" && project.status !== "finished" && (
            <Button
              onClick={async () =>
              {
                let data;
                switch (project.status)
                {
                  case "reproved":
                    const response = await listFeedbackProject(project._id);
                    const justification = response.feedback.registers
                      .filter((r: IRegister) => r.typeFeedback === "user")
                      .sort(compareDate)[0].text;

                    data =
                    {
                      title: "Não aprovado",
                      content: justification
                    };

                    break;

                  case "notSelected":
                    data =
                    {
                      title: "Não selecionado",
                      content:
                        "Professor, seu projeto atende os requisitos da extensão, " +
                        "entretanto não foi possível alocá-lo nas turmas disponíveis."
                    };

                    break;

                  case "selected":
                    data =
                    {
                      title: "Selecionado",
                      content:
                        "Parabéns, seu projeto foi selecionado. " +
                        "Por favor, confira as turmas para as quais " +
                        "foi alocado no edital de resultados."
                    };

                    break;
                }

                dispatchInfoDialogState({ type: "SET_CONTENT", data });
                dispatchInfoDialogState({ type: "SHOW_DIALOG" });
              }}
            >
              Informações
            </Button>
          )}

          {project.status === "selected" &&
            <Button>
              {project.report === undefined
                ? <Link to={`/dashboard/project/report/create?project=${project._id}`}>Relatório</Link>
                : (<Link
                    to={
                    {
                      pathname:
                        `/dashboard/project/report/edit/` +
                        `${isReport(project.report) ? project.report._id : project.report}` +
                        `?project=${project._id}`,

                      state: project.report
                    }}
                  >
                    Relatório
                  </Link>)}
            </Button>
          }

          {(project.notice as INotice).isActive && (project.status === "pending" || project.status === "reproved") && (
            <>
              <Button>
                <Link to={{ pathname: "/dashboard/project/create", state: project }}>Editar</Link>
              </Button>

              <Button
                onClick={() =>
                {
                  dispatchActionDialogState(
                  {
                    type: "SET_CONTENT",
                    data:
                    {
                      title: "Remover projeto",
                      content: `Tem certeza que deseja remover o projeto ${project.name}?`,
                      targetId: project._id
                    }
                  })

                  dispatchActionDialogState({ type: "SHOW_DIALOG" });
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
      {ReactDOM.createPortal(infoDialog, document.getElementById("dialog-overlay")!)}
      {ReactDOM.createPortal(actionDialog, document.getElementById("dialog-overlay")!)}

      <Structure title="Meus Projetos">
        <Row gutter={[8, 8]}>
          <Col xs={24}>
            <Select
              options={
                [{ label: "Sem filtro", value: "" }].concat(programs
                  .filter((p: IPrograms) => p._id !== undefined)
                  .map((p: IPrograms) => ({ label: p.name, value: p._id! })))}
              defaultValue=""
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </Col>

          <Col span={24}>
              <Table loading={loading} dataSource={filteredProjects} columns={columns}/>
          </Col>
        </Row>
      </Structure>
    </>
  );
};

export default Projects;
