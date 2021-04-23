import React, { useEffect } from "react";
import { MinusCircleOutlined, BookOutlined } from "@ant-design/icons";
import { Form, Divider, Button, Select, Input } from "antd";

function DynamicDisciplinesFieldStep1() {
  return (
    <Form.List name="disciplines">
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field, index) => (
              <div key={field.key}>
                <Divider>Disciplina {index + 1}</Divider>
                {fields.length > 1 ? (
                  <Button
                    type="link"
                    onClick={() => remove(field.name)}
                    style={{ margin: "8px 0", padding: "0" }}
                    icon={<MinusCircleOutlined />}
                  >
                    <BookOutlined />
                    Remover Disciplina
                  </Button>
                ) : null}
                <Form.Item
                  {...field}
                  name={[field.name, "name"]}
                  label="Nome da disciplina"
                  rules={[{ required: true, message: "Campo Obrigatório" }]}
                  fieldKey={[field.fieldKey, "name"]}
                >
                  <Input placeholder="Disciplina" />
                </Form.Item>
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
                <BookOutlined /> Adicionar Disciplina
              </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  );
}

export default DynamicDisciplinesFieldStep1;
