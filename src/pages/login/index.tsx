import crypto from "crypto";
import React, { useCallback, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Input, Spin, notification } from "antd";
import InputMask from "antd-mask-input";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "dotenv/config";

import {
  FormDiv,
  Container,
  LabelInput,
  ContainerImage,
  ImageLogo,
} from "./style";

import { Role, User } from "../../interfaces/user";
import { checkUser, hasPasswordChangeToken } from "../../services/user_service";
import logo from "../../assets/sigex.png";
import { useHttpClient } from "../../hooks/useHttpClient";
import { AuthContext } from "../../context/auth";
import { getAllRolesEndpoint } from "../../services/endpoints/roles";
import {
  createUserEndpoint,
  loginUserEndpoint,
} from "../../services/endpoints/users";

interface Credentials {
  cpf: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const history = useHistory();
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [cpf, setCpf] = useState("");
  const [newUser, setNewUser] = useState(false);
  const [loginUser, setLoginUser] = useState(false);
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [form] = Form.useForm();

  const formUsersRequester = useHttpClient();
  const handlerRolesRequester = useHttpClient();

  const onFinish = useCallback(
    async (values: Credentials) => {
      try {
        let status: "success" | "error" = "success";
        const response = await formUsersRequester.send({
          ...loginUserEndpoint(),
          body: values,
          cancellable: true,
        });

        status = response.status;
        if (response.token !== null && response.status === "success") {
          authContext.login!(response.token, response.user);
          notification[status]({ message: response.message });
        } else if (response.token === null && response.status === "error") {
          notification[status]({ message: response.message });
        }
      } catch (error) {
        if ((error as Error).message !== "")
          notification.error({ message: (error as Error).message });
      }
      authContext.setLoading!(false);
      // setLoading(false);
    },
    [formUsersRequester.send, authContext]
  );

  const back = () => {
    setCpf("");
    form.resetFields();
    setNewUser(false);
    setLoginUser(false);
  };

  const handleCreateUser = useCallback(async (user: User) => {
    try {
      const roles = await handlerRolesRequester.send<Role[]>({
        method: "GET",
        url: getAllRolesEndpoint(),
        cancellable: true,
      });

      await formUsersRequester.send({
        ...createUserEndpoint(),
        body: {
          ...user,
          roles:
            roles
              ?.filter((r: Role) => r.description === "Professor")
              .map((r: Role) => r._id) ?? [],
          isActive: true,
        },
      });

      setCpf(user.cpf);
      setPassword(user.password!);
      setNewUser(false);
      setLoginUser(true);

      notification.success({ message: "Usuário cadastrado com sucesso" });

      onFinish({ cpf: user.cpf, password: user.password! });
    } catch (error) {
      notification.error({ message: "Erro ao cadastrar usuário" });
    }
  }, []);

  const handleCheckUser = async (value: any) => {
    const check = await checkUser(value);
    setCpf(value.cpf);
    const cpf = { cpf: value.cpf };
    form.setFieldsValue(cpf);
    if (check) setLoginUser(true);
    else setNewUser(true);
  };

  const handleForgotPassword = () => {
    form.resetFields();
    setNewUser(false);
    setLoginUser(false);
    setForgotPassword(true);
  };

  const handlePasswordChangeRequest = async (value: any) => {
    try {
      const id = await hasPasswordChangeToken(cpf);

      const key = crypto.createHash("sha256").update("S1g3x@UP").digest();

      const iv = crypto
        .createHash("sha256")
        .update(new Date().toISOString().split("T")[0])
        .digest();
      const cipher = crypto
        .createCipheriv("aes-256-gcm", key, iv)
        .setEncoding("hex");

      const token = JSON.stringify({
        id,
        cpf,
        name: value.name.toUpperCase(),
        email: value.email.toLowerCase(),
      });
      const encryptedToken =
        iv.toString("hex") + cipher.update(token).toString("hex");
      history.push(`/alterar-senha?userId=${id}&token=${encryptedToken}`);
    } catch (err) {
      console.log(err);
      notification.error({ message: err.response.data });

      form.resetFields();
      form.setFieldsValue({ cpf });

      setForgotPassword(false);
      setLoginUser(true);
    }
  };

