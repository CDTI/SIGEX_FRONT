import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";

import { Category } from "../../../../../../interfaces/category";
import { Notice } from "../../../../../../interfaces/notice";
import { Program } from "../../../../../../interfaces/program";
import { useHttpClient } from "../../../../../../hooks/useHttpClient";
import { getAllProgramsEndpoint } from "../../../../../../services/endpoints/programs";
import { getAllNoticesEndpoint } from "../../../../../../services/endpoints/notices";
import { getAllCategoriesEndpoint } from "../../../../../../services/endpoints/categories";
import { ProjectsFilterContext } from "../../../../../../context/projects";
import { Discipline } from "../../../../../../interfaces/discipline";
import { getAllDisciplines } from "../../../../../../services/discipline_service";

export type Field =
  | "AUTHOR"
  | "CATEGORY"
  | "NOTICE"
  | "PROGRAM"
  | "NAME"
  | "YEAR"
  | "SEMESTER";

interface Props {
  minYear?: number;
  maxYear?: number;
  onFilterBy(field: Field, value: string): void;
}

function enumerateYears(from?: number, to?: number): number[] {
  const first = from ?? 1970;
  let last = to ?? new Date().getFullYear();
  if (last < first) last = first;

  return Array(last - first + 1)
    .fill(first)
    .map((elem: number, index: number) => elem + index);
}

