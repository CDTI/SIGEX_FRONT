import React from "react";
import { Form, Divider, Button, Input } from "antd";
import { MinusCircleOutlined, BookOutlined } from "@ant-design/icons";

export const DisciplinesFormList: React.FC = () =>
{
  return (
    <Form.List name="disciplines">
      {(disciplineFields, { add, remove }) => (
        <div>
          {disciplineFields.map((disciplineField, i) => (
            <div key={disciplineField.key}>
              <Divider>Disciplina {i + 1}</Divider>

              {disciplineFields.length > 1 && (
                <Button
                  type="link"
                  onClick={() => remove(disciplineField.name)}
                  style={{ margin: "8px 0", padding: "0" }}
                  icon={<MinusCircleOutlined />}
                >
                  <BookOutlined /> Remover Disciplina
                </Button>
              )}

              <Form.Item
                {...disciplineField}
                fieldKey={[disciplineField.fieldKey, "name"]}
                name={[disciplineField.name, "name"]}
                label="Nome da disciplina"
                rules={[{ required: true, message: "Campo Obrigatório" }]}
              >
                <Input placeholder="Disciplina" />
              </Form.Item>
            </div>
          ))}

          <Divider />

          <Form.Item>
            <Button
              block
              type="dashed"
              onClick={() => add()}
            >
              <BookOutlined /> Adicionar Disciplina
            </Button>
          </Form.Item>
        </div>
      )}
    </Form.List>
  );
}
