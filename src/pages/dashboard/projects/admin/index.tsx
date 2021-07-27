import React, { useCallback, useEffect, useMemo, useReducer } from "react";
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
import { detailsDialogStateReducer } from "./helpers/detailsDialogStateMachine";

const Projects: React.FC = () =>
{
  const [dataFilteringState, dispatchDataFiltering] = useReducer(
    dataFilteringStateReducer,
    { isLoading: true, data: [], result: [] });

  const [detailsDialogState, dispatchDetailsDialog] = useReducer(
    detailsDialogStateReducer,
    { isVisible: false, isRated: false });

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

  const closeModal = useCallback(() =>
  {
    dispatchDetailsDialog({ type: "HIDE_DIALOG" });
    dispatchDetailsDialog({ type: "NOT_RATED" });
  }, []);

  const projectDetails = (
    <Modal
      visible={detailsDialogState.isVisible}
      centered={true}
      width="85%"
      footer={<Button onClick={closeModal} type="primary">OK</Button>}
      onCancel={closeModal}
    >
      <Row>
        <Col span={24}>
          {detailsDialogState.data !== undefined
            ? <ProjectDetails
                project={detailsDialogState.data}
                showResult={detailsDialogState.isRated}
                onRate={() => dispatchDetailsDialog({ type: "RATED" })}
              />
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
            onShowDetails={(record: IProject) =>
              dispatchDetailsDialog({ type: "SHOW_DIALOG", payload: record })
            }
          />
        </Row>
      </Structure>
    </>
  );
};

export default Projects;
