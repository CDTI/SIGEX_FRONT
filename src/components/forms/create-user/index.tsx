import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Space, notification, Switch } from "antd";
import InputMask from "antd-mask-input";
import { createUser, updateUser, resetPassword } from "../../../services/user_service";
import { UserInterface } from "../../../interfaces/user";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Option } = Select;

interface Props {
  title: string;
  closeModal(): void;
  loadUser(): void;
  user?: UserInterface;
}

const CreateUser: React.FC<Props> = ({ closeModal, loadUser, user, title }) => {
  const [form] = Form.useForm();
  const [passwordRequired, setPasswordRequired] = useState(false);

  useEffect(() => {
    if (user !== undefined) {
      setPasswordRequired(false);
    } else {
      setPasswordRequired(true);
    }
    form.setFieldsValue(user);
  }, [form, user]);

  const submitUser = async (userSubmit: any) => {
    if (user === undefined) {
      const newUser = await createUser(userSubmit);

      notification.open({ message: newUser.message });
    } else {
      const userUpdate = await updateUser(userSubmit);

      notification.open({ message: userUpdate.message });
    }
    form.resetFields();
    loadUser();
    closeModal();
  };

  const reset = async (userSubmit: UserInterface) => { 
    if (user !== undefined) {
      const userUpdated = await resetPassword(user);

      notification.open({ message: userUpdated.message });
    }
    form.resetFields();
    loadUser();
    closeModal();
  };

  const cancel = () => {
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
        <Form.Item name="role" label="Tipo de usuário" rules={[{ required: true, message: "Campo Obrigatório" }]}>
          <Select placeholder="Seleciona o tipo de usuário" mode="multiple" allowClear>
            <Option value="teacher">Professor</Option>
            <Option value="admin">Administrador</Option>
            <Option value="ndePresident">Presidente NDE</Option>
            <Option value="integrationCoord">Coordenador de integração</Option>
          </Select>
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
