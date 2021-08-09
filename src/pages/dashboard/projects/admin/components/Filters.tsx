import { Button, Col, Input, Select } from "antd";
import { DownloadOutlined } from "@ant-design/icons"
import React, { useEffect, useReducer } from "react";

import { ICategory } from "../../../../../interfaces/category";
import { INotice } from "../../../../../interfaces/notice";
import { IPrograms } from "../../../../../interfaces/programs";
import { getAllCategories } from "../../../../../services/category_service";
import { getAllNotices } from "../../../../../services/notice_service";
import { listPrograms } from "../../../../../services/program_service";
import { dropDownStateReducer } from "../helpers/dropDownStateMachine";

type Filters =
  | "FILTER_BY_AUTHOR_NAME"
  | "FILTER_BY_CATEGORY"
  | "FILTER_BY_NOTICE"
  | "FILTER_BY_PROGRAM"
  | "FILTER_BY_PROJECT_NAME";

interface Props
{
  projectsCsvHref: string;
  scheduleCsvHref: string;
  reportsCsvHref: string;
  onFilterBy(action: { type: Filters, payload?: string }): void;
}

const Filters: React.FC<Props> = (props) =>
{
  const [programsDropDownState, dispatchProgramsDropDownState] = useReducer(
    dropDownStateReducer,
    { isLoading: true, data: [] });

  const [categoriesDropDownState, dispatchCategoriesDropDownState] = useReducer(
    dropDownStateReducer,
    { isLoading: true, data: [] });

  const [noticesDropDownState, dispatchNoticesDropDownState] = useReducer(
    dropDownStateReducer,
    { isLoading: true, data: [] });

  useEffect(() =>
  {
    (async () =>
    {
      dispatchProgramsDropDownState({ type: "LOADING" });
      dispatchCategoriesDropDownState({ type: "LOADING" });
      dispatchNoticesDropDownState({ type: "LOADING" });

      dispatchProgramsDropDownState({ type: "SET_DATA", payload: (await listPrograms()).programs });
      dispatchNoticesDropDownState({ type: "SET_DATA", payload: await getAllNotices() });
      dispatchCategoriesDropDownState({ type: "SET_DATA", payload: await getAllCategories() });
    })();
  }, []);

  return (
    <>
      <Col xs={24} lg={12} xl={8}>
        <Select
           loading={programsDropDownState.isLoading}
           options={
           [{
              label: "Selecione um programa",
              value: ""
            }].concat(programsDropDownState.data.map((p: IPrograms) =>
            ({
              label: p.name,
              value: p._id!
            })))}
            defaultValue=""
            style={{ width: "100%" }}
            onChange={(programId: string) => props.onFilterBy(
            {
              type: "FILTER_BY_PROGRAM",
              payload: programId !== "" ? programId : undefined
            })}
          />
        </Col>

          <Col xs={24} lg={12} xl={8}>
            <Select
              loading={categoriesDropDownState.isLoading}
              options={
              [{
                label: "Selecione uma categoria",
                value: ""
              }].concat(categoriesDropDownState.data.map((c: ICategory) =>
              ({
                label: c.name,
                value: c._id
              })))}
              defaultValue=""
              style={{ width: "100%" }}
              onChange={(categoryId: string) => props.onFilterBy(
              {
                type: "FILTER_BY_CATEGORY",
                payload: categoryId !== "" ? categoryId : undefined
              })}
            />
          </Col>

          <Col xs={24} xl={8}>
            <Select
              loading={noticesDropDownState.isLoading}
              options={
              [{
                label: "Selecione um edital",
                value: ""
              }].concat(noticesDropDownState.data.map((n: INotice) =>
              ({
                label: n.name,
                value: n._id!
              })))}
              defaultValue=""
              style={{ width: "100%" }}
              onChange={(noticeId: string) => props.onFilterBy(
              {
                type: "FILTER_BY_NOTICE",
                payload: noticeId !== "" ? noticeId : undefined
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
                  payload:authorName !== "" ? authorName : undefined
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
                  payload: projectName !== "" ? projectName : undefined
                })
              }}
            />
          </Col>

          <Col xs={8} xl={4}>
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

          <Col xs={8} xl={4}>
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

          <Col xs={8} xl={4}>
            <Button
              block
              type="default"
              shape="round"
              icon={<DownloadOutlined />}
              href={props.reportsCsvHref}
            >
              Relatórios
            </Button>
          </Col>
    </>
  );
};

export default Filters;