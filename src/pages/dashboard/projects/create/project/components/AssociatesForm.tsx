import React, { useEffect } from "react";
import { Form, Input, Button, Space, Divider, Row, Col, Typography } from "antd";
import { FormInstance } from "antd/lib/form";
import MaskedInput from "antd-mask-input";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { Partnership } from "../../../../../../interfaces/project";

export interface Props
{
  formController: FormInstance;
  initialValues?: Partnership[];
}

export const AssociatesForm: React.FC<Props> = (props) =>
{
  useEffect(() =>
  {
    if (props.initialValues != null)
      props.formController.setFieldsValue({ partnership: props.initialValues });
  }, [props.initialValues]);

  return (
    <Form
      name="associates"
      layout="vertical"
      form={props.formController}
    >
      <Row>
        <Col span={24}>
          <Form.List name="partnership">
            {(associateFields, { add, remove }) => (
              <>
                <Row>
                  <Col span={24}>
                    <Button
                      block
                      type="dashed"
                      onClick={() => add()}
                    >
                      <PlusOutlined /> Adicionar associado
                    </Button>
                  </Col>
                </Row>

                <Row gutter={[8, 0]}>
                  {associateFields.map((associateField, index) => (
                    <>
                      <Col span={24}>
                        <Divider>
                          <Space>
                            <Button
                              type="link"
                              shape="circle"
                              size="small"
                              icon={<MinusCircleOutlined />}
                              onClick={() => remove(associateField.name)}
                              style={{ verticalAlign: "baseline" }}
                            />

                            <Typography.Title
                              level={3}
                              style={{ display: "inline-block", marginBottom: "0" }}
                            >
                              {`Parceria ${index + 1}`}
                            </Typography.Title>
                          </Space>
                        </Divider>
                      </Col>

                      <Col span={24}>
                        <Form.Item
                          {...associateField}
                          fieldKey={[associateField.name, "text"]}
                          name={[associateField.name, "text"]}
                          label="Sobre"
                          rules={[{ required: true, message: "Campo obrigatório!" }]}
                        >
                          <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.List name={[associateField.name, "contacts"]}>
                          {(contactFields, { add, remove }) => (
                            <>
                              <Row gutter={[8, 0]}>
                                {contactFields.map((contactField) => (
                                  <>
                                    <Col xs={24} md={4} xl={2}>
                                      <Form.Item label={<label></label>}>
                                        <Button
                                          danger
                                          block
                                          type="primary"
                                          icon={<MinusCircleOutlined />}
                                          onClick={() => remove(contactField.name)}
                                        />
                                      </Form.Item>
                                    </Col>

                                    <Col xs={24} md={10} xl={11}>
                                      <Form.Item
                                        {...contactField}
                                        fieldKey={[contactField.name, "name"]}
                                        name={[contactField.name, "name"]}
                                        label="Nome"
                                        rules={[{ required: true, message: "Campo obrigatório!" }]}
                                      >
                                        <Input style={{ width: "100%" }} />
                                      </Form.Item>
                                    </Col>

                                    <Col xs={24} md={10} xl={11}>
                                      <Form.Item
                                        {...contactField}
                                        fieldKey={[contactField.name, "phone"]}
                                        name={[contactField.name, "phone"]}
                                        label="Telefone"
                                        rules={[{ required: true, message: "Campo obrigatório!" }]}
                                      >
                                        <MaskedInput mask="(11)11111-1111" />
                                      </Form.Item>
                                    </Col>
                                  </>
                                ))}
                              </Row>

                              <Row>
                                <Col span={24}>
                                  <Button
                                    block
                                    type="dashed"
                                    onClick={() => add()}
                                  >
                                    <PlusOutlined /> Adicionar contato
                                  </Button>
                                </Col>
                              </Row>
                            </>
                          )}
                        </Form.List>
                      </Col>
                    </>
                  ))}
                </Row>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
    </Form>
  );
};
