import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { ClearOutlined } from "@ant-design/icons";

import { Category } from "../../../../../../interfaces/category";
import { Notice } from "../../../../../../interfaces/notice";
import { Program } from "../../../../../../interfaces/program";
import { useHttpClient } from "../../../../../../hooks/useHttpClient";
import { getAllProgramsEndpoint } from "../../../../../../services/endpoints/programs";
import { getAllNoticesEndpoint } from "../../../../../../services/endpoints/notices";
import { getAllCategoriesEndpoint } from "../../../../../../services/endpoints/categories";

export type Field =
  | "AUTHOR"
  | "CATEGORY"
  | "NOTICE"
  | "PROGRAM"
  | "NAME"
  | "YEAR"
  | "SEMESTER";

interface Props
{
  minYear?: number;
  maxYear?: number;
  onFilterBy(field: Field, value: string): void;
  clearFilters: () => void;
}

function enumerateYears(from?: number, to?: number): number[]
{
  const first = from ?? 1970;
  let last = to ?? new Date().getFullYear();
  if (last < first)
    last = first;

  return Array(last - first + 1)
    .fill(first)
    .map((elem: number, index: number) => elem + index);
}

export const Filters: React.FC<Props> = (props) =>
{
  const [ form ] = Form.useForm();
  const [programs, setPrograms] = useState<Program[]>([]);
  const selectProgramsRequester = useHttpClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const selectCategoriesRequester = useHttpClient();

  const [notices, setNotices] = useState<Notice[]>([]);
  const selectNoticesRequester = useHttpClient();

  useEffect(() =>
  {
    (async () =>
    {
      const data = await Promise.all(
      [
        selectProgramsRequester.send(
        {
          ...getAllProgramsEndpoint(),
          cancellable: true
        }),

        selectNoticesRequester.send<Notice[]>(
        {
          ...getAllNoticesEndpoint(),
          cancellable: true
        }),

        selectCategoriesRequester.send<Category[]>(
        {
          ...getAllCategoriesEndpoint(),
          cancellable: true
        })
      ]);

      setPrograms(data[0].programs ?? []);
      setCategories(data[2] ?? []);
      setNotices(data[1]
        ?.sort((a: Notice, b: Notice) =>
          a.createdAt! < b.createdAt!
            ? -1 : a.createdAt! > b.createdAt!
              ? 1 : 0)
        .reverse() ?? []);
    })();

    return () =>
    {
      selectCategoriesRequester.halt();
      selectNoticesRequester.halt();
      selectProgramsRequester.halt();
    }
  }, []);

  const clearFilters = () => {
    form.resetFields();
    props.clearFilters();
  }

  return (
    <Form form={form} onFinish={clearFilters}>
      <Row justify="center" gutter={[8, 8]}>
        <Col xs={24} md={12}>
          <Form.Item name="projectName" style={{margin: '0px'}}>
            <Input
              placeholder="Nome do projeto"
              style={{ width: "100%" }}
              onChange={(ev) =>
              {
                const projectName = ev.target.value;
                props.onFilterBy("NAME", projectName);
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="authorName" style={{margin: '0px'}}>
            <Input
              placeholder="Nome do autor"
              id="authorName"
              style={{ width: "100%" }}
              onChange={(ev) =>
              {
                const authorName = ev.target.value;
                props.onFilterBy("AUTHOR", authorName);
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={8}>
          <Form.Item name="program" style={{margin: '0px'}}>
            <Select
              loading={selectProgramsRequester.inProgress}
              options={[{ label: "Selecione um programa", value: "" }].concat(
                programs.map((p: Program) => ({ label: p.name, value: p._id! })))
              }
              defaultValue=""
              style={{ width: "100%" }}
              onChange={(programId: string) => props.onFilterBy("PROGRAM", programId)}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={8}>
          <Form.Item name="category" style={{margin: '0px'}}>
            <Select
              loading={selectCategoriesRequester.inProgress}
              options={[{ label: "Selecione uma categoria", value: "" }].concat(
                categories.map((c: Category) => ({ label: c.name, value: c._id! })))
              }
              defaultValue=""
              style={{ width: "100%" }}
              onChange={(categoryId: string) => props.onFilterBy("CATEGORY", categoryId)}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={8}>
          <Form.Item name="notice" style={{margin: '0px'}}>
            <Select
              loading={selectNoticesRequester.inProgress}
              options={[{ label: "Selecione um edital", value: "" }].concat(
                notices.map((n: Notice) => ({ label: n.name, value: n._id! })))
              }
              defaultValue=""
              style={{ width: "100%" }}
              onChange={(noticeId: string) => props.onFilterBy("NOTICE", noticeId)}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="semester" style={{margin: '0px'}}>
            <Select
              defaultValue=""
              id="semester"
              style={{ width: "100%" }}
              onChange={(semester: string) => props.onFilterBy("SEMESTER", semester)}
            >
              <Select.Option value="">Selecione um semestre</Select.Option>
              <Select.Option value="1">1º semestre</Select.Option>
              <Select.Option value="2">2º semestre</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="year" style={{margin: '0px'}}>
            <Select
              options={[{ label: "Selecione um ano", value: "" }].concat(
                enumerateYears(props.minYear, props.maxYear).map((year: number) => (
                {
                  label: year.toString(),
                  value: year.toString()
                })))
              }
              id="year"
              defaultValue=""
              style={{ width: "100%" }}
              onChange={(year: string) => props.onFilterBy("YEAR", year)}
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Button
            block
            type="primary"
            htmlType="submit"
          >
            <ClearOutlined /> Limpar filtro
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