  return (
    <Container>
      {!authContext.loading && (
        <FormDiv>
          <ContainerImage>
            <ImageLogo src={logo} />
          </ContainerImage>

          {!newUser && !loginUser && !forgotPassword && (
            <Form
              form={form}
              onFinish={handleCheckUser}
              style={{
                maxWidth: "520px",
                width: "100%",
                color: "#fff !important",
              }}
              layout="vertical"
            >
              <LabelInput>CPF</LabelInput>
              <Form.Item
                name="cpf"
                rules={[{ required: true, message: "Campo Obrigatório " }]}
              >
                <InputMask mask="111.111.111-11" />
              </Form.Item>

              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Avançar
                </Button>
              </Form.Item>
            </Form>
          )}

          {loginUser && (
            <>
              <Button
                type="link"
                style={{ margin: "10px 0", padding: "5px 0", color: "#fff" }}
                onClick={back}
              >
                <ArrowLeftOutlined />
                Voltar
              </Button>

              <Form name="basic" onFinish={onFinish} form={form}>
                <LabelInput>CPF</LabelInput>
                <Form.Item
                  name="cpf"
                  rules={[{ required: true, message: "Campo obrigatório" }]}
                >
                  <Input placeholder="Digite seu CPF" disabled />
                </Form.Item>

                <LabelInput>Senha</LabelInput>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Campo obrigatório" }]}
                >
                  <Input.Password
                    draggable
                    type="password"
                    placeholder="Digite sua senha"
                  />
                </Form.Item>

                <Form.Item>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="link"
                      htmlType="button"
                      onClick={handleForgotPassword}
                    >
                      Esqueceu sua senha?
                    </Button>
                  </div>
                </Form.Item>

                <Form.Item>
                  <p style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit">
                      Login
                    </Button>
                  </p>
                </Form.Item>
              </Form>
            </>
          )}

          {newUser && (
            <>
              <Button
                type="link"
                style={{ margin: "10px 0", padding: "5px 0", color: "#fff" }}
                onClick={back}
              >
                <ArrowLeftOutlined />
                Voltar
              </Button>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleCreateUser}
                style={{ maxWidth: "520px", width: "100%" }}
              >
                <LabelInput>CPF</LabelInput>
                <Form.Item
                  name="cpf"
                  rules={[{ required: true, message: "Campo Obrigatório" }]}
                >
                  <InputMask mask="111.111.111-11" disabled />
                </Form.Item>

                <LabelInput>Name</LabelInput>
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: "Campo Obrigatório" }]}
                >
                  <Input placeholder="Digite o seu Nome" />
                </Form.Item>

                <LabelInput>E-Mail</LabelInput>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: "Campo Obrigatório" }]}
                >
                  <Input placeholder="Digite o E-Mail" />
                </Form.Item>

                <LabelInput>Cod. Lattes</LabelInput>
                <Form.Item name="lattes">
                  <Input
                    addonBefore="https://cnpq.lattes/"
                    placeholder="Digite o código lattes"
                  />
                </Form.Item>

                <LabelInput>Senha</LabelInput>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Campo Obrigatório" }]}
                >
                  <Input.Password
                    draggable
                    type="password"
                    placeholder="Digite a Senha"
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Cadastrar
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}

          {forgotPassword && (
            <Form
              form={form}
              layout="vertical"
              onFinish={handlePasswordChangeRequest}
              style={{ maxWidth: "520px", width: "100%" }}
            >
              <Form.Item>
                <LabelInput>
                  Forneça alguns dados para completar a redefinição da sua
                  senha.
                </LabelInput>
              </Form.Item>

              <LabelInput>Nome</LabelInput>
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Input placeholder="Digite seu nome"></Input>
              </Form.Item>

              <LabelInput>E-mail</LabelInput>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Input placeholder="Digite o e-mail"></Input>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Enviar
                </Button>
              </Form.Item>
            </Form>
          )}
        </FormDiv>
      )}

      {authContext.loading && <Spin size="large" />}
    </Container>
  );
};
