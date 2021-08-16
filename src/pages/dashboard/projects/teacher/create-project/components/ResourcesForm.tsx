import React from "react";
import { Form, Input, Button, Space, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import { Material, Project } from "../../../../../../interfaces/project";
import { ContainerFlex } from "../../../../../../global/styles";

interface Props
{
  changeResources(transport: any, resources: Material[]): void;
  previous(): void;
  removeMaterials(index: number): void;
  removeTransport(): void;
  project: Project;
  edited: boolean;
}

export const ResourcesForm: React.FC<Props> = (props) =>
{
  const formatReal = (value: any) =>
  {
    var tmp = value + "";
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
    if (tmp.length > 6)
      tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$),([-])/g, ".$1,$2");

    return tmp;
  };

  const formatInteger = (value: any) =>
  {
    let format = value.toString().replace(/\D/g, "");
    if (format === "0")
      format = "1";

    return format;
  };

  const editMaterial = (index: number, ev: any, nameEvent: any) =>
  {
    if (props.project.resources.materials !== undefined)
    {
      const material = props.project.resources.materials[index] as any;
      material[nameEvent] = ev.target.value;
    }
  };

  const handle = async (value: any) =>
  {
    let materials: Material[] = [];
    if (props.project.resources.materials !== undefined)
      materials = props.project.resources.materials;

    if (value.materials !== undefined)
      for await (let m of value.materials)
        materials.push(m);

    props.changeResources(value.transport?.[0], materials);
  };

  return (
    <ContainerFlex>
      <div>
        <>
          {props.project.resources.materials?.map((m: Material, i: number) => (
            <ContainerFlex>
              <Form
                layout="vertical"
                style={{ maxWidth: "720px" }}
              >
                <Button
                  type="link"
                  style={{ margin: "8px 0", padding: "0" }}
                  onClick={() => props.removeMaterials(i)}
                >
                  <MinusCircleOutlined /> Remover
                </Button>

                <Space
                  align="start"
                  style={{ display: "flex", marginBottom: 8 }}
                >
                  <Form.Item label="Item">
                    <Input
                      defaultValue={m.item}
                      onChange={event => editMaterial(i, event, "item")}
                    />
                  </Form.Item>

                  <Form.Item label="Descrição">
                    <Input
                      defaultValue={m.description}
                      onChange={event => editMaterial(i, event, "description")}
                    />
                  </Form.Item>

                  <Form.Item label="Quantidade">
                    <InputNumber
                      placeholder="Quantidade"
                      defaultValue={m.quantity}
                      min={0}
                      step={1}
                      formatter={value => `${value}`.replace(/\D+/g, "")}
                      onChange={event =>
                      {
                        if (event !== undefined)
                        {
                          const value = event.toString();
                          const ev = { target: { value: value } };
                          editMaterial(i, ev, "quantity");
                        }
                      }}
                    />
                  </Form.Item>

                  <Form.Item label="Preço unitário">
                    <InputNumber
                      placeholder="Preço Unitário"
                      defaultValue={m.unitaryValue}
                      min={0}
                      formatter={value => formatReal(value)}
                      onChange={event =>
                      {
                        if (event !== undefined)
                        {
                          const value = event.toString();
                          const ev = { target: { value: value } };
                          editMaterial(i, ev, "unitaryValue");
                        }
                      }}
                    />
                  </Form.Item>
                </Space>
              </Form>
            </ContainerFlex>
          ))}
        </>

        <ContainerFlex>
          <Form
            style={{ maxWidth: "720px" }}
            layout="vertical"
            onFinish={handle}
          >
            <Form.List name="materials">
              {(materialFields, { add, remove }) => (
                <div>
                  {materialFields.map((materialField) => (
                    <>
                      <Button
                        type="link"
                        style={{ margin: "8px 0", padding: "0" }}
                        onClick={() => remove(materialField.name)}
                      >
                        <MinusCircleOutlined /> Remover
                      </Button>

                      <Space
                        key={materialField.key}
                        align="start"
                        style={{ display: "flex", marginBottom: 8 }}
                      >
                        <Form.Item
                          {...materialField}
                          fieldKey={[materialField.fieldKey, "item"]}
                          name={[materialField.name, "item"]}
                          label="Item"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <Input placeholder="Nome do Item" />
                        </Form.Item>

                        <Form.Item
                          {...materialField}
                          fieldKey={[materialField.fieldKey, "description"]}
                          name={[materialField.name, "description"]}
                          label="Descrição"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <Input placeholder="Descrição" />
                        </Form.Item>

                        {
                          // <Form.Item
                          //   {...field}
                          //   fieldKey={[field.fieldKey, "unity"]}
                          //   name={[field.name, "unity"]}
                          //   label="Unidade"
                          //   rules={[{ required: true, message: "Campo Obrigatório" }]}
                          // >
                          //   <Input placeholder="Unidade" />
                          // </Form.Item>
                        }

                        <Form.Item
                          {...materialField}
                          fieldKey={[materialField.fieldKey, "quantity"]}
                          name={[materialField.name, "quantity"]}
                          label="Quantidade"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <InputNumber
                            placeholder="Quantidade"
                            step={1}
                            formatter={value => formatInteger(value)}
                          />
                        </Form.Item>

                        <Form.Item
                          {...materialField}
                          fieldKey={[materialField.fieldKey, "unitaryValue"]}
                          name={[materialField.name, "unitaryValue"]}
                          label="Preço Unitário"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <InputNumber
                            placeholder="Preço Unitário"
                            formatter={value => formatReal(value)}
                          />
                        </Form.Item>
                      </Space>
                    </>
                  ))}

                  <Form.Item>
                    <>
                      <Button
                        block
                        type="dashed"
                        onClick={() => add()}
                      >
                        <PlusOutlined /> Adicionar Materiais
                      </Button>

                      (quando o projeto exigir materiais específicos.
                      Por exemplo: material descartável para atendimento de
                      saúde, impressão de banner, material para impressora 3D)

                    </>
                  </Form.Item>
                </div>
              )}
            </Form.List>

            <Form.List name="transport">
              {(transportFields, { add, remove }) => (
                <div>
                  {transportFields.map((transportField) => (
                    <>
                      <Button
                        type="link"
                        style={{ margin: "8px 0", padding: "0" }}
                        onClick={() => remove(transportField.name)}
                      >
                        <MinusCircleOutlined /> Remover Transporte
                      </Button>

                      <Space
                        key={transportField.key}
                        align="start"
                        style={{ display: "flex", marginBottom: 8 }}
                      >
                        <Form.Item
                          {...transportField}
                          fieldKey={[transportField.fieldKey, "typeTransport"]}
                          name={[transportField.name, "typeTransport"]}
                          label="Tipo de transporte"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <Input placeholder="Ex: Carro, Moto..." />
                        </Form.Item>

                        <Form.Item
                          {...transportField}
                          fieldKey={[transportField.fieldKey, "description"]}
                          name={[transportField.name, "description"]}
                          label="Descrição"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <Input placeholder="Descrição" />
                        </Form.Item>

                        {
                          // <Form.Item
                          //   {...field}
                          //   fieldKey={[field.fieldKey, "unity"]}
                          //   name={[field.name, "unity"]}
                          //   label="Unidade"
                          //   rules={[{ required: true, message: "Campo Obrigatório" }]}
                          // >
                          //   <Input placeholder="Unidade" />
                          // </Form.Item>
                        }

                        <Form.Item
                          {...transportField}
                          fieldKey={[transportField.fieldKey, "quantity"]}
                          name={[transportField.name, "quantity"]}
                          label="Quantidade"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <InputNumber
                            placeholder="Quantidade"
                            step={1}
                            formatter={value => formatInteger(value)}
                            style={{ appearance: "textfield" }}
                          />
                        </Form.Item>

                        <Form.Item
                            {...transportField}
                            fieldKey={[transportField.fieldKey, "unitaryValue"]}
                            name={[transportField.name, "unitaryValue"]}
                            label="Preço Unitário"
                            rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <InputNumber
                            placeholder="Preço Unitário"
                            defaultValue={0}
                            formatter={value => formatReal(value)}
                          />
                        </Form.Item>
                      </Space>
                    </>
                  ))}

                  {(transportFields.length < 1 && props.project.resources.transport === undefined) && (
                    <Form.Item>
                      <>
                        <Button
                          block
                          type="dashed"
                          onClick={() => add()}
                        >
                          <PlusOutlined /> Adicionar Transporte
                        </Button>

                        (quando a comunidade estiver fora da região metropolitana de Curitiba)
                      </>
                    </Form.Item>
                  )}

                  {(props.project.resources.transport !== undefined) && (
                    <Space style={{ display: "flex", marginBottom: 8 }}>
                      <Button
                        type="link"
                        style={{ margin: "8px 0", padding: "0" }}
                        onClick={props.removeTransport}
                      >
                        <MinusCircleOutlined /> Remover transporte
                      </Button>

                      <Form.Item label="Tipo de transporte">
                        <Input
                          disabled
                          defaultValue={props.project.resources.transport?.typeTransport}
                        />
                      </Form.Item>

                      <Form.Item label="Descrição">
                        <Input
                          disabled
                          defaultValue={props.project.resources.transport?.description}
                        />
                      </Form.Item>

                      <Form.Item label="Quantidade">
                        <InputNumber
                          disabled
                          placeholder="Preço Unitário"
                          defaultValue={props.project.resources.transport?.quantity}
                          formatter={value => `${value}`.replace(/\D+/g, "")}
                        />
                      </Form.Item>

                      <Form.Item label="Preço unitário">
                        <InputNumber
                          disabled
                          placeholder="Quantidade"
                          defaultValue={props.project.resources.transport?.unitaryValue}
                          min={1}
                          step={1}
                          formatter={value => formatReal(value)}
                        />
                      </Form.Item>
                    </Space>
                  )}
                </div>
              )}
            </Form.List>

            <Form.Item>
              <Space style={{ display: "flex", justifyContent: "space-between" }}>
                <Button type="primary" onClick={props.previous}>Anterior</Button>

                <Button type="primary" htmlType="submit">
                  {!props.edited ? "Finalizar" : "Atualizar"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </ContainerFlex>
      </div>
    </ContainerFlex>
  );
};
