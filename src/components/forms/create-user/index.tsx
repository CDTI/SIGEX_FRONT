import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Space, notification, Switch } from "antd";
import InputMask from "antd-mask-input";
import { createUser, updateUser, requestPasswordChange } from "../../../services/user_service";
import IUser from "../../../interfaces/user";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { IRole } from "../../../interfaces/role";
import { getRoles } from "../../../services/role_service";

interface Props
{
  title: string;
  user?: IUser;
  closeModal(): void;
  loadUser(): void;
}

const CreateUser: React.FC<Props> = ({ closeModal, loadUser, user, title }) =>
{
  const [form] = Form.useForm();
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [roles, setRoles] = useState<IRole[]>([]);

  useEffect(() =>
  {
    (async () =>
    {
      setPasswordRequired(user === undefined);
      setRoles(await getRoles());
      form.setFieldsValue(user);
    })();
  }, [form, user]);

  const submitUser = async (userSubmit: any) =>
  {
    const response = await (user === undefined
      ? createUser(userSubmit)
      : updateUser(userSubmit));

    notification.open({ message: response.message });

    form.resetFields();
    loadUser();
    closeModal();
  };

  const reset = async (userSubmit: IUser) =>
  {
    if (user !== undefined)
      notification.open({ message: await requestPasswordChange(user.cpf) });

    form.resetFields();
    loadUser();
    closeModal();
  };

  const cancel = () =>
  {
    form.resetFields();
    closeModal();
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>{title}</h1>

      <Form form={form} layout="vertical" onFinish={submitUser}>
        <Form.Item name="name" label="Nome" rules={[{ required: true, message: "Campo Obrigatório" }]}>
          <Input placeholder="Digite o Nome" />
        </Form.Item>

        <Form.Item name="cpf" label="CPF" rules={[{ required: true, message: "Campo Obrigatório" }]}>
          <InputMask mask="111.111.111-11" />
        </Form.Item>

        <Form.Item name="email" label="E-Mail" rules={[{ required: true, message: "Campo Obrigatório" }]}>
          <Input placeholder="Digite o E-Mail" />
        </Form.Item>

        <Form.Item name="lattes" label="Cod. Lattes" rules={[{ required: true, message: "Campo Obrigatório" }]}>
          <Input addonBefore="https://cnpq.lattes/" placeholder="Digite o código lattes" />
        </Form.Item>

        {user === undefined && (
          <Form.Item
            name="password"
            label="Senha"
            rules={[{ required: passwordRequired, message: "Campo Obrigatório" }]}
          >
            <Input.Password draggable type="password" placeholder="Digite a Senha" />
          </Form.Item>
        )}

        <Form.Item name="roles" label="Tipo de usuário" rules={[{ required: true, message: "Campo Obrigatório" }]}>
          <Select
            options={roles.map((r: IRole) => ({ label: r.description, value: r._id }))}
            placeholder="Selecione o tipo de usuário"
            mode="multiple"
            allowClear />
        </Form.Item>

        <Form.Item label="Usuário ativo" name="isActive" valuePropName="isActive">
          <Switch
            defaultChecked={user?.isActive}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" style={{ backgroundColor: "#a31621" }} onClick={cancel}>
              Cancelar
            </Button>

            <Button htmlType="submit" style={{ backgroundColor: "#439A86" }} type="primary">
              {user === undefined ? "Cadastrar" : "Atualizar"}
            </Button>

            {user !== undefined && (
              <Button htmlType="submit" style={{ backgroundColor: "#BB6B00" }} type="primary" onClick={() => reset(user)}>
                {"Resetar senha"}
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateUser;
