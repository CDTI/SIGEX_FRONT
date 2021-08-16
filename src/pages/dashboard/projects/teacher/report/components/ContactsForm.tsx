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
          <Form.List name="communityContacts">
            {(communityContactsFields, { add, remove }) => (
              <>
                <Row gutter={[8,8]}>
                  {communityContactsFields.map((communityContactsField) => (
                    <>
                      <Col xs={24} md={4} xl={2}>
                        <Form.Item label={<label></label>}>
                          <Button
                            danger
                            block
                            type="primary"
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(communityContactsField.name)}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={10} xl={11}>
                        <Form.Item
                          {...communityContactsField}
                          label="Nome da comunidade"
                          name={[communityContactsField.name, "name"]}
                          fieldKey={[communityContactsField.fieldKey, "name"]}
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
                          {...communityContactsField}
                          label="Contato da comunidade"
                          name={[communityContactsField.name, "contact"]}
                          fieldKey={[communityContactsField.fieldKey, "contact"]}
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
