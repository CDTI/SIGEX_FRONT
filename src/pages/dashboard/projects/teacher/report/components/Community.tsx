import React, { useEffect } from "react";

import { Col, Form, Input, InputNumber, Row } from "antd";
import { FormInstance } from "antd/lib/form";

import { ICommunity } from "../../../../../../interfaces/community";

interface Props
{
  formController: FormInstance;
  initialValues?: ICommunity;
}

const Community: React.FC<Props> = ({ formController, initialValues }) =>
{
  useEffect(() =>
  {
    if (initialValues !== undefined)
      formController.setFieldsValue(initialValues);
  }, [initialValues]);

  return (
    <Form
      name="community"
      layout="vertical"
      form={formController}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            name="text"
            label="Sobre"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="location"
            label="Localização"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="peopleInvolved"
            label="Número de pessoas envolvidas"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Community;