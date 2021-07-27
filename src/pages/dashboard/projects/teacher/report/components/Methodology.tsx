import React, { useEffect } from "react";

import { Col, Form, Input, Row } from "antd";
import { FormInstance } from "antd/lib/form";

import { IReport } from "../../../../../../interfaces/report";

interface Props
{
  formController: FormInstance;
  initialValues?: IReport;
}

const Methodology: React.FC<Props> = ({ formController, initialValues }) =>
{
  useEffect(() =>
  {
    if (initialValues !== undefined)
      formController.setFieldsValue(initialValues);
  }, [initialValues]);

  return (
    <Form
      name="methodology"
      layout="vertical"
      form={formController}
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

export default Methodology;