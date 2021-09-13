import React, { useEffect } from "react";
import { Form, Input, Button, InputNumber, Row, Col } from "antd";
import { FormInstance } from "antd/lib/form";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { Resources } from "../../../../../../interfaces/project";

interface Props
{
  formController: FormInstance;
  initialValues?: Resources;
}

function fromCurrency(value?: string): number
{
  if (value == null)
    return 0;

  let parsedValue = value;
  if (parsedValue.indexOf(',') !== -1)
    parsedValue = value.replace(",", "");

  parsedValue = `${parsedValue.slice(0, -2)},${parsedValue.slice(-2)}`

  return Number(parsedValue.replace(/R\$ */, "").replace(",", "."));
}

function toCurrency(value?: string | number): string
{
  if (value == null || value === "")
    return "";

  let num = typeof value === "string"
    ? parseFloat(value)
    : value;

  return `R$ ${num.toFixed(2).replace(/\./, ",")}`;
}

export const ResourcesForm: React.FC<Props> = (props) =>
{
  useEffect(() =>
  {
    if (props.initialValues != null)
      props.formController.setFieldsValue(
      {
        materials: props.initialValues.materials,
        transport: props.initialValues.transport
      });
  }, [props.initialValues]);

  return (
    <Form
      form={props.formController}
      name="resources"
      layout="vertical"
    >
      <Row>
        <Col span={24}>
          <Form.List name="materials">
            {(materialFields, { add, remove }) => (
              <>
                <Row gutter={[8, 0]}>
                  {materialFields.map((materialField) => (
                    <>
                      <Col xs={24} md={4} xl={2}>
                        <Form.Item label={<label></label>}>
                          <Button
                            danger
                            block
                            type="primary"
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(materialField.name)}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={5} xl={6}>
                        <Form.Item
                          {...materialField}
                          fieldKey={[materialField.name, "item"]}
                          name={[materialField.name, "item"]}
                          label="Item"
                          rules={[{ required: true, message: "Campo obrigatório!" }]}
                        >
                          <Input style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={5} xl={6}>
                        <Form.Item
                          {...materialField}
                          fieldKey={[materialField.name, "description"]}
                          name={[materialField.name, "description"]}
                          label="Descrição"
                          rules={[{ required: true, message: "Campo obrigatório!" }]}
                        >
                          <Input style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={5}>
                        <Form.Item
                          {...materialField}
                          fieldKey={[materialField.name, "quantity"]}
                          name={[materialField.name, "quantity"]}
                          label="Quantidade"
                          rules={[{ required: true, message: "Campo obrigatório" }]}
                        >
                          <InputNumber min={1} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={5}>
                        <Form.Item
                          {...materialField}
                          fieldKey={[materialField.name, "unitaryValue"]}
                          name={[materialField.name, "unitaryValue"]}
                          label="Preço unitário"
                          rules={[{ required: true, message: "Campo obrigatório!" }]}
                        >
                          <InputNumber
                            min={0.01}
                            step={0.01}
                            parser={fromCurrency}
                            formatter={toCurrency}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  ))}
                </Row>

                <Row gutter={[0, 40]}>
                  <Col span={24}>
                    <Button
                      block
                      type="dashed"
                      onClick={() => add()}
                    >
                      <PlusOutlined /> Adicionar material
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>

        <Col span={24}>
          <Form.List name="transport">
            {(transportFields, { add, remove }) => (
              <>
                <Row gutter={[8, 0]}>
                  {transportFields.map((transportField) => (
                    <>
                      <Col xs={24} md={4} xl={2}>
                        <Form.Item label={<label></label>}>
                          <Button
                            danger
                            block
                            type="primary"
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(transportField.name)}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={6}>
                        <Form.Item
                          {...transportField}
                          fieldKey={[transportField.name, "typeTransport"]}
                          name={[transportField.name, "typeTransport"]}
                          label="Tipo de transporte"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <Input style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={6}>
                        <Form.Item
                          {...transportField}
                          fieldKey={[transportField.name, "description"]}
                          name={[transportField.name, "description"]}
                          label="Descrição"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <Input style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={5}>
                        <Form.Item
                          {...transportField}
                          fieldKey={[transportField.name, "quantity"]}
                          name={[transportField.name, "quantity"]}
                          label="Quantidade"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <InputNumber step={1} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={5}>
                        <Form.Item
                          {...transportField}
                          fieldKey={[transportField.name, "unitaryValue"]}
                          name={[transportField.name, "unitaryValue"]}
                          label="Preço unitário"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <InputNumber
                            min={0.01}
                            step={0.01}
                            parser={fromCurrency}
                            formatter={toCurrency}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  ))}
                </Row>

                <Row gutter={[0, 40]}>
                  <Col span={24}>
                    <Button
                      block
                      type="dashed"
                      onClick={() => add()}
                    >
                      <PlusOutlined /> Adicionar transporte
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
