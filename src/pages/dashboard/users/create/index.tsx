import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Button, Col, Form, Input, notification, Result, Row, Select } from "antd";
import { MaskedInput } from "antd-mask-input";

import Structure from "../../../../components/layout/structure";
import { useHttpClient } from "../../../../hooks/useHttpClient";

import { Role, User } from "../../../../interfaces/user";
import { Campus, Course } from "../../../../interfaces/course";
import { getAllCoursesEndpoint } from "../../../../services/endpoints/courses";
import { getAllRolesEndpoint } from "../../../../services/endpoints/roles";
import
{
  createUserEndpoint,
  requestUsersPasswordChangeEndpoint,
  updateUserEndpoint
} from "../../../../services/endpoints/users";

interface LocationState
{
  user?: User;
}

interface UrlParams
{
  id: string;
}

export const CreateUserPage: React.FC = () =>
{
  const history = useHistory();
  const params = useParams<UrlParams>();
  const location = useLocation<LocationState>();

  const [hasFinished, setHasFinished] = useState(false);
  const [failedSubmitMessage, setFailedSubmitMessage] = useState("");
  const [formController] = Form.useForm();
  const formUsersRequester = useHttpClient();
  const passwordUsersRequester = useHttpClient();

  const [roles, setRoles] = useState<Role[]>([]);
  const dropDownListRolesRequester = useHttpClient();

  const [courses, setCourses] = useState<Course[]>([]);
  const [shouldRenderCourses, setShouldRenderCourses] = useState(false);
  const dropDownListCoursesRequester = useHttpClient();

  useEffect(() =>
  {
    (async () =>
    {
      const roles = await dropDownListRolesRequester.send<Role[]>(
      {
        method: "GET",
        url: getAllRolesEndpoint(),
        cancellable: true
      });

      setRoles(roles ?? []);

      const courses = await dropDownListCoursesRequester.send<Course[]>(
      {
        method: "GET",
        url: getAllCoursesEndpoint(),
        queryParams: new Map([["withPopulatedRefs", "true"]]),
        cancellable: true
      });

      setCourses(courses ?? []);
    })();

    return () =>
    {
      dropDownListCoursesRequester.halt();
      dropDownListRolesRequester.halt();
      formUsersRequester.halt();
      passwordUsersRequester.halt();
    }
  }, []);

  useEffect(() =>
  {
    if (location.state.user != null)
    {
      isNdesPresident(location.state.user.roles as string[]);
      formController.setFieldsValue(location.state.user);
    }
  }, [formController, roles, location.state]);

  const saveUser = useCallback(async (user: User) =>
  {
    try
    {
      await formUsersRequester.send(params.id == null
      ? {
        method: "POST",
        url: createUserEndpoint(),
        body: user,
        cancellable: true
      }
      : {
        method: "PUT",
        url: updateUserEndpoint(params.id),
        body: user,
        cancellable: true
      });

      setHasFinished(true);
    }
    catch (error)
    {
      if ((error as Error).message !== "")
        setFailedSubmitMessage((error as Error).message);
    }
  }, [formUsersRequester.send]);

  const resetPassword = useCallback(async (cpf: string) =>
  {
    try
    {
      await passwordUsersRequester.send(
      {
        method: "POST",
        url: requestUsersPasswordChangeEndpoint(cpf),
        cancellable: true
      });

      notification.success({ message: "Senha resetada com sucesso!" });
    }
    catch (error)
    {
      if ((error as Error).message !== "")
        notification.error({ message: (error as Error).message });
    }
  }, []);

  const isNdesPresident = useCallback((values: string[]) =>
  {
    const ndesPresidentRoleId = roles.find((r: Role) => r.description === "Presidente do NDE")?._id;
    setShouldRenderCourses(values.some((id: string) => id === ndesPresidentRoleId) ?? false);
  }, [roles]);

  if (hasFinished)
  {
    if (failedSubmitMessage !== "")
      return (
        <Result
          status="error"
          title="Ops! Algo deu errado!"
          subTitle={failedSubmitMessage}
          extra={
          [
            <Button
              type="primary"
              onClick={() => history.goBack()}
            >
              Voltar
            </Button>
          ]}
        />
      );

    return (
      <Result
        status="success"
        title="Usuário salvo com sucesso!"
        extra={
        [
          <Button
            type="primary"
            onClick={() => history.goBack()}
          >
            Continuar
          </Button>
        ]}
      />
    );
  }

  return (
    <Structure title={`${params.id == null ? "Cadastrar" : "Alterar"} usuário`}>
      <Form
        layout="vertical"
        form={formController}
        onFinish={saveUser}
      >
        <Row justify="center" gutter={[0, 0]}>
          <Col xs={24} xl={21} xxl={18}>
            <Form.Item
              name="name"
              label="Nome"
              rules={[{ required: true, message: "Campo Obrigatório" }]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} xl={21} xxl={18}>
            <Form.Item
              name="cpf"
              label="CPF"
              rules={[{ required: true, message: "Campo Obrigatório" }]}
            >
              <MaskedInput mask="111.111.111-11" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} xl={21} xxl={18}>
            <Form.Item
              name="email"
              label="E-Mail"
              rules={[{ required: true, message: "Campo Obrigatório" }]}
            >
              <Input type="email" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} xl={21} xxl={18}>
            <Form.Item
              name="lattes"
              label="ID Lattes"
              rules={[{ required: true, message: "Campo Obrigatório" }]}
            >
              <Input addonBefore="https://cnpq.lattes/" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} xl={21} xxl={18}>
            <Form.Item
              name="password"
              label="Senha"
              rules={[{ required: params.id == null, message: "Campo Obrigatório" }]}
            >
              {params.id == null
                ? <Input.Password type="password" style={{ width: "100%" }} />
                : (
                  <Button
                    block
                    type="primary"
                    loading={passwordUsersRequester.inProgress}
                    onClick={() => resetPassword(location.state.user!.cpf)}
                  >
                    Resetar senha
                  </Button>
                )
              }
            </Form.Item>
          </Col>

          <Col xs={24} xl={21} xxl={18}>
            <Form.Item
              name="roles"
              label="Tipos de usuário"
              rules={[{ required: true, message: "Campo Obrigatório" }]}
            >
              <Select
                options={roles.map((r: Role) => ({ label: r.description, value: r._id! }))}
                mode="multiple"
                allowClear
                onChange={isNdesPresident}
              />
            </Form.Item>
          </Col>

          {shouldRenderCourses && (
            <Col xs={24} xl={21} xxl={18}>
              <Form.Item
                name="courses"
                label="Cursos"
              >
                <Select
                  options={courses.map((c: Course) =>
                  ({
                    label: `${c.name} - ${(c.campus as Campus).name}`,
                    value: c._id!
                  }))}
                  mode="multiple"
                  allowClear
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} xl={21} xxl={18}>
            <Row justify="space-between">
              <Button
                type="default"
                onClick={() => history.goBack()}
              >
                Voltar
              </Button>

              <Button
                htmlType="submit"
                type="primary"
                loading={formUsersRequester.inProgress}
              >
                Salvar
              </Button>
            </Row>
          </Col>
        </Row>
      </Form>
    </Structure>
  );
};