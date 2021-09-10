import React, { useEffect } from "react";
import { Form, Input, InputNumber, Row, Col } from "antd";
import { FormInstance } from "antd/lib/form";

import { Community } from "../../../../../../interfaces/project";

interface Props
{
  formContoller: FormInstance;
  initialValues?: Community;
}

export const CommunityForm: React.FC<Props> = (props) =>
{
  useEffect(() =>
  {
    if (props.initialValues != null)
      props.formContoller.setFieldsValue({ ...props.initialValues });
  }, [props.initialValues]);

  return (
    <Form
      name="community"
      layout="vertical"
      form={props.formContoller}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            name="text"
            label="Sobre"
            rules={[{ required: true, message: "Campo Obrigatório" }]}
          >
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="location"
            label="Localização"
            rules={[{ required: true, message: "Campo Obrigatório" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="peopleInvolved"
            label="Número de pessoas envolvidas"
            rules={[{ required: true, message: "Campo Obrigatório" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