export const Filters: React.FC<Props> = (props) => {
  const {
    page,
    limit,
    getPaginatedProjects,
    cleanFilters,
    setProjectNameFilter,
    setProgramFilter,
    setCategoryFilter,
    setDisciplineFilter,
    setNoticeFilter,
    setAuthorNameFilter,
    setStatusFilter,
    setReportFilter,
  } = useContext(ProjectsFilterContext);
  let { query } = useContext(ProjectsFilterContext);
  const [form] = Form.useForm();
  const [programs, setPrograms] = useState<Program[]>([]);
  const selectProgramsRequester = useHttpClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const selectCategoriesRequester = useHttpClient();

  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  const [notices, setNotices] = useState<Notice[]>([]);
  const selectNoticesRequester = useHttpClient();

  useEffect(() => {
    (async () => {
      const data = await Promise.all([
        selectProgramsRequester.send({
          ...getAllProgramsEndpoint(),
          cancellable: true,
        }),

        selectNoticesRequester.send<Notice[]>({
          ...getAllNoticesEndpoint(),
          cancellable: true,
        }),

        selectCategoriesRequester.send<Category[]>({
          ...getAllCategoriesEndpoint(),
          cancellable: true,
        }),

        getAllDisciplines(),
      ]);
      setPrograms(data[0] ?? []);
      setCategories(data[2] ?? []);
      setDisciplines(data[3] ?? []);
      setNotices(data[1] ?? []);
    })();

    return () => {
      selectCategoriesRequester.halt();
      selectNoticesRequester.halt();
      selectProgramsRequester.halt();
    };
  }, []);

  const clearFilters = () => {
    form.resetFields();
    cleanFilters();
    getPaginatedProjects({
      page: String(page),
      limit: String(limit),
      name: "",
      author: "",
      program: "",
      category: "",
      notice: "",
      status: "",
      report: "",
    });
  };

  return (
    <Form form={form} onFinish={() => getPaginatedProjects(query)}>
      <Row justify="center" gutter={[8, 8]}>
        <Col xs={24} md={12}>
          <Form.Item name="projectName" style={{ margin: "0px" }}>
            <Input
              placeholder="Nome do projeto ou palavras-chave. Exemplo: Educação"
              style={{ width: "100%" }}
              onChange={(ev) => {
                setProjectNameFilter(ev.target.value);
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="authorName" style={{ margin: "0px" }}>
            <Input
              placeholder="Nome do autor"
              id="authorName"
              style={{ width: "100%" }}
              onChange={(ev) => {
                setAuthorNameFilter(ev.target.value);
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={12}>
          <Form.Item name="program" style={{ margin: "0px" }}>
            <Select
              loading={selectProgramsRequester.inProgress}
              options={[{ label: "Selecione um programa", value: "" }].concat(
                programs.map((p: Program) => ({ label: p.name, value: p._id! }))
              )}
              defaultValue=""
              style={{ width: "100%" }}
              showSearch
              showArrow
              filterOption={(input, option) =>
                (String(option?.label) ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(programId: string) => {
                setProgramFilter(programId);
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={12}>
          <Form.Item name="category" style={{ margin: "0px" }}>
            <Select
              loading={selectCategoriesRequester.inProgress}
              options={[{ label: "Selecione uma categoria", value: "" }].concat(
                categories.map((c: Category) => ({
                  label: c.name,
                  value: c._id!,
                }))
              )}
              defaultValue=""
              style={{ width: "100%" }}
              showSearch
              showArrow
              filterOption={(input, option) =>
                (String(option?.label) ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(categoryId: string) => {
                setCategoryFilter(categoryId);
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={12}>
          <Form.Item name="discipline" style={{ margin: "0px" }}>
            <Select
              loading={selectCategoriesRequester.inProgress}
              options={[
                { label: "Selecione uma disciplina", value: "" },
              ].concat(
                disciplines.map((d: Discipline) => ({
                  label: d.name,
                  value: d._id!,
                }))
              )}
              defaultValue=""
              style={{ width: "100%" }}
              showSearch
              showArrow
              filterOption={(input, option) =>
                (String(option?.label) ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(disciplineId: string) => {
                setDisciplineFilter(disciplineId);
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={12}>
          <Form.Item name="notice" style={{ margin: "0px" }}>
            <Select
              loading={selectNoticesRequester.inProgress}
              options={[{ label: "Selecione um edital", value: "" }].concat(
                notices.map((n: Notice) => ({ label: n.name, value: n._id! }))
              )}
              defaultValue=""
              style={{ width: "100%" }}
              showSearch
              showArrow
              filterOption={(input, option) =>
                (String(option?.label) ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(noticeId: string) => {
                setNoticeFilter(noticeId);
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="status" style={{ margin: "0px" }}>
            <Select
              defaultValue=""
              id="status"
              style={{ width: "100%" }}
              onChange={(semester: string) => setStatusFilter(semester)}
            >
              <Select.Option value="">Selecione um status</Select.Option>
              <Select.Option value="pending">Pendente</Select.Option>
              <Select.Option value="selected">Selecionado</Select.Option>
              <Select.Option value="notSelected">
                Aprovado e não selecionado
              </Select.Option>
              <Select.Option value="reproved">Não aprovado</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="report" style={{ margin: "0px" }}>
            <Select
              defaultValue=""
              id="report"
              style={{ width: "100%" }}
              onChange={(report: string) => setReportFilter(report)}
            >
              <Select.Option value="">Projeto possui relatório?</Select.Option>
              <Select.Option value="yes">Sim</Select.Option>
              <Select.Option value="no">Não</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        {/* <Col xs={24} md={12}>
          <Form.Item name="semester" style={{ margin: "0px" }}>
            <Select
              defaultValue=""
              id="semester"
              style={{ width: "100%" }}
              onChange={(semester: string) =>
                props.onFilterBy("SEMESTER", semester)
              }
            >
              <Select.Option value="">Selecione um semestre</Select.Option>
              <Select.Option value="1">1º semestre</Select.Option>
              <Select.Option value="2">2º semestre</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item name="year" style={{ margin: "0px" }}>
            <Select
              options={[{ label: "Selecione um ano", value: "" }].concat(
                enumerateYears(props.minYear, props.maxYear).map(
                  (year: number) => ({
                    label: year.toString(),
                    value: year.toString(),
                  })
                )
              )}
              id="year"
              defaultValue=""
              style={{ width: "100%" }}
              onChange={(year: string) => props.onFilterBy("YEAR", year)}
            />
          </Form.Item>
        </Col> */}

        <Col xs={24}>
          <Button block type="primary" htmlType="submit">
            <SearchOutlined />
            Pesquisar
          </Button>
        </Col>
        <Col xs={24}>
          <Button block type="primary" htmlType="button" onClick={clearFilters}>
            <ClearOutlined /> Limpar filtros
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
