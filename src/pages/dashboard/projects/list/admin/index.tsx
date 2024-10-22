import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  Space,
  Table,
  Collapse,
  notification,
  Tag,
} from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";

import { Filters } from "./components/FiltersInput";
import { ProjectDetailsModal } from "./components/ProjectDetailsModal";
import { ReportDetailsModal } from "./components/ReportDetailsModal";
import { ProjectFeedbackModal } from "./components/ProjectFeedbackModal";

import { formatDate } from "../../../../../utils/dateFormatter";
import { useHttpClient } from "../../../../../hooks/useHttpClient";
import Structure from "../../../../../components/layout/structure";
import { StatusTag } from "../../../../../components/StatusTag";
import { Category } from "../../../../../interfaces/category";
import { Notice } from "../../../../../interfaces/notice";
import { Program } from "../../../../../interfaces/program";
import { Project } from "../../../../../interfaces/project";
import { User } from "../../../../../interfaces/user";
import { Feedback } from "../../../../../interfaces/feedback";
import { baseUrl, httpClient } from "../../../../../services/httpClient";
import { getFeedbackEndpoint } from "../../../../../services/endpoints/feedbacks";
import { updateProjectEndpoint } from "../../../../../services/endpoints/projects";
import { ProjectsFilterContext } from "../../../../../context/projects";

