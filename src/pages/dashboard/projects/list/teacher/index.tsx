import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import {
  Space,
  Button,
  notification,
  Select,
  Col,
  Row,
  Modal,
  Table,
  Form,
} from "antd";

import { Register } from "../../../../../interfaces/feedback";
import { Notice } from "../../../../../interfaces/notice";
import { Program } from "../../../../../interfaces/program";
import { Project } from "../../../../../interfaces/project";
import { listFeedbackProject } from "../../../../../services/feedback_service";
import { listPrograms } from "../../../../../services/program_service";
import {
  deleteProject,
  listAllTeacherProjects,
} from "../../../../../services/project_service";
import Structure from "../../../../../components/layout/structure";
import { formatDate } from "../../../../../utils/dateFormatter";
import { StatusTag } from "../../../../../components/StatusTag";
import { useHttpClient } from "../../../../../hooks/useHttpClient";
import { getFeedbackEndpoint } from "../../../../../services/endpoints/feedbacks";
import { ProjectDetailsModal } from "../admin/components/ProjectDetailsModal";
import { EyeOutlined } from "@ant-design/icons";
import { Category } from "../../../../../interfaces/category";
import { getAllCategories } from "../../../../../services/category_service";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import { AuthContext } from "../../../../../context/auth";
import { User } from "../../../../../interfaces/user";

interface IAction {
  type: string;
  data?: any;
}

interface DialogState {
  isVisible: boolean;
  title: string;
  content: string;
  isWorking?: boolean;
  targetId?: string;
}

const dialogReducer = (state: DialogState, action: IAction): DialogState => {
  switch (action.type) {
    case "SHOW_DIALOG":
      return { ...state, isVisible: true };

    case "HIDE_DIALOG":
      return { ...state, isVisible: false };

    case "WORKING":
      return { ...state, isWorking: true };

    case "NOT_WORKING":
      return { ...state, isWorking: false };

    case "SET_CONTENT":
      return {
        ...state,
        title: action.data.title,
        content: action.data.content,
        targetId: action.data.targetId,
      };

    default:
      throw new Error();
  }
};

