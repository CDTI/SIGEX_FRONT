import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import { Button, Modal, Row, Col, Typography } from "antd";

import { AdminViewProject } from "./components/ProjectDetails";
import { ProjectsTable } from "./components/ProjectsTable";
import { Filters } from "./components/Filters";
import { ReportDetails } from "./components/ReportDetails";
import { dataFilteringStateReducer } from "./helpers/dataFilteringStateMachine";
import { projectDetailsDialogStateReducer } from "./helpers/projectDetailsDialogStateMachine";

import { Project } from "../../../../../interfaces/project";
import { baseUrl } from "../../../../../services/httpClient";
import { listAllProjects } from "../../../../../services/project_service";
import Structure from "../../../../../components/layout/structure";

export const AllProjects: React.FC = () =>
{
  const [dataFilteringState, dispatchDataFiltering] = useReducer(
    dataFilteringStateReducer,
    { isLoading: true, data: [], result: [] });

  const [showProject, setShowProject] = useState(true);
  const [projectDetailsDialogState, dispatchProjectDetailsDialog] = useReducer(
    projectDetailsDialogStateReducer,
    { isVisible: false, isRated: false });

  useEffect(() =>
  {
    (async () =>
    {
      dispatchDataFiltering({ type: "LOADING" });

      const projects = await listAllProjects({ withPopulatedRefs: true });
      dispatchDataFiltering(
      {
        type: "SET_DATA",
        payload: { data: projects.map((p: Project) => ({ ...p, key: p._id })) }
      });

      dispatchDataFiltering({ type: "NOT_LOADING" });
    })();
  }, []);

  const { programId, categoryId, noticeId, projectName, authorName, data } = dataFilteringState;
  useEffect(() =>
  {
    dispatchDataFiltering({ type: "FILTER" });
  }, [programId, categoryId, noticeId, projectName, authorName, data]);

  const getInfoDialogTitle = useCallback(() =>
  {
    if (projectDetailsDialogState.data == null)
      return "Nenhum projeto carregado!";

    return showProject
      ? projectDetailsDialogState.data!.name
      : projectDetailsDialogState.data!.report!.projectTitle;
  }, [showProject, projectDetailsDialogState.data]);

  const closeInfoDialog = useCallback(() =>
  {
    dispatchProjectDetailsDialog({ type: "HIDE_DIALOG" });
    dispatchProjectDetailsDialog({ type: "NOT_RATED" });
  }, []);

  const infoDialog = useMemo(() => (
    <Modal
      visible={projectDetailsDialogState.isVisible}
      centered={true}
      closable={false}
      width="85%"
      title={
        <Typography.Title level={5} ellipsis>
          {getInfoDialogTitle()}
        </Typography.Title>
      }
      footer={<Button onClick={closeInfoDialog} type="primary">OK</Button>}
    >
      <Row>
        <Col span={24}>
          {projectDetailsDialogState.data == null
            ? null
            : !showProject
              ? <ReportDetails project={projectDetailsDialogState.data!} />
              : <AdminViewProject
                  project={projectDetailsDialogState.data!}
                  showResult={projectDetailsDialogState.isRated}
                  onRate={() => dispatchProjectDetailsDialog({ type: "RATED" })}
                />
          }
        </Col>
      </Row>
    </Modal>
  ),
  [
    projectDetailsDialogState.isVisible,
    projectDetailsDialogState.data,
    projectDetailsDialogState.isRated,
    closeInfoDialog,
    getInfoDialogTitle
  ]);

  let projectsCsvPath = `${baseUrl}/downloadCsv/${programId ?? ""}`;
  let scheduleCsvPath = `${baseUrl}/downloadCsvHours/${programId ?? ""}`;
  let reportsCsvPath = `${baseUrl}/project/report/download/${programId ?? ""}`;

  return (
    <>
      {ReactDOM.createPortal(infoDialog, document.getElementById("dialog-overlay")!)}

      <Structure title="todas as propostas">
        <Row gutter={[8, 8]}>
          <Filters
            projectsCsvHref={projectsCsvPath}
            scheduleCsvHref={scheduleCsvPath}
            reportsCsvHref={reportsCsvPath}
            onFilterBy={dispatchDataFiltering}
          />

          <ProjectsTable
            isLoading={dataFilteringState.isLoading}
            data={dataFilteringState.result}
            onShowProjectDetails={(record: Project) =>
            {
              setShowProject(true);
              dispatchProjectDetailsDialog({ type: "SHOW_DIALOG", payload: record });
            }}
            onShowReportDetails={(record: Project) =>
            {
              setShowProject(false);
              dispatchProjectDetailsDialog({ type: "SHOW_DIALOG", payload: record })
            }}
          />
        </Row>
      </Structure>
    </>
  );
};
