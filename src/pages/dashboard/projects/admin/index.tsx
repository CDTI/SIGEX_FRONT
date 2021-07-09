import React, { useEffect, useMemo, useReducer } from "react";
import ReactDOM from "react-dom";
import Structure from "../../../../components/layout/structure";
import { IProject } from "../../../../interfaces/project";
import { listAllProject } from "../../../../services/project_service";
import { Button, Modal, Row, Col } from "antd";
import ProjectDetails from "./components/ProjectDetails";

import { INotice } from "../../../../interfaces/notice";
import { ICategory } from "../../../../interfaces/category";
import IUser from "../../../../interfaces/user";
import { IAction } from "../../../../util";
import { base_url } from "../../../../services/api";

import Filters from "./components/Filters";
import ProjectsTable from "./components/ProjectsTable";

interface DetailsDialog
{
  isVisible: boolean;
  isRated: boolean;
  data?: IProject;
}

const detailsDialogReducer = (state: DetailsDialog, action: IAction): DetailsDialog =>
{
  switch (action.type)
  {
    case "SHOW_DIALOG":
      return { ...state, isVisible: true };

    case "HIDE_DIALOG":
      return { ...state, isVisible: false };

    case "SET_DATA":
      return { ...state, data: action.payload.data };

    case "RATED":
      return { ...state, isRated: true };

    case "NOT_RATED":
      return { ...state, isRated: false };

    default:
      throw new Error();
  }
};

interface DataFiltering
{
  isLoading: boolean;
  data: IProject[];
  result: IProject[];
  programId?: string;
  categoryId?:string;
  noticeId?: string;
  projectName?: string;
  authorName?: string;
}

const dataFilteringReducer = (state: DataFiltering, action: IAction): DataFiltering =>
{
  switch (action.type)
  {
    case "LOADING":
      return { ...state, isLoading: true };

    case "NOT_LOADING":
      return { ...state, isLoading: false };

    case "SET_DATA":
      return { ...state, data: action.payload.data };

    case "FILTER_BY_PROGRAM":
      return { ...state, programId: action.payload.programId };

    case "FILTER_BY_CATEGORY":
      return { ...state, categoryId: action.payload.categoryId };

    case "FILTER_BY_NOTICE":
      return { ...state, noticeId: action.payload.noticeId };

    case "FILTER_BY_PROJECT_NAME":
      return { ...state, projectName: action.payload.projectName };

    case "FILTER_BY_AUTHOR_NAME":
      return { ...state, authorName: action.payload.authorName };

    case "FILTER":
      return (
      {
        ...state,
        result: state.data.filter((p: IProject) =>
        {
          let shouldKeep = true;
          if (state.programId !== undefined)
            shouldKeep = shouldKeep && p.programId === state.programId;

          if (state.categoryId !== undefined)
            shouldKeep = shouldKeep && (p.category as ICategory)._id === state.categoryId;

          if (state.noticeId !== undefined)
            shouldKeep = shouldKeep && (p.notice as INotice)._id === state.noticeId;

          if (state.projectName !== undefined)
            shouldKeep = shouldKeep && p.name.toLocaleUpperCase().includes(
              state.projectName.toLocaleUpperCase());

          if (state.authorName !== undefined)
            shouldKeep = shouldKeep && (p.author as IUser)?.name.toLocaleUpperCase().includes(
              state.authorName.toLocaleUpperCase());

          return shouldKeep;
        })
      });

    default:
      throw new Error();
  }
};

const Projects: React.FC = () =>
{
  const [dataFilteringState, dispatchDataFiltering] = useReducer(
    dataFilteringReducer, { isLoading: true, data: [], result: [] });

  const [detailsDialogState, dispatchDetailsDialog] = useReducer(
    detailsDialogReducer, { isVisible: false, isRated: false });

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

  const projectDetails = useMemo(() =>
  {
    const closeModal = () =>
    {
      dispatchDetailsDialog({ type: "HIDE_DIALOG" });
      dispatchDetailsDialog({ type: "NOT_RATED" });
    }

    return (
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
                  onRate={dispatchDetailsDialog}
                />
              : "Nenhum conteúdo carregado!"}
          </Col>
        </Row>
      </Modal>
    );
  }, [detailsDialogState]);

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
            onFilterBy={dispatchDataFiltering} />


          <ProjectsTable
            isLoading={dataFilteringState.isLoading}
            data={dataFilteringState.result}
            onShowDetails={dispatchDetailsDialog} />
        </Row>
      </Structure>
    </>
  );
};

export default Projects;
