import React from "react";
import { Link } from "react-router-dom";

import { Button, Col, Space, Table, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import { IProject } from "../../../../../interfaces/project";
import { IReport } from "../../../../../interfaces/report";

interface Props
{
  data: IProject[];
  isLoading: boolean;
  onShowProjectDetails(record: IProject): void;
  onShowReportDetails(record: IReport): void;
}

const ProjectsTable: React.FC<Props> = (props) =>
{
  const columns =
  [{
    key: "name",
    title: "Nome",
    dataIndex: "name",
  },
  {
    key: "dateStart",
    title: "Data de início",
    render: (text: string, record: IProject) =>
      record.dateStart.toLocaleString("pt-BR")
  },
  {
    key: "status",
    title: "Status",
    render: (text: string, record: IProject) =>
    {
      switch (record.status)
      {
        case "pending":
          return <Tag color="#f9a03f" style={{ color: "#000" }}>Pendente</Tag>;

        case "reproved":
          return <Tag color="#acc5cf" style={{ color: "#000" }}>Não aprovado</Tag>;

        case "notSelected":
          return <Tag color="#b3afc8" style={{ color: "#000" }}>Aprovado e não selecionado</Tag>;

        case "selected":
          return <Tag color="#8dc898" style={{ color: "#000" }}>Selecionado</Tag>;

        case "finished":
          return <Tag color="#fff" style={{ color: "#000" }}>Finalizado</Tag>;
      }
    },
  },
  {
    key: "action",
    title: "Ação",
    render: (text: string, record: IProject) => (
      <Space size="middle">
        <Button>
          <Link to={{ pathname: "/dashboard/project/create", state: record }}>Editar</Link>
        </Button>

        <Button
          onClick={() => props.onShowProjectDetails(record)}
        >
          <EyeOutlined /> Revisar
        </Button>

        {record.report !== undefined && (
          <Button
            onClick={() => props.onShowReportDetails(record.report as IReport)}
          >
            <EyeOutlined /> Relatório
          </Button>
        )}
      </Space>
    )
  }];

  return (
    <Col span={24}>
      <Table loading={props.isLoading} dataSource={props.data} columns={columns} />
    </Col>
  );
};

export default ProjectsTable;