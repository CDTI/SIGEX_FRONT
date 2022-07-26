import React, { useEffect, useState } from "react";
import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import { FormInstance } from "antd/lib/form";
import moment from "moment";
import { rolesKey } from "..";

import { useHttpClient } from "../../../../../hooks/useHttpClient";
import { Role } from "../../../../../interfaces/user";
import { Notice } from "../../../../../interfaces/notice";
import { getAllRolesEndpoint } from "../../../../../services/endpoints/roles";

interface Props
{
  formController: FormInstance;
  initialValues?: Notice;
}

function getDisabledDateRange(currentDate: moment.Moment)
{
  return currentDate < moment().startOf("day")
    || currentDate > moment().endOf("day").add(4, "years");
}

export const MainDataForm: React.FC<Props> = (props) =>
{
  const [roles, setRoles] = useState<Role[]>([]);
  const { Option } = Select;
  const selectRolesRequester = useHttpClient();

  useEffect(() =>
  {
    (async () =>
    {
      const roles = localStorage.getItem(rolesKey) != null
        ? JSON.parse(localStorage.getItem(rolesKey)!) as Role[]
        : await selectRolesRequester.send<Role[]>(
          {
            method: "GET",
            url: getAllRolesEndpoint(),
            cancellable: true
          });

      setRoles(roles ?? []);

      localStorage.setItem(rolesKey, JSON.stringify(roles));
    })();

    return () =>
    {
      selectRolesRequester.halt();
    }
  }, [selectRolesRequester.halt, selectRolesRequester.send]);

  useEffect(() =>
  {

    if (props.initialValues != null) {
      const noticeSemester = new Date(props.initialValues?.effectiveDate).getMonth() + 1 > 6 ? "2 semestre" : "1 semestre";
      props.formController.setFieldsValue(
      {
        ...props.initialValues,
        effectiveDate: moment(props.initialValues.effectiveDate),
        expirationDate: moment(props.initialValues.expirationDate),
        reportDeadline: moment(props.initialValues.reportDeadline),
        projectExecutionPeriod: props.initialValues.projectExecutionPeriod ? props.initialValues.projectExecutionPeriod : noticeSemester,
        projectExecutionYear: props.initialValues.projectExecutionYear ? moment(props.initialValues.projectExecutionYear) : moment(props.initialValues.effectiveDate),
      });
    }
  }, [props.formController, props.initialValues]);

  function disabledDate(current: moment.Moment) {
    return current && !current.isBetween(moment().year(2020), moment().year(2050));
  }
  return (
    <Form
      name="main"
      layout="vertical"
      form={props.formController}
    >
      <Row>
        <Form.Item name="_id">
          <Input type="hidden" />
        </Form.Item>

        <Col span={24}>
          <Form.Item name="number" label="Número">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="name" label="Nome">
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="canAccess"
            label="Permissões de acesso"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Select
              options={roles.map((r: Role) => ({ label: r.description, value: r._id! }))}
              placeholder="Selecione funções de usuário"
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="effectiveDate"
            label="Data de início da vigência"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              disabledDate={getDisabledDateRange}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="expirationDate"
            label="Data final da vigência"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              disabledDate={getDisabledDateRange}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="reportDeadline"
            label="Data limite para envio do relatório"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              disabledDate={getDisabledDateRange}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="projectExecutionPeriod"
            label="Período de execução do projeto"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Select
              placeholder={"Período de execução do projeto"}
              style={{ width: "100%" }}
            >
              <Option value="1° Semestre">1° Semestre</Option>
              <Option value="2° Semestre">2° Semestre</Option>
            </Select>
          </Form.Item>
          </Col>
          <Col span={24}>
          <Form.Item
            name="projectExecutionYear"
            label="Ano de execução do projeto"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <DatePicker
              disabledDate={disabledDate}
              picker="year"
              style={{ width: "100%" }}
            />
          </Form.Item>
          </Col>
      </Row>
    </Form>
  );
};
