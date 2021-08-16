import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Space, notification, Switch } from "antd";
import InputMask from "antd-mask-input";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import { User, Role } from "../../../interfaces/user";
import { createUser, updateUser, requestPasswordChange } from "../../../services/user_service";
import { getRoles } from "../../../services/role_service";

interface Props
{
  title: string;
  user?: User;
  closeModal(): void;
  loadUser(): void;
}

export const CreateUser: React.FC<Props> = (props) =>
{
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form] = Form.useForm();

  useEffect(() =>
  {
    (async () =>
    {
      setPasswordRequired(props.user === undefined);
      setRoles(await getRoles());
      form.setFieldsValue(props.user);
    })();
  }, [form, props.user]);

  const submitUser = async (userSubmit: any) =>
  {
    const response = await (props.user === undefined
      ? createUser(userSubmit)
      : updateUser(userSubmit));

    notification.open({ message: response.message });

    form.resetFields();
    props.loadUser();
    props.closeModal();
  };

  const reset = async (userSubmit: User) =>
  {
    if (props.user !== undefined)
      notification.open({ message: await requestPasswordChange(props.user.cpf) });

    form.resetFields();
    props.loadUser();
    props.closeModal();
  };

  const cancel = () =>
  {
    form.resetFields();
    props.closeModal();
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>{props.title}</h1>

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

        {props.user === undefined && (
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
            options={roles.map((r: Role) => ({ label: r.description, value: r._id! }))}
            placeholder="Selecione o tipo de usuário"
            mode="multiple"
            allowClear />
        </Form.Item>

        <Form.Item label="Usuário ativo" name="isActive" valuePropName="isActive">
          <Switch
            defaultChecked={props.user?.isActive}
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
              {props.user === undefined ? "Cadastrar" : "Atualizar"}
            </Button>

            {props.user !== undefined && (
              <Button htmlType="submit" style={{ backgroundColor: "#BB6B00" }} type="primary" onClick={() => reset(props.user!)}>
                {"Resetar senha"}
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};
