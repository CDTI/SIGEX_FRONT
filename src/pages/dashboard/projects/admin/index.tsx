import React, { useCallback, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import Structure from "../../../../components/layout/structure";
import { IProject } from "../../../../interfaces/project";
import { listAllProject } from "../../../../services/project_service";
import { Button, Modal, Row, Col } from "antd";
import ProjectDetails from "./components/ProjectDetails";

import { base_url } from "../../../../services/api";

import Filters from "./components/Filters";
import ProjectsTable from "./components/ProjectsTable";
import { dataFilteringStateReducer } from "./helpers/dataFilteringStateMachine";
import { projectDetailsDialogStateReducer } from "./helpers/projectDetailsDialogStateMachine";
import { reportDetailsDialogStateReducer } from "./helpers/reportDetailsDialogStateMachine";
import ReportDetails from "./components/ReportDetails";
import { IReport } from "../../../../interfaces/report";

const Projects: React.FC = () =>
{
  const [dataFilteringState, dispatchDataFiltering] = useReducer(
    dataFilteringStateReducer,
    { isLoading: true, data: [], result: [] });

  const [projectDetailsDialogState, dispatchProjectDetailsDialog] = useReducer(
    projectDetailsDialogStateReducer,
    { isVisible: false, isRated: false });

  const [reportDetailsDialogState, dispatchReportDetailsDialog] = useReducer(
    reportDetailsDialogStateReducer,
    { isVisible: false });

  useEffect(() =>
  {
    (async () =>
    {
      dispatchDataFiltering({ type: "LOADING" });

      const projects = await listAllProject();
      dispatchDataFiltering(
      {
        type: "SET_DATA",
        payload: { data: projects.map((p: IProject) => ({ ...p, key: p._id })) }
      });

      dispatchDataFiltering({ type: "NOT_LOADING" });
    })();
  }, []);

  const { programId, categoryId, noticeId, projectName, authorName, data } = dataFilteringState;
  useEffect(() =>
  {
    dispatchDataFiltering({ type: "FILTER" });
  }, [programId, categoryId, noticeId, projectName, authorName, data]);

  const closeProjectDetails = useCallback(() =>
  {
    dispatchProjectDetailsDialog({ type: "HIDE_DIALOG" });
    dispatchProjectDetailsDialog({ type: "NOT_RATED" });
  }, []);

  const projectDetails = (
    <Modal
      visible={projectDetailsDialogState.isVisible}
      centered={true}
      width="85%"
      title="Detalhes do projeto"
      footer={<Button onClick={closeProjectDetails} type="primary">OK</Button>}
      onCancel={closeProjectDetails}
    >
      <Row>
        <Col span={24}>
          {projectDetailsDialogState.data !== undefined
            ? <ProjectDetails
                project={projectDetailsDialogState.data}
                showResult={projectDetailsDialogState.isRated}
                onRate={() => dispatchProjectDetailsDialog({ type: "RATED" })}
              />
            : "Nenhum conteúdo carregado!"}
        </Col>
      </Row>
    </Modal>
  );

  const closeReportDetails = useCallback(() =>
  {
    dispatchReportDetailsDialog({ type: "HIDE_DIALOG" })
  }, []);

  const reportDetails = (
    <Modal
      visible={reportDetailsDialogState.isVisible}
      centered={true}
      width="85%"
      title="Detalhes do relatório"
      footer={<Button onClick={closeReportDetails} type="primary">OK</Button>}
      onCancel={closeReportDetails}
    >
      <Row>
        <Col span={24}>
          {reportDetailsDialogState.data !== undefined
            ? <ReportDetails report={reportDetailsDialogState.data} />
            : "Nenhum conteúdo carregado!"}
        </Col>
      </Row>
    </Modal>
  );

  let projectsCsvPath = `${base_url}/extensao/downloadCsv/${programId ?? ""}`;
  let scheduleCsvPath = `${base_url}/extensao/downloadCsvHours/${programId ?? ""}`;

  return (
    <>
      {ReactDOM.createPortal(projectDetails, document.getElementById("dialog-overlay")!)}
      {ReactDOM.createPortal(reportDetails, document.getElementById("dialog-overlay")!)}

      <Structure title="todas as propostas">
        <Row gutter={[8, 8]}>
          <Filters
            projectsCsvHref={projectsCsvPath}
            scheduleCsvHref={scheduleCsvPath}
            onFilterBy={dispatchDataFiltering}
          />

          <ProjectsTable
            isLoading={dataFilteringState.isLoading}
            data={dataFilteringState.result}
            onShowProjectDetails={(record: IProject) =>
              dispatchProjectDetailsDialog({ type: "SHOW_DIALOG", payload: record })
            }
            onShowReportDetails={(record: IReport) =>
              dispatchReportDetailsDialog({ type: "SHOW_DIALOG", payload: record })
            }
          />
        </Row>
      </Structure>
    </>
  );
};

export default Projects;
