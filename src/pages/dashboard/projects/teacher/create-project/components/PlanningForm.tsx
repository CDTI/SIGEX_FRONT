import React from "react";
import { Form, Input, Button, Space, Divider } from "antd";
import { MaskedInput } from "antd-mask-input";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

import { Planning, Project } from "../../../../../../interfaces/project";
import { ContainerFlex } from "../../../../../../global/styles";

interface Props
{
  changePlanning(plannings: Planning[]): void;
  removeStep(index: number): void;
  previous(): void;
  project: Project;
  changeStep(
    index: number,
    name: "developmentSite" | "developmentMode" | "startDate" | "finalDate" | "text",
    value: string): void;
}

export const PlanningForm: React.FC<Props> = (props) =>
{
  const totalSteps = props.project.planning.length;

  const handlePlanning = async (event: any) =>
  {
    props.changePlanning(event.planning || []);
  };

  return (
    <ContainerFlex>
      <div style={{ maxWidth: "520px", width: "100%" }}>
        <div style={{ width: "100%" }}>
          <div style={{ maxWidth: "520px", width: "100%" }}>
            {props.project.planning.map((p: Planning, i: number) => (
              <div>
                <h2>Etapa {i + 1}</h2>

                {i !== 0 && (
                  <Button
                    type="link"
                    style={{ margin: "8px 0", padding: "0" }}
                    onClick={() => props.removeStep(i)}
                  >
                    <MinusCircleOutlined /> Excluir
                  </Button>
                )}

                <Form layout="vertical">
                  <Form.Item
                    name={[i, "text"]}
                    label="Etapa"
                    rules={[{ required: true, message: "Campo Obrigatório" }]}
                  >
                    <Input
                      defaultValue={p.text}
                      onChange={event => props.changeStep(i, "text", event.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[i, "developmentSite"]}
                    label="Onde será desenvolvida"
                    rules={[{ required: true, message: "Campo Obrigatório" }]}
                  >
                    <Input
                      defaultValue={p.developmentSite}
                      onChange={event => props.changeStep(i, "developmentSite", event.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[i, "developmentMode"]}
                    label="
                      Como será desenvolvida (indicar recursos de
                      infraestrutura necessários, tais como laboratório de
                      informática, laboratório específico, etc.)"
                    rules={[{ required: true, message: "Campo Obrigatório" }]}
                  >
                    <Input
                      defaultValue={p.developmentMode}
                      onChange={event => props.changeStep(i, "developmentMode", event.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[i, "startDate"]}
                    label="Data de inicío"
                    rules={[{ required: true, message: "Campo Obrigatório" }]}
                  >
                    <MaskedInput
                      mask="11/11/1111"
                      defaultValue={p.startDate}
                      onChange={event => props.changeStep(i, "startDate", event.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[i, "finalDate"]}
                    label="Data de término"
                    rules={[{ required: true, message: "Campo Obrigatório" }]}
                  >
                    <MaskedInput
                      mask="11/11/1111"
                      defaultValue={p.finalDate}
                      onChange={event => props.changeStep(i, "finalDate", event.target.value)}
                    />
                  </Form.Item>
                </Form>

                <Divider style={{ backgroundColor: "#333" }} />
              </div>
            ))}
          </div>

          <Form
            layout="vertical"
            initialValues={props.project.planning}
            style={{ maxWidth: "520px", width: "100%" }}
            onFinish={handlePlanning}
          >
            <Form.List name="planning">
              {(planningFields, { add, remove }) => (
                <div>
                  {planningFields.map((planningField, i) => (
                    <>
                      <h2>Etapa {totalSteps + i + 1}</h2>

                      {(planningFields.length > 1 || props.project.planning.length > 0) && (
                        <Button
                          type="link"
                          style={{ margin: "8px 0", padding: "0" }}
                          onClick={() => remove(planningField.name)}
                        >
                          <MinusCircleOutlined /> Excluir
                        </Button>
                      )}

                      <Form.Item key={planningField.key} required={false}>
                        <Form.Item
                          {...planningField}
                          name={[planningField.name, "text"]}
                          label={`Etapa ${i + 1}`}
                          fieldKey={[planningField.fieldKey, "text"]}
                          rules={
                          [
                            { required: true, message: "Campo obrigatório" },
                            { max: 200, message: "Número de caracteres ultrapassado" }
                          ]}
                        >
                          <Input placeholder="Descreva a etapa" />
                        </Form.Item>

                        <Form.Item
                          {...planningField}
                          name={[planningField.name, "developmentSite"]}
                          label="Local"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <Input placeholder="Indicar o local onde essa etapa será desenvolvida" />
                        </Form.Item>

                        <Form.Item
                          {...planningField}
                          name={[planningField.name, "developmentMode"]}
                          label="
                            Como será desenvolvida (indicar recursos de
                            infraestrutura necessários, tais como laboratório de
                            informática, laboratório específico, etc.)"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <Input placeholder="Como será desenvolvida?" />
                        </Form.Item>

                        <Form.Item
                          {...planningField}
                          name={[planningField.name, "startDate"]}
                          label="Data de inicío"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <MaskedInput mask="11/11/1111" />
                        </Form.Item>

                        <Form.Item
                          {...planningField}
                          name={[planningField.name, "finalDate"]}
                          label="Data de término"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <MaskedInput mask="11/11/1111" />
                        </Form.Item>
                      </Form.Item>

                      <Divider style={{ backgroundColor: "#333" }} />
                    </>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      style={{ width: "100%" }}
                      onClick={() => add()}
                    >
                      <PlusOutlined /> Adicionar Etapa
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>

            <Form.Item>
              <Space style={{ display: "flex", justifyContent: "space-between" }}>
                <Button type="primary" onClick={props.previous}>Anterior</Button>
                <Button htmlType="submit" type="primary">Próximo</Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
    </ContainerFlex>
  );
};
