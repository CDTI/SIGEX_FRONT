import React, { useEffect, useMemo, useReducer } from "react";
import ReactDOM from "react-dom";
import Structure from "../../../../components/layout/structure";
import { IProject } from "../../../../interfaces/project";
import { listAllProject } from "../../../../services/project_service";
import { Tag, Space, Button, Select, Modal, Input, Row, Col, Table } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import AdminViewProject from "../admin/admin-view-projects";

import { IPrograms } from "../../../../interfaces/programs";
import { listPrograms } from "../../../../services/program_service";
import { base_url } from "../../../../services/api";
import { INotice } from "../../../../interfaces/notice";
import { getAllNotices } from "../../../../services/notice_service";
import { ICategory } from "../../../../interfaces/category";
import { getAllCategories } from "../../../../services/category_service";
import IUser from "../../../../interfaces/user";

interface IAction
{
  type: string;
  payload?: any;
}

interface DetailsDialog
{
  isVisible: boolean;
  data?: IProject;
}

interface DropDownData
{
  isLoading: boolean;
  programs: IPrograms[];
  categories: ICategory[];
  notices: INotice[];
}

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

    default:
      throw new Error();
  }
};

const dropDownDataReducer = (state: DropDownData, action: IAction): DropDownData =>
{
  switch (action.type)
  {
    case "SET_DATA":
      return (
      {
        ...state,
        programs: action.payload.programs,
        categories: action.payload.categories,
        notices: action.payload.notices
      });

    case "LOADING":
      return { ...state, isLoading: true };

    case "NOT_LOADING":
      return { ...state, isLoading: false };

    default:
      throw new Error();
  }
};

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
  const [dropDownDataState, dispatchDropDownData] = useReducer(
    dropDownDataReducer,
    {
      isLoading: true,
      programs: [],
      categories: [],
      notices: []
    });

  const [dataFilteringState, dispatchDataFiltering] = useReducer(
    dataFilteringReducer, { isLoading: true, data: [], result: [] });

  const [detailsDialogState, dispatchDetailsDialog] = useReducer(
    detailsDialogReducer, { isVisible: false });

  useEffect(() =>
  {
    (async () =>
    {
      dispatchDataFiltering({ type: "LOADING" });
      dispatchDropDownData({ type: "LOADING" });
      const response = await listPrograms();
      const notices = await getAllNotices();
      const categories = await getAllCategories();
      dispatchDropDownData(
      {
        type: "SET_DATA",
        payload: { programs: response.programs, categories, notices }
      });

      dispatchDropDownData({ type: "NOT_LOADING" });

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
    const closeModal = () => dispatchDetailsDialog({ type: "HIDE_DIALOG" });

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
              ? <AdminViewProject project={detailsDialogState.data} />
              : "Nenhum conteúdo carregado!"}
          </Col>
        </Row>
      </Modal>
    );
  }, [detailsDialogState]);

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
    render: (text: string, project: IProject) => (
      <Space size="middle">
        <Button
          onClick={() =>
          {
            dispatchDetailsDialog({ type: "SET_DATA", payload: { data: project } });
            dispatchDetailsDialog({ type: "SHOW_DIALOG" });
          }}
        >
          <EyeOutlined /> Revisar
        </Button>
      </Space>),
  }];

  return (
    <>
      {ReactDOM.createPortal(projectDetails, document.getElementById("dialog-overlay")!)}

      <Structure title="todas as propostas">
        <Row gutter={[8, 8]}>
          <Col xs={24} lg={12} xl={8}>
            <Select
              loading={dropDownDataState.isLoading}
              options={
              [{
                label: "Selecione um programa",
                value: ""
              }].concat(dropDownDataState.programs.map((p: IPrograms) =>
              ({
                label: p.name,
                value: p._id!
              })))}
              defaultValue=""
              style={{ width: "100%" }}
              onChange={(programId: string) => dispatchDataFiltering(
              {
                type: "FILTER_BY_PROGRAM",
                payload: { programId: programId !== "" ? programId : undefined }
              })}
            />
          </Col>

          <Col xs={24} lg={12} xl={8}>
            <Select
              loading={dropDownDataState.isLoading}
              options={
              [{
                label: "Selecione uma categoria",
                value: ""
              }].concat(dropDownDataState.categories.map((c: ICategory) =>
              ({
                label: c.name,
                value: c._id
              })))}
              defaultValue=""
              style={{ width: "100%" }}
              onChange={(categoryId: string) => dispatchDataFiltering(
              {
                type: "FILTER_BY_CATEGORY",
                payload: { categoryId: categoryId !== "" ? categoryId : undefined }
              })}
            />
          </Col>

          <Col xs={24} xl={8}>
            <Select
              loading={dropDownDataState.isLoading}
              options={
              [{
                label: "Selecione um edital",
                value: ""
              }].concat(dropDownDataState.notices.map((n: INotice) =>
              ({
                label: n.name,
                value: n._id!
              })))}
              defaultValue=""
              style={{ width: "100%" }}
              onChange={(noticeId: string) => dispatchDataFiltering(
              {
                type: "FILTER_BY_NOTICE",
                payload: { noticeId: noticeId !== "" ? noticeId : undefined }
              })}
            />
          </Col>

          <Col xs={24} md={12} xl={6}>
            <Input
              placeholder="Nome do autor"
              style={{ width: "100%" }}
              onChange={(ev) =>
              {
                const authorName = ev.target.value;
                dispatchDataFiltering(
                {
                  type: "FILTER_BY_AUTHOR_NAME",
                  payload: { authorName: authorName !== "" ? authorName : undefined }
                })
              }}
            />
          </Col>

          <Col xs={24} md={12} xl={6}>
            <Input
              placeholder="Nome do projeto"
              style={{ width: "100%" }}
              onChange={(ev) =>
              {
                const projectName = ev.target.value;
                dispatchDataFiltering(
                {
                  type: "FILTER_BY_PROJECT_NAME",
                  payload: { projectName: projectName !== "" ? projectName : undefined }
                })
              }}
            />
          </Col>

          <Col xs={12} xl={6}>
            <Button
              block
              type="default"
              shape="round"
              icon={<DownloadOutlined />}
              href={base_url?.concat("extensao/downloadCsv/").concat(dataFilteringState.programId !== undefined ? dataFilteringState.programId : "")}
            >
              Projetos
            </Button>
          </Col>

          <Col xs={12} xl={6}>
            <Button
              block
              type="default"
              shape="round"
              icon={<DownloadOutlined />}
              href={base_url?.concat("extensao/downloadCSVHours/").concat(dataFilteringState.programId !== undefined ? dataFilteringState.programId : "")}
            >
              Horários
            </Button>
          </Col>

          <Col span={24}>
            <Table loading={dataFilteringState.isLoading} dataSource={dataFilteringState.result} columns={columns} />
          </Col>
        </Row>
      </Structure>
    </>
  );
};

export default Projects;
