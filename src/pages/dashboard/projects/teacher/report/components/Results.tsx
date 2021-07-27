import React, { useEffect } from "react";

import { Col, Form, Input, InputNumber, Row } from "antd";
import { FormInstance } from "antd/lib/form";

import { IReport } from "../../../../../../interfaces/report";

interface Props
{
  formController: FormInstance;
  initialValues?: IReport;
}

const Results: React.FC<Props> = ({ formController, initialValues }) =>
{
  useEffect(() =>
  {
    if (initialValues !== undefined)
      formController.setFieldsValue(initialValues);
  }, [initialValues]);

  return (
    <Form
      name="results"
      layout="vertical"
      form={formController}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            name="results"
            label="Relato da experiência"
            rules={
            [
              { required: true, message: "Campo obrigatório!" },
              { type: "string", max: 7000, message: "O número máximo de caracteres foi extrapolado!" }
            ]}
          >
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="students"
            label="Número de alunos"
            rules={
            [
              { required: true, message: "Campo obrigatório!" },
              { type: "number", max: 1000, message: "O limite do número de alunos foi extrapolado!" }
            ]}
          >
            <InputNumber max={1000} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="teams"
            label="Número de equipes"
            rules={
            [
              { required: true, message: "Campo obrigatório!" },
              { type: "number", max: 100, message: "O limite do número de equipes foi extrapolado!" }
            ]}
          >
            <InputNumber max={100} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="communityPeople"
            label="Número de pessoas da comunidade com interação direta"
            rules={
            [
              { required: true, message: "Campo obrigatório!" },
              { type: "number", max: 100, message: "O limite do número de pessoas da comunidade foi extrapolado!" }
            ]}
          >
            <InputNumber max={1000} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="affectedPeople"
            label="Número aproximado de pessoas impactadas"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Results;