export const AllProjects: React.FC = () => {
  const {
    projects,
    setFilteredProjects,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    loading,
    shouldReload,
    setShouldReload,
  } = useContext(ProjectsFilterContext);
  let { queryString } = useContext(ProjectsFilterContext);
  const location = useLocation();

  const [projectNameFilter, setProjectNameFilter] = useState<string>();
  const [authorNameFilter, setAuthorNameFilter] = useState<string>();
  const [categoryFilter, setCategoryFilter] = useState<string>();
  const [noticeFilter, setNoticeFilter] = useState<string>();
  const [programFilter, setProgramFilter] = useState<string>();
  const [yearFilter, setYearFilter] = useState<number>();
  const [semesterFilter, setSemesterFilter] = useState<number>();
  const [projectStatus, setProjectStatus] = useState<
    "reproved" | "notSelected" | "selected"
  >();
  const tableProjectsRequester = useHttpClient();

  const [loadingProjectsBtn, setLoadingProjectsBtn] = useState(false);
  const [loadingHoursBtn, setLoadingHoursBtn] = useState(false);
  const [loadingReportsBtn, setLoadingReportsBtn] = useState(false);
  const [loadingReportsFinishedBtn, setLoadingReportsFinishedBtn] =
    useState(false);

  const [feedbackModalIsVisible, setFeedbackModalIsVisible] = useState(false);
  const [projectModalIsVisible, setProjectModalIsVisible] = useState(false);
  const [reportModalIsVisible, setReportModalIsVisible] = useState(false);
  const [log, setLog] = useState<Feedback>();
  const [project, setProject] = useState<Project>();
  const modalProjectsRequester = useHttpClient();

  const changeProjectStatus = useCallback(
    async (status: "reproved" | "notSelected" | "selected" | undefined) => {
      if (project != null) {
        try {
          await modalProjectsRequester.send({
            ...updateProjectEndpoint(project._id!),
            body: { ...project, status },
            cancellable: true,
          });

          setFeedbackModalIsVisible(false);
          setProjectModalIsVisible(false);
          setShouldReload(shouldReload + 1);

          notification.success({ message: "Avaliação salva com sucesso!" });
        } catch (error) {
          if ((error as Error).message !== "")
            notification.error({ message: (error as Error).message });
        }
      }
    },
    [project, modalProjectsRequester.send]
  );

  const handleProjectReview = useCallback(
    async (verdict: "reproved" | "notSelected" | "selected") => {
      setFeedbackModalIsVisible(true);
      setProjectStatus(verdict);
    },
    [changeProjectStatus]
  );

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

          setLog(log?.feedback);

          setProjectModalIsVisible(true);
        } catch (error) {
          notification.error({
            message: "Não foi possível carregar o projeto para visualização!",
          });
        }
      } else {
        setReportModalIsVisible(true);
      }
    },
    [project, modalProjectsRequester.send]
  );

  const columns = useMemo(
    () => [
      {
        key: "name",
        title: "Nome",
        dataIndex: "name",
      },
      {
        key: "dateStart",
        title: "Data de início",
        render: (text: string, record: Project) =>
          formatDate(new Date(record.dateStart)),
      },
      {
        key: "status",
        title: "Status do projeto",
        render: (text: string, record: Project) => (
          <StatusTag status={record.status} />
        ),
      },
      {
        key: "statusReport",
        title: "Status do relatório",
        render: (text: string, record: Project) => (
          <>
            {((record.status !== "selected" && record.status !== "finished") ||
              (record.status === "selected" &&
                new Date(
                  new Date((record.notice as Notice).reportDeadline).setDate(
                    new Date(
                      (record.notice as Notice).reportDeadline
                    ).getDate() - 1
                  )
                ) > new Date() &&
                !record.report)) && (
              <Tag color="#b3afc8" style={{ color: "#000" }}>
                Não liberado
              </Tag>
            )}
            {new Date() >=
              new Date(
                new Date((record.notice as Notice).reportDeadline).setDate(
                  new Date((record.notice as Notice).reportDeadline).getDate() -
                    1
                )
              ) &&
              record.status === "selected" &&
              !record.report && (
                <Tag color="#f9a03f" style={{ color: "#000" }}>
                  Pendente
                </Tag>
              )}
            {record.report &&
              (record.report.status === "coordinatorAnalysis" ||
                !record.report.status) && (
                <Tag color="#1890ff" style={{ color: "#fff" }}>
                  Em análise coordenador
                </Tag>
              )}
            {record.report && record.report.status === "supervisorAnalysis" && (
              <Tag color="#2709ad" style={{ color: "#fff" }}>
                Em análise supervisor
              </Tag>
            )}
            {record.report && record.report.status === "waitingCorrections" && (
              <Tag color="#fe4c47" style={{ color: "#fff" }}>
                Aguardando correções
              </Tag>
            )}
            {record.report && record.report.status === "approved" && (
              <Tag color="#8dc898" style={{ color: "#000" }}>
                Aprovado
              </Tag>
            )}
          </>
        ),
      },
      {
        key: "action",
        title: "Ação",
        render: (text: string, record: Project) => (
          <Space size="small">
            <Button>
              <Link
                to={{
                  pathname: `${location.pathname}/editar/${record._id}`,
                  state: { project: record, context: "admin" },
                }}
              >
                Editar
              </Link>
            </Button>

            <Button
              onClick={() => {
                openDetailsModal("project", record);
              }}
            >
              <EyeOutlined /> Proposta
            </Button>

            {record.report != null && (
              <Button onClick={() => openDetailsModal("report", record)}>
                <EyeOutlined /> Relatório
              </Button>
            )}
          </Space>
        ),
      },
    ],
    [location.pathname, openDetailsModal]
  );

  const generateProjectsTable = () => {
    setLoadingProjectsBtn(true);
    httpClient
      .request({
        url: `/project/downloadProjects/?${queryString}`,
        method: "get",
        responseType: "blob",
      })
      .then((res) => {
        const href = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "Projetos.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch((err) => {
        console.log(err);
        notification.error({ message: "Ocorreu um erro ao gerar a tabela." });
      })
      .finally(() => {
        setLoadingProjectsBtn(false);
      });
  };

  const generateHoursTable = () => {
    setLoadingHoursBtn(true);
    httpClient
      .request({
        url: `/project/downloadHours/?${queryString}`,
        method: "get",
        responseType: "blob",
      })
      .then((res) => {
        const href = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "Horários.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch((err) => {
        console.log(err);
        notification.error({ message: "Ocorreu um erro ao gerar a tabela." });
      })
      .finally(() => {
        setLoadingHoursBtn(false);
      });
  };

  const generateReportsTable = () => {
    setLoadingReportsBtn(true);
    httpClient
      .request({
        url: `/project/report/download/?${queryString}`,
        method: "get",
        responseType: "blob",
      })
      .then((res) => {
        const href = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "Relatórios.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch((err) => {
        console.log(err);
        notification.error({ message: "Ocorreu um erro ao gerar a tabela." });
      })
      .finally(() => {
        setLoadingReportsBtn(false);
      });
  };

  const generateReportsFinishedTable = () => {
    setLoadingReportsFinishedBtn(true);
    httpClient
      .request({
        url: `/project/report/downloadFinished/?${queryString}`,
        method: "get",
        responseType: "blob",
      })
      .then((res) => {
        const href = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "Relatórios de finalizados.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch((err) => {
        console.log(err);
        notification.error({ message: "Ocorreu um erro ao gerar a tabela." });
      })
      .finally(() => {
        setLoadingReportsFinishedBtn(false);
      });
  };

  useEffect(() => {
    return () => {
      modalProjectsRequester.halt();
      tableProjectsRequester.halt();
    };
  }, []);
  //   if (shouldReload) {
  //     (async () => {
  //       const projects = await tableProjectsRequester.send({
  //         // ...getAllProjectsEndpoint(),
  //         // queryParams: new Map([["withPopulatedRefs", "true"]]),
  //         ...getAllProjectsPaginatedEndpoint(),
  //         queryParams: new Map([
  //           ["page", String(page)],
  //           ["limit", "10"],
  //         ]),
  //         cancellable: true,
  //       });
  //       setTotalPages(projects.totalPages);
  //       setProjects(projects.docs ?? []);
  //       setShouldReload(false);
  //     })();
  //   }
  // }, [shouldReload, tableProjectsRequester.send, page]);

  useEffect(() => {
    setFilteredProjects(
      projects
        .map((p: Project) => ({ key: p._id!, ...p }))
        .filter(
          (p: Project) =>
            authorNameFilter == null ||
            (p.author as User)?.name
              .toLocaleUpperCase()
              .includes(authorNameFilter.toLocaleUpperCase())
        )

        .filter(
          (p: Project) =>
            categoryFilter == null ||
            (p.category as Category)._id === categoryFilter
        )

        .filter(
          (p: Project) =>
            noticeFilter == null || (p.notice as Notice)._id === noticeFilter
        )

        .filter(
          (p: Project) =>
            programFilter == null ||
            (p.program as Program)._id === programFilter
        )

        .filter(
          (p: Project) =>
            projectNameFilter == null ||
            p.name
              .toLocaleUpperCase()
              .includes(projectNameFilter.toLocaleUpperCase())
        )

        .filter(
          (p: Project) =>
            semesterFilter == null ||
            (new Date(p.dateStart).getMonth() < 6 ? 1 : 2) === semesterFilter
        )

        .filter(
          (p: Project) =>
            yearFilter == null ||
            new Date(p.dateStart).getFullYear() === yearFilter
        )
    );
  }, [
    authorNameFilter,
    categoryFilter,
    noticeFilter,
    programFilter,
    projects,
    projectNameFilter,
    semesterFilter,
    yearFilter,
  ]);

  return (
    <>
      <ProjectFeedbackModal
        projectStatus={projectStatus}
        projectRef={project?._id}
        isVisible={feedbackModalIsVisible}
        onSuccess={() => changeProjectStatus(projectStatus)}
        onError={(message: string) => notification.error({ message })}
        onCancel={() => setFeedbackModalIsVisible(false)}
      />

      <ProjectDetailsModal
        log={log}
        project={project}
        isVisible={projectModalIsVisible}
        onReview={handleProjectReview}
        onClose={() => setProjectModalIsVisible(false)}
      />

      <ReportDetailsModal
        project={project}
        isVisible={reportModalIsVisible}
        onClose={() => setReportModalIsVisible(false)}
      />

      <Structure title="Todas as propostas">
        <Row gutter={[0, 8]}>
          <Col span={24}>
            <Collapse bordered={false} expandIconPosition="right">
              <Collapse.Panel
                key="Filtros"
                header="Filtros"
                style={{ borderBottom: "0" }}
              >
                <Filters />
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>

        <Row gutter={[8, 24]}>
          <Col xs={24} lg={6}>
            <Button
              block
              shape="round"
              target="blank"
              onClick={generateProjectsTable}
              loading={loadingProjectsBtn}
            >
              <DownloadOutlined /> Projetos
            </Button>
          </Col>

          <Col xs={24} lg={6}>
            <Button
              block
              shape="round"
              onClick={generateHoursTable}
              loading={loadingHoursBtn}
              target="blank"
            >
              <DownloadOutlined /> Horários
            </Button>
          </Col>

          <Col xs={24} lg={6}>
            <Button
              block
              shape="round"
              target="blank"
              onClick={generateReportsTable}
              loading={loadingReportsBtn}
            >
              <DownloadOutlined /> Relatórios
            </Button>
          </Col>

          <Col xs={24} lg={6}>
            <Button
              block
              shape="round"
              target="blank"
              onClick={generateReportsFinishedTable}
              loading={loadingReportsFinishedBtn}
            >
              <DownloadOutlined /> Relatórios finalizados
            </Button>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Table
              loading={loading}
              columns={columns}
              dataSource={projects}
              pagination={{
                current: page,
                defaultPageSize: 10,
                defaultCurrent: 1,
                pageSize: limit,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "30", "50"],
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