export const TeacherProjectsPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [form] = useForm();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filterProgram, setFilterProgram] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [shouldReload, setShouldReload] = useState(0);
  const [project, setProject] = useState<Project>();
  const modalProjectsRequester = useHttpClient();
  const [projectModalIsVisible, setProjectModalIsVisible] = useState(false);
  let query = {
    page: page,
    limit: limit,
    program: filterProgram,
    category: filterCategory,
  };

  const [infoDialogState, dispatchInfoDialogState] = useReducer(dialogReducer, {
    isVisible: false,
    title: "",
    content: "",
  });

  const [actionDialogState, dispatchActionDialogState] = useReducer(
    dialogReducer,
    {
      isVisible: false,
      title: "",
      content: "",
      isWorking: false,
      targetId: "",
    }
  );

  useEffect(() => {
    (async () => {
      getPaginatedTeacherProjects(query);
      listPrograms().then((list) => {
        setPrograms(list);
      });
      getAllCategories().then((res) => {
        setCategories(res);
      });
    })();
  }, [page, limit, shouldReload]);

  const getPaginatedTeacherProjects = async (data: any) => {
    setLoading(true);
    listAllTeacherProjects(data)
      .then((res) => {
        setProjects(res.docs);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: "Ocorreu um erro durante a busca dos projetos",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearFilters = () => {
    setPage(1);
    setLimit(10);
    setFilterCategory("");
    setFilterProgram("");
    setShouldReload(shouldReload + 1);
    form.resetFields();
  };

  const infoDialog = useMemo(() => {
    const dialogVisibilityHandler = () =>
      dispatchInfoDialogState({ type: "HIDE_DIALOG" });

    return (
      <Modal
        visible={infoDialogState.isVisible}
        title={infoDialogState.title}
        footer={
          <Button type="primary" onClick={dialogVisibilityHandler}>
            OK
          </Button>
        }
        onOk={dialogVisibilityHandler}
      >
        <p>{infoDialogState.content}</p>
      </Modal>
    );
  }, [infoDialogState]);

  const openDetailsModal = useCallback(
    async (type: "project" | "report", project: Project) => {
      setProject(project);
      if (type === "project") {
        try {
          const log = await modalProjectsRequester.send({
            ...getFeedbackEndpoint(project._id!),
            queryParams: new Map([["withPopulatedRefs", "true"]]),
            cancellable: true,
          });
          setProjectModalIsVisible(true);
        } catch (error) {
          notification.error({
            message: "Não foi possível carregar o projeto para visualização!",
          });
        }
      }
    },
    [project, modalProjectsRequester.send]
  );

  const actionDialog = useMemo(() => {
    const cancelationHandler = () =>
      dispatchActionDialogState({ type: "HIDE_DIALOG" });

    const confirmationHandler = async (id: string) => {
      dispatchActionDialogState({ type: "WORKING" });

      const response = await deleteProject(id);
      notification[response.result]({ message: response.message });

      dispatchActionDialogState({ type: "NOT_WORKING" });
      dispatchActionDialogState({ type: "HIDE_DIALOG" });

      setShouldReload(shouldReload + 1);
    };

    return (
      <Modal
        visible={actionDialogState.isVisible}
        title={actionDialogState.title}
        confirmLoading={actionDialogState.isWorking}
        onCancel={cancelationHandler}
        onOk={async () =>
          await confirmationHandler(actionDialogState.targetId!)
        }
      >
        <p>{actionDialogState.content}</p>
      </Modal>
    );
  }, [actionDialogState]);

  const columns = [
    {
      key: "name",
      title: "Nome",
      dataIndex: "name",
    },
    {
      key: "dateStart",
      title: "Data de início",
      dataIndex: "dateStart",
      render: (dateStart: string) => formatDate(new Date(dateStart)),
    },
    {
      key: "status",
      title: "Avaliação",
      dataIndex: "status",
      render: (text: string, record: Project) => (
        <StatusTag status={record.status} />
      ),
    },
    {
      key: "action",
      title: "Ação",
      render: (text: string, record: Project) => (
        <Space size="middle">
          {record.status !== "pending" && record.status !== "finished" && (
            <Button
              onClick={async () => {
                let data;
                const justification = await listFeedbackProject(
                  record._id!
                ).then((response) => {
                  const hasUserJustification =
                    response.feedback.registers.filter(
                      (r: Register) => r.typeFeedback === "user"
                    ).length > 0;
                  if (hasUserJustification) {
                    return response.feedback.registers
                      .filter((r: Register) => r.typeFeedback === "user")
                      .slice(-1)[0].text;
                  }
                });
                switch (record.status) {
                  case "reproved":
                    data = { title: "Não aprovado", content: justification };
                    break;
                  case "notSelected":
                    data = {
                      title: "Não selecionado",
                      content:
                        justification !== ""
                          ? justification
                          : "Professor, seu projeto atende os requisitos da extensão, " +
                            "entretanto não foi possível alocá-lo nas turmas disponíveis.",
                    };
                    break;
                  case "selected":
                    data = {
                      title: "Selecionado",
                      content:
                        justification !== ""
                          ? justification
                          : "Parabéns, seu projeto foi selecionado. " +
                            "Por favor, confira as turmas para as quais " +
                            "foi alocado no edital de resultados.",
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

          <Button onClick={() => openDetailsModal("project", record)}>
            <EyeOutlined /> Proposta
          </Button>

          {record.status === "selected" && (
            <>
              {((record.author as User)._id === user?._id ||
                record.teachers.length === 1) && (
                <Button>
                  {record.report == null ? (
                    <Link
                      to={`/propostas/relatorio/criar?project=${record._id}`}
                    >
                      Relatório
                    </Link>
                  ) : (
                    <Link
                      to={{
                        pathname: `/propostas/relatorio/editar/${record.report._id}?project=${record._id}`,
                        state: record.report,
                      }}
                    >
                      Relatório
                    </Link>
                  )}
                </Button>
              )}
            </>
          )}

          {record.status === "pending" && (
            <>
              {(record.notice as Notice).isActive &&
                (record.author as User)._id === user?._id && (
                  <>
                    <Button>
                      <Link
                        to={{
                          pathname: `/propostas/editar/${record._id}`,
                          state: {
                            project: record,
                            context: "user",
                          },
                        }}
                      >
                        Editar
                      </Link>
                    </Button>

                    <Button
                      onClick={() => {
                        dispatchActionDialogState({
                          type: "SET_CONTENT",
                          data: {
                            title: "Remover projeto",
                            content: `Tem certeza que deseja remover o projeto ${record.name}?`,
                            targetId: record._id,
                          },
                        });
                        dispatchActionDialogState({ type: "SHOW_DIALOG" });
                      }}
                    >
                      Deletar
                    </Button>
                  </>
                )}
              {/* {((!(record.notice as Notice).isActive &&
                (record.author as User)._id === user?._id) ||
                (record.author as User)._id !== user?._id) && (
                <>
                  <Button onClick={() => openDetailsModal("project", record)}>
                    <EyeOutlined /> Proposta
                  </Button>
                </>
              )} */}
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      {ReactDOM.createPortal(
        infoDialog,
        document.getElementById("dialog-overlay")!
      )}
      {ReactDOM.createPortal(
        actionDialog,
        document.getElementById("dialog-overlay")!
      )}
      <ProjectDetailsModal
        project={project}
        isVisible={projectModalIsVisible}
        onReview={() => {}}
        onClose={() => setProjectModalIsVisible(false)}
      />
      <Structure title="Meus Projetos">
        <Form form={form} onFinish={() => getPaginatedTeacherProjects(query)}>
          <Row justify="center" gutter={[8, 8]}>
            <Col span={12}>
              <Form.Item name="Program" style={{ margin: 0 }}>
                <Select
                  options={[
                    { label: "Selecione um programa", value: "" },
                  ].concat(
                    programs
                      .filter((p: Program) => p._id !== undefined)
                      .map((p: Program) => ({ label: p.name, value: p._id! }))
                  )}
                  defaultValue=""
                  onChange={(e) => {
                    setFilterProgram(e);
                  }}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="Category" style={{ margin: 0 }}>
                <Select
                  options={[
                    { label: "Selecione uma categoria", value: "" },
                  ].concat(
                    categories
                      .filter((c: Category) => c._id !== undefined)
                      .map((c: Category) => ({ label: c.name, value: c._id! }))
                  )}
                  defaultValue=""
                  onChange={(e) => {
                    setFilterCategory(e);
                  }}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Button block type="primary" htmlType="submit">
                <SearchOutlined />
                Pesquisar
              </Button>
            </Col>
            <Col xs={24}>
              <Button
                block
                type="primary"
                htmlType="button"
                onClick={clearFilters}
              >
                <ClearOutlined />
                Limpar Filtros
              </Button>
            </Col>
          </Row>
        </Form>

        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Table
              loading={loading}
              dataSource={projects}
              columns={columns}
              pagination={{
                current: page,
                defaultPageSize: 10,
                defaultCurrent: 1,
                pageSize: limit,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "30"],
                total: totalPages * limit,
                onChange: (actualPage, actualLimit) => {
                  setPage(actualPage);
                  setLimit(actualLimit!);
                },
              }}
            />
          </Col>
        </Row>
      </Structure>
    </>
  );
};
