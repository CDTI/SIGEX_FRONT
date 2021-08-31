import React, { useEffect } from "react";
import { Col, Form, Input, Row } from "antd";
import { FormInstance } from "antd/lib/form";

import { Report } from "../../../../../../interfaces/project";

interface Props
{
  formController: FormInstance
  initialValues?: Report;
}

export const IntroductionForm: React.FC<Props> = (props) =>
{
  useEffect(() =>
  {
    if (props.initialValues !== undefined)
      props.formController.setFieldsValue(props.initialValues);
  }, [props.initialValues]);

  return (
    <Form
      name="introduction"
      layout="vertical"
      form={props.formController}
      initialValues={props.initialValues}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            name="projectTitle"
            label="Título"
            rules={
            [
              { required: true, message: "Campo obrigatório!" },
              { type: "string", max: 500, message: "O número máximo de caracteres foi extrapolado!" }
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="introduction"
            label="Introdução"
            rules={
            [
              { required: true, message: "Campo obrigatório!" },
              { type: "string", max: 3000, message: "O número máximo de caracteres foi extrapolado!" }
            ]}
          >
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
