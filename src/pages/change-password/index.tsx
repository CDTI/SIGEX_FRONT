import React from "react";
import { Form, Input, Button, notification } from "antd";

import { FormDiv, Container, LabelInput, ContainerImage, ImageLogo } from "./style";

import logo from "../../assets/sigex.png";
import { changePassword } from "../../services/user_service";
import { useUrlQueryParams } from "../../hooks/useUrlQueryParams";

export const ChangePasswordPage: React.FC = () =>
{
  const urlQueryParams = useUrlQueryParams();
  const userId = urlQueryParams.get("userId");
  const token = urlQueryParams.get("token");
  const [form] = Form.useForm();

  const handleChangePassword = async (value: any) =>
  {
    try
    {
      await changePassword({ userId, token, password: value.password });

      form.resetFields();
      notification.success({ message: "Senha alterada com sucesso!" });

      setTimeout(() => window.location.href = "/login", 1500);
    }
    catch (err)
    {
      notification.error({ message: err.response.data });
    }
  };

  return(
    <Container>
      <FormDiv>
        <ContainerImage>
          <ImageLogo src={logo} />
        </ContainerImage>

        <Form
          form={form}
          onFinish={handleChangePassword}
          layout="vertical"
          style={{ maxWidth: "520px", width: "100%", color: "#fff !important" }}
        >
          <LabelInput>Nova senha</LabelInput>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input.Password type="password" placeholder="Digite sua senha..." draggable />
          </Form.Item>

          <LabelInput>Confirmar nova senha</LabelInput>
          <Form.Item
            name="confirmation"
            rules={
            [
              { required: true, message: "Campo obrigatório" },
              ({ getFieldValue }) => ({ validator(_, value)
              {
                if (!value || getFieldValue("password") === value)
                  return Promise.resolve();

                return Promise.reject(new Error("As senhas digitadas não coincidem"));
              }})
            ]}
          >
            <Input.Password type="password" placeholder="Digite novamente sua senha..." draggable />
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button type="primary" htmlType="submit">Enviar</Button>
            </div>
          </Form.Item>
        </Form>
      </FormDiv>
    </Container>);
};
