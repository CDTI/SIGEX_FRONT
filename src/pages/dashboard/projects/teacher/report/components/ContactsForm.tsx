import React, { useEffect } from "react";
import { Button, Col, Form, Input, Row } from "antd";
import { FormInstance } from "antd/lib/form";
import MaskedInput from "antd-mask-input";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { Contact } from "../../../../../../interfaces/project";

interface Props
{
  formController: FormInstance;
  initialValues?: Contact[];
}

export const ContactsForm: React.FC<Props> = (props) =>
{
  useEffect(() =>
  {
    if (props.initialValues !== undefined)
      props.formController.setFieldsValue(props.initialValues);
  }, [props.initialValues]);

  return (
    <Form
      name="community"
      layout="vertical"
      form={props.formController}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            name="communityName"
            label="Nome da comunidade"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.List name="communityContacts">
            {(communityContactFields, { add, remove }) => (
              <>
                <Row gutter={[8, 0]}>
                  {communityContactFields.map((communityContactField) => (
                    <>
                      <Col xs={24} md={4} xl={2}>
                        <Form.Item label={<label></label>}>
                          <Button
                            danger
                            block
                            type="primary"
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(communityContactField.name)}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={10} xl={11}>
                        <Form.Item
                          {...communityContactField}
                          label="Informações de contato da comunidade"
                          name={[communityContactField.name, "name"]}
                          fieldKey={[communityContactField.fieldKey, "name"]}
                          rules={
                          [
                            { required: true, message: "Campo obrigatório" },
                            { type: "string", max: 200, message: "O número máximo de caracteres foi extrapolado!" }
                          ]}
                        >
                          <Input style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={10} xl={11}>
                        <Form.Item
                          {...communityContactField}
                          label="Telefone"
                          name={[communityContactField.name, "phone"]}
                          fieldKey={[communityContactField.fieldKey, "phone"]}
                          rules={
                          [
                            { required: true, message: "Campo obrigatório" },
                            { type: "string", max: 200, message: "O número máximo de caracteres foi extrapolado!" }
                          ]}
                        >
                          <MaskedInput mask="(11)11111-1111" style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                    </>
                  ))}
                </Row>

                <Row>
                  <Col span={24}>
                    <Form.Item>
                      <Button type="dashed" block onClick={() => add()}>
                        <PlusOutlined /> Adicionar contato
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
    </Form>
  );
};
