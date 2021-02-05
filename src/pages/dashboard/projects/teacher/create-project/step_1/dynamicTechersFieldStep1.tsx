import React from "react";
import { MinusCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import { Form, Divider, Button, Input, Space } from "antd";
import InputMask from "antd-mask-input";

export interface Props {
  typeProject: string;
}

const DynamicTechersFieldStep1: React.FC<Props> = ({ typeProject }) => {
  return (
    <Form.List name="teachers">
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field, index) => (
              <div key={field.key}>
                <Divider>Professor {index + 1}</Divider>
                {fields.length > 1 ? (
                  <Button
                    type="link"
                    onClick={() => remove(field.name)}
                    style={{ margin: "8px 0", padding: "0" }}
                    icon={<MinusCircleOutlined />}
                  >
                    <UserAddOutlined />
                    Remover Professor
                  </Button>
                ) : null}

                <Space key={field.key} style={{ display: "flex", marginBottom: 8 }} align="start">
                  <Form.Item
                    {...field}
                    name={[field.name, "name"]}
                    label="Nome"
                    rules={[{ required: true, message: "Campo Obrigatório"  }]}
                    fieldKey={[field.fieldKey, "name"]}
                  >
                    <Input placeholder="Professor" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, "registration"]}
                    label="Matrícula"
                    rules={[{ required: true, message: "Campo Obrigatório"  }]}
                    fieldKey={[field.fieldKey, "registration"]}
                  >
                    <Input placeholder="Matrícula" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, "cpf"]}
                    label="CPF"
                    rules={[{ required: true, message: "Campo Obrigatório"  }]}
                    fieldKey={[field.fieldKey, "cpf"]}
                  >
                    <InputMask placeholder="CPF" mask="111.111.111-11" />
                  </Form.Item>
                </Space>

                <Space key={field.key} style={{ display: "flex", marginBottom: 8 }} align="start">
                  <Form.Item
                    {...field}
                    name={[field.name, "email"]}
                    label="E-mail"
                    rules={[{ required: true, message: "Campo Obrigatório"  }]}
                    fieldKey={[field.fieldKey, "email"]}
                  >
                    <Input placeholder="E-mail" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, "phone"]}
                    label="Telefone"
                    rules={[{ required: true, message: "Campo Obrigatório"  }]}
                    fieldKey={[field.fieldKey, "phone"]}
                  >
                    <InputMask placeholder="Telefone" mask="(11) 1111-1111" />
                  </Form.Item>
                  {typeProject === "extraCurricular" && (
                    <Form.Item
                      {...field}
                      name={[field.name, "totalCH"]}
                      label="Carga horária fora de sala"
                      rules={[{ required: true, message: "Campo Obrigatório"  }]}
                      fieldKey={[field.fieldKey, "totalCH"]}
                    >
                      <Input placeholder="Carga horária" />
                    </Form.Item>
                  )}
                </Space>
              </div>
            ))}
            <Divider />
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  add();
                }}
                block
              >
                <UserAddOutlined /> Adicionar Professor
              </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  );
};

export default DynamicTechersFieldStep1;
