import React, { useEffect } from "react";
import { Form, Input, Button, Space, Divider, Row, Col, Typography } from "antd";
import { FormInstance } from "antd/lib/form";
import { MaskedInput } from "antd-mask-input";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

import { Planning } from "../../../../../../interfaces/project";

interface Props
{
  formController: FormInstance;
  initialValues?: Planning[];
}

export const ArrangementsForm: React.FC<Props> = (props) =>
{
  useEffect(() =>
  {
    if (props.initialValues != null)
      props.formController.setFieldsValue({ planning: props.initialValues });
  }, [props.initialValues]);

  return (
    <Form
      name="arrangements"
      layout="vertical"
      form={props.formController}
    >
      <Row>
        <Col span={24}>
          <Form.List name="planning">
            {(phaseFields, { add, remove }) => (
              <>
                <Row gutter={[8, 0]}>
                  {phaseFields.map((phaseField, index) => (
                    <>
                      <Col span={24}>
                        <Divider>
                          <Space>
                            <Button
                              type="link"
                              shape="circle"
                              size="small"
                              icon={<MinusCircleOutlined />}
                              onClick={() => remove(phaseField.name)}
                              style={{ verticalAlign: "baseline" }}
                            />

                            <Typography.Title
                              level={3}
                              style={{ display: "inline-block", marginBottom: "0" }}
                            >
                              {`Etapa ${index + 1}`}
                            </Typography.Title>
                          </Space>
                        </Divider>
                      </Col>

                      <Col span={24}>
                        <Form.Item
                          {...phaseField}
                          fieldKey={[phaseField.name, "text"]}
                          name={[phaseField.name, "text"]}
                          label="Etapa"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <Input style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item
                          {...phaseField}
                          fieldKey={[phaseField.name, "developmentSite"]}
                          name={[phaseField.name, "developmentSite"]}
                          label="Onde será desenvolvida"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <Input style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item
                          {...phaseField}
                          fieldKey={[phaseField.name, "developmentMode"]}
                          name={[phaseField.name, "developmentMode"]}
                          label="
                            Como será desenvolvida (indicar recursos de
                            infraestrutura necessários, tais como laboratório de
                            informática, laboratório específico, etc.)"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <Input style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          {...phaseField}
                          fieldKey={[phaseField.name, "startDate"]}
                          name={[phaseField.name, "startDate"]}
                          label="Data de inicío"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <MaskedInput mask="11/11/1111" style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          {...phaseField}
                          fieldKey={[phaseField.name, "finalDate"]}
                          name={[phaseField.name, "finalDate"]}
                          label="Data de término"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <MaskedInput mask="11/11/1111" style={{ width: "100%" }} />
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
                      <PlusOutlined /> Adicionar etapa
                    </Button>
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
