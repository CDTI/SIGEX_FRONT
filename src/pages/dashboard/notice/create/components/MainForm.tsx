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
    if (props.initialValues != null)
      props.formController.setFieldsValue(
      {
        ...props.initialValues,
        effectiveDate: moment(props.initialValues.effectiveDate),
        expirationDate: moment(props.initialValues.expirationDate),
        reportDeadline: moment(props.initialValues.reportDeadline)
      });
  }, [props.formController, props.initialValues]);

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
      </Row>
    </Form>
  );
};
