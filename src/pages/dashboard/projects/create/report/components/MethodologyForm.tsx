import React, { useEffect } from "react";

import { Col, Form, Input, Row } from "antd";
import { FormInstance } from "antd/lib/form";

import { Report } from "../../../../../../interfaces/project";

interface Props
{
  formController: FormInstance;
  initialValues?: Report;
}

export const MethodologyForm: React.FC<Props> = (props) =>
{
  useEffect(() =>
  {
    if (props.initialValues !== undefined)
      props.formController.setFieldsValue(props.initialValues);
  }, [props.initialValues]);

  return (
    <Form
      name="methodology"
      layout="vertical"
      form={props.formController}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            name="methodology"
            label="Procedimentos metodológicos"
            rules={
            [
              { required: true, message: "Campo obrigatório!" },
              { type: "string", max: 6000, message: "O número máximo de caracteres foi extrapolado!" }
            ]}
          >
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
