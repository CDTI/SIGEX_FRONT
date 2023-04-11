import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Row, Col, Space, Table, Collapse, notification } from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";

import { Field, Filters } from "./components/FiltersInput";
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
import { baseUrl } from "../../../../../services/httpClient";
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

  const setFilter = useCallback((field: Field, value: string) => {
    switch (field) {
      case "AUTHOR":
        setAuthorNameFilter(value !== "" ? value : undefined);
        break;

      case "CATEGORY":
        setCategoryFilter(value !== "" ? value : undefined);
        break;

      case "NAME":
        setProjectNameFilter(value !== "" ? value : undefined);
        break;

      case "NOTICE":
        setNoticeFilter(value !== "" ? value : undefined);
        break;

      case "PROGRAM":
        setProgramFilter(value !== "" ? value : undefined);
        break;

      case "SEMESTER":
        setSemesterFilter(value !== "" ? Number(value) : undefined);
        break;

      case "YEAR":
        setYearFilter(value !== "" ? Number(value) : undefined);
        break;
    }
  }, []);

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
        title: "Avaliação",
        render: (text: string, record: Project) => (
          <StatusTag status={record.status} />
        ),
      },
      {
        key: "action",
        title: "Ação",
        render: (text: string, record: Project) => (
          <Space size="middle">
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
                console.log(record);
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

  useEffect(() => {
    return () => {
      modalProjectsRequester.halt();
      tableProjectsRequester.halt();
    };
  }, []);

  // useEffect(() => {
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
                <Filters onFilterBy={setFilter} />
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>

        <Row gutter={[8, 24]}>
          <Col xs={24} lg={8}>
            <Button
              block
              shape="round"
              href={`${baseUrl}/downloadCsv/?${queryString}`}
              target="blank"
            >
              <DownloadOutlined /> Projetos
            </Button>
          </Col>

          <Col xs={24} lg={8}>
            <Button
              block
              shape="round"
              href={`${baseUrl}/downloadCsvHours/?${queryString}`}
              target="blank"
            >
              <DownloadOutlined /> Horários
            </Button>
          </Col>

          <Col xs={24} lg={8}>
            <Button
              block
              shape="round"
              href={`${baseUrl}/project/report/download/${programFilter ?? ""}`}
              target="blank"
            >
              <DownloadOutlined /> Relatórios
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
