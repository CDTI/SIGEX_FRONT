import React, { useEffect, useState } from "react";
import
{
  Button,
  Form,
  Input,
  Select,
  Space
} from "antd";

import { IRole } from "../../../../interfaces/role";
import { INotice } from "../../../../interfaces/notice";
import { ContainerFlex } from "../../../../global/styles";
import { getRoles } from "../../../../services/role_service";

interface Props
{
  notice: INotice;
  onBack(): void;
  onSubmit(notice: INotice): void;
}

const CreateNotice: React.FC<Props> = ({ notice, onBack, onSubmit }) =>
{
  const [roles, setRoles] = useState<IRole[]>([]);
  const [form] = Form.useForm();

  useEffect(() =>
  {
    (async () => setRoles(await getRoles()))();
    form.setFieldsValue(notice);
  }, [form, notice]);

  return (
    <ContainerFlex>
      <Form
        form={form}
        layout="vertical"
        style={{ width: "100%", maxWidth: "768px" }}
        onFinish={(values: INotice) => onSubmit(values)}
      >
        <Form.Item name="_id">
          <Input type="hidden" />
        </Form.Item>

        <Form.Item name="number" label="Número">
          <Input type="number" />
        </Form.Item>

        <Form.Item name="name" label="Nome">
          <Input />
        </Form.Item>

        <Form.Item
          name="canAccess"
          label="Permissões de acesso"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Select
            options={roles.map((r: IRole) => ({ label: r.description, value: r._id }))}
            placeholder="Selecione funções de usuário"
            mode="multiple"
            allowClear />
        </Form.Item>

        <Form.Item>
          <Space style={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="default" onClick={onBack}>
              Voltar
            </Button>

            <Button type="primary" htmlType="submit">
              Salvar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </ContainerFlex>);
};

export default CreateNotice;