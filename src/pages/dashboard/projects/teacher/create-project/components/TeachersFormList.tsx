import React from "react";
import { Form, Divider, Button, Input, Space } from "antd";
import InputMask from "antd-mask-input";
import { MinusCircleOutlined, UserAddOutlined } from "@ant-design/icons";

interface Props
{
  typeProject: string;
}

export const TeachersFormList: React.FC<Props> = (props) =>
{
  return (
    <Form.List name="teachers">
      {(teacherFields, { add, remove }) => (
        <div>
          {teacherFields.map((teacherField, i) => (
            <div key={teacherField.key}>
              <Divider>Professor {i + 1}</Divider>

              {teacherFields.length > 1 && (
                <Button
                  type="link"
                  icon={<MinusCircleOutlined />}
                  style={{ margin: "8px 0", padding: "0" }}
                  onClick={() => remove(teacherField.name)}
                >
                  <UserAddOutlined /> Remover Professor
                </Button>
              )}

              <Space
                key={teacherField.key}
                align="start"
                style={{ display: "flex", marginBottom: 8 }}
              >
                <Form.Item
                  {...teacherField}
                  fieldKey={[teacherField.fieldKey, "name"]}
                  name={[teacherField.name, "name"]}
                  label="Nome"
                  rules={[{ required: true, message: "Campo Obrigatório"  }]}
                >
                  <Input placeholder="Professor" />
                </Form.Item>

                <Form.Item
                  {...teacherField}
                  fieldKey={[teacherField.fieldKey, "registration"]}
                  name={[teacherField.name, "registration"]}
                  label="Matrícula"
                  rules={[{ required: true, message: "Campo Obrigatório"  }]}
                >
                  <Input placeholder="Matrícula" />
                </Form.Item>

                <Form.Item
                  {...teacherField}
                  fieldKey={[teacherField.fieldKey, "cpf"]}
                  name={[teacherField.name, "cpf"]}
                  label="CPF"
                  rules={[{ required: true, message: "Campo Obrigatório"  }]}
                >
                  <InputMask placeholder="CPF" mask="111.111.111-11" />
                </Form.Item>
              </Space>

              <Space
                key={teacherField.key}
                align="start"
                style={{ display: "flex", marginBottom: 8 }}
              >
                <Form.Item
                  {...teacherField}
                  fieldKey={[teacherField.fieldKey, "email"]}
                  name={[teacherField.name, "email"]}
                  label="E-mail"
                  rules={[{ required: true, message: "Campo Obrigatório"  }]}
                >
                  <Input placeholder="E-mail" />
                </Form.Item>

                <Form.Item
                  {...teacherField}
                  fieldKey={[teacherField.fieldKey, "phone"]}
                  name={[teacherField.name, "phone"]}
                  label="Telefone"
                  rules={[{ required: true, message: "Campo Obrigatório"  }]}
                >
                  <InputMask placeholder="Telefone" mask="(11) 1111-1111" />
                </Form.Item>

                {props.typeProject === "extraCurricular" && (
                  <Form.Item
                    {...teacherField}
                    fieldKey={[teacherField.fieldKey, "totalCH"]}
                    name={[teacherField.name, "totalCH"]}
                    label="Carga horária fora de sala"
                    rules={[{ required: true, message: "Campo Obrigatório"  }]}
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
              block
              type="dashed"
              onClick={() => add()}
            >
              <UserAddOutlined /> Adicionar Professor
            </Button>
          </Form.Item>
        </div>
      )}
    </Form.List>
  );
};
