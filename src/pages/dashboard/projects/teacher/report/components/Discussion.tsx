import React, { useEffect } from "react";

import { Col, Form, Input, Row } from "antd";
import { FormInstance } from "antd/lib/form";

import { IReport } from "../../../../../../interfaces/report";

interface Props
{
  formController: FormInstance;
  initialValues?: IReport;
}

const Discussion: React.FC<Props> = ({ formController, initialValues }) =>
{
  useEffect(() =>
  {
    if (initialValues !== undefined)
      formController.setFieldsValue(initialValues);
  }, [initialValues]);

  return (
    <Form
      name="discussion"
      layout="vertical"
      form={formController}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            name="discussion"
            label="Discussão"
            rules={
            [
              { required: true, message: "Campo obrigatório!" },
              { type: "string", max: 4000, message: "O número máximo de caracteres foi extrapolado!" }
            ]}
          >
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Discussion;