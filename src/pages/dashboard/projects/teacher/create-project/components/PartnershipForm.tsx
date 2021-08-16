import React from "react";
import { Form, Input, Button, Space, Divider } from "antd";
import MaskedInput from "antd-mask-input";
import { MinusCircleOutlined, PlusOutlined, UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";

import { Contact, Partnership, Project } from "../../../../../../interfaces/project";
import { ContainerFlex } from "../../../../../../global/styles";

export interface Props
{
  changePartner(values: Partnership[]): void;
  changeEditPartner(event: any, index: number): void;
  addContact(index: number): void;
  previous(): void;
  removeContact(indexParnter: number, indexContact: number): void;
  removePartner(index: number): void;
  project: Project;
}

const { TextArea } = Input;

export const PartnershipForm: React.FC<Props> = (props) =>
{
  const [form] = Form.useForm();
  const totalPartner = props.project.partnership?.length || 0;

  const addPartner = (partners: any) =>
  {
    const changepartners = partners.partners as Partnership[];
    props.changePartner(changepartners);
    form.resetFields();
  };

  return (
    <ContainerFlex>
      <div style={{ width: "100%", maxWidth: "500px" }}>
        {props.project.partnership?.map((p: Partnership, pi: number) => (
          <>
            <Form
              key={pi}
              layout="vertical"
              style={{ width: "100%", maxWidth: "500px" }}
            >
              <h2>Parceria {pi + 1}</h2>

              <Button
                type="link"
                style={{ margin: "8px 0", padding: "0" }}
                onClick={() => props.removePartner(pi)}
              >
                <MinusCircleOutlined /> Remover Parceiro
              </Button>

              <Form.Item
                name={[pi, "text"]}
                label="Sobre"
                rules={[{ required: true, message: "Campo Obrigatório" }]}
              >
                <Input.TextArea
                  defaultValue={p.text}
                  onChange={(event) => props.changeEditPartner(event, pi)}
                />
              </Form.Item>

              {p.contacts.length > 0 && (
                <>
                  {p.contacts.map((c: Contact, ci: number) => (
                    <div key={ci}>
                      <Button
                        type="link"
                        style={{ margin: "8px 0", padding: "0" }}
                        onClick={() => props.removeContact(pi, ci)}
                      >
                        <UserAddOutlined /> Remover Contato
                      </Button>

                      <Space align="start" style={{ display: "flex", marginBottom: 8 }}>
                        <Form.Item
                          name={[ci, "name"]}
                          label="Nome"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <Input defaultValue={c.name} />
                        </Form.Item>

                        <Form.Item
                          name={[ci, "phone"]}
                          label="Telefone"
                          rules={[{ required: true, message: "Campo Obrigatório" }]}
                        >
                          <MaskedInput mask="(11) 11111-1111" defaultValue={c.phone} />
                        </Form.Item>
                      </Space>
                    </div>
                  ))}
                </>
              )}

              <Button
                block
                style={{ backgroundColor: "#439A86", color: "#fff" }}
                onClick={() => props.addContact(pi)}
              >
                <UserAddOutlined /> Adicionar Contato
              </Button>
            </Form>

            <Divider style={{ backgroundColor: "#333" }} />
          </>
        ))}

        <Form
          form={form}
          layout="vertical"
          initialValues={props.project}
          style={{ width: "100%", maxWidth: "500px" }}
          onFinish={addPartner}
        >
          <Form.List name="partners">
            {(partnerFields, { add, remove }) => (
              <>
                {partnerFields.map((partnerField, i) => (
                  <>
                    <div>
                      <Space style={{ width: "100%" }}>
                        <h2 style={{ margin: "8px 0", padding: "0" }}>Parceria {totalPartner + i + 1}</h2>

                        <Button
                          type="link"
                          style={{ margin: "8px 0", padding: "0" }}
                          onClick={() => remove(partnerField.name)}
                        >
                          <MinusCircleOutlined /> Remover Parceiro
                        </Button>
                      </Space>

                      <Form.Item
                        {...partnerField}
                        fieldKey={[partnerField.fieldKey, "text"]}
                        name={[partnerField.name, "text"]}
                        label="Sobre"
                        rules={[{ required: true, message: "Campo Obritarório" }]}
                        style={{ width: "100%" }}
                      >
                        <TextArea placeholder="Fale sobre sua parceria" />
                      </Form.Item>
                    </div>

                    <Form.List name={[partnerField.name, "contacts"]}>
                      {(contactFields, { add, remove }) => (
                        <div>
                          {contactFields.map((contactField) => (
                            <>
                              <Button
                                type="link"
                                style={{ margin: "8px 0", padding: "0" }}
                                onClick={() => remove(contactField.name)}
                              >
                                <UserDeleteOutlined /> Remover contato
                              </Button>

                              <Space
                                key={contactField.key}
                                align="start"
                                style={{ display: "flex", marginBottom: 8 }}
                              >
                                <Form.Item
                                  {...contactField}
                                  fieldKey={[contactField.fieldKey, "name"]}
                                  name={[contactField.name, "name"]}
                                  label="Nome"
                                  rules={[{ required: true, message: "Campo obrigatório" }]}
                                >
                                  <Input placeholder="Nome do contato" />
                                </Form.Item>

                                <Form.Item
                                  {...contactField}
                                  fieldKey={[contactField.fieldKey, "phone"]}
                                  name={[contactField.name, "phone"]}
                                  label="Telefone"
                                  rules={[{ required: true, message: "Campo obrigatório" }]}
                                >
                                  <MaskedInput mask="(11) 11111-1111" />
                                </Form.Item>
                              </Space>
                            </>
                          ))}

                          <Form.Item>
                            <Button
                              block
                              style={{ backgroundColor: "#439A86", color: "#fff" }}
                              onClick={() => add()}
                            >
                              <UserAddOutlined /> Adicionar Contato
                            </Button>
                          </Form.Item>
                        </div>
                      )}
                    </Form.List>

                    <Divider style={{ backgroundColor: "#333" }} />
                  </>
                ))}

                <Form.Item>
                  <Button
                    block
                    type="dashed"
                    onClick={() => add()}
                  >
                    <PlusOutlined /> Adicionar Parceria
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
              <Button type="primary" onClick={props.previous}>
                Anterior
              </Button>

              <Button type="primary" htmlType="submit">
                Próximo
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </ContainerFlex>
  );
};
