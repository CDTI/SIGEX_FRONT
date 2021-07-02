import { Button, Col, Input, Select } from "antd";
import { DownloadOutlined } from "@ant-design/icons"
import React, { useEffect, useReducer } from "react";

import { ICategory } from "../../../../../interfaces/category";
import { INotice } from "../../../../../interfaces/notice";
import { IPrograms } from "../../../../../interfaces/programs";
import { getAllCategories } from "../../../../../services/category_service";
import { getAllNotices } from "../../../../../services/notice_service";
import { listPrograms } from "../../../../../services/program_service";
import { IAction } from "../../../../../util";

interface DropDownData
{
  isLoading: boolean;
  programs: IPrograms[];
  categories: ICategory[];
  notices: INotice[];
}

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

interface Props
{
  projectsCsvHref: string;
  scheduleCsvHref: string;
  onFilterBy(action: IAction): void;
}

const Filters: React.FC<Props> = (props) =>
{
  const [dropDownDataState, dispatchDropDownData] = useReducer(
    dropDownDataReducer,
    {
      isLoading: true,
      programs: [],
      categories: [],
      notices: []
    });

    useEffect(() =>
    {
      (async () =>
      {
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
      })();
    }, []);

  return (
    <>
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
            onChange={(programId: string) => props.onFilterBy(
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
              onChange={(categoryId: string) => props.onFilterBy(
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
              onChange={(noticeId: string) => props.onFilterBy(
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
                props.onFilterBy(
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
                props.onFilterBy(
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
              href={props.projectsCsvHref}
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
              href={props.scheduleCsvHref}
            >
              Horários
            </Button>
          </Col>
    </>
  );
};

export default Filters;