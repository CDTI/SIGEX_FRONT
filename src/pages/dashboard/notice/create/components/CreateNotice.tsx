import React, { useEffect, useState } from "react";
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import moment from "moment";

import { Role } from "../../../../../interfaces/user";
import { Notice } from "../../../../../interfaces/notice";
import { getRoles } from "../../../../../services/role_service";

interface Props
{
  onBack(): void;
  onSubmit(notice: Notice): void;
  notice?: Notice;
}

function disableDateRange(currentDate: moment.Moment)
{
  return currentDate < moment().startOf("day")
    || currentDate > moment().endOf("day").add(4, "years");
}

export const CreateNotice: React.FC<Props> = ({ notice, onBack, onSubmit }) =>
{
  const [roles, setRoles] = useState<Role[]>([]);
  const [form] = Form.useForm();

  useEffect(() =>
  {
    (async () =>
    {
      setRoles(await getRoles());
      if (notice !== undefined)
        form.setFieldsValue(
        {
          ...notice,
          effectiveDate: moment(notice.effectiveDate),
          expirationDate: moment(notice.expirationDate),
          reportDeadline: moment(notice.reportDeadline)
        });
    })();
  }, [form, notice]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values: Notice) => onSubmit(values)}
    >
      <Row justify="center">
        <Form.Item name="_id">
          <Input type="hidden" />
        </Form.Item>

        <Col xs={24} xl={21} xxl={18}>
          <Form.Item name="number" label="Número">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={24} xl={21} xxl={18}>
          <Form.Item name="name" label="Nome">
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={24} xl={21} xxl={18}>
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

        <Col xs={24} xl={21} xxl={18}>
          <Form.Item
            name="effectiveDate"
            label="Data de início da vigência"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              disabledDate={disableDateRange}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={21} xxl={18}>
          <Form.Item
            name="expirationDate"
            label="Data final da vigência"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              disabledDate={disableDateRange}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={21} xxl={18}>
          <Form.Item
            name="reportDeadline"
            label="Data limite para envio do relatório"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              disabledDate={disableDateRange}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} xl={21} xxl={18}>
          <Row justify="space-between">
            <Button type="default" onClick={onBack}>
              Voltar
            </Button>

            <Button type="primary" htmlType="submit">
              Salvar
            </Button>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};
