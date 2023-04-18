import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Result,
  Row,
  Select,
} from "antd";
import { MaskedInput } from "antd-mask-input";

import Structure from "../../../../components/layout/structure";
import { useHttpClient } from "../../../../hooks/useHttpClient";

import { Role, User } from "../../../../interfaces/user";
import { Campus, Course } from "../../../../interfaces/course";
import { getAllCoursesEndpoint } from "../../../../services/endpoints/courses";
import { getAllRolesEndpoint } from "../../../../services/endpoints/roles";
import {
  createUserEndpoint,
  requestUsersPasswordChangeEndpoint,
  updateUserEndpoint,
  updateUserProfileEndpoint,
} from "../../../../services/endpoints/users";
import { AuthContext } from "../../../../context/auth";

interface LocationState {
  user?: User;
  context: "admin" | "user";
}

interface UrlParams {
  id: string;
}

export const CreateUserPage: React.FC = () => {
  const authContext = useContext(AuthContext);
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

  const saveUser = useCallback(
    async (values: any) => {
      try {
        delete values.confirmPassword;

        await formUsersRequester.send({
          ...(params.id != null
            ? updateUserEndpoint(params.id)
            : location.state.context === "admin"
            ? createUserEndpoint()
            : updateUserProfileEndpoint()),

          body: values,
          cancellable: true,
        });

        if (location.state.context === "admin") {
          setHasFinished(true);
        } else {
          const updatedUser = { ...authContext.user, ...values };
          delete updatedUser.password;

          authContext.update!(updatedUser);
          formController.resetFields();
          formController.setFieldsValue(updatedUser);

          notification.success({ message: "Perfil atualizado com sucesso!" });
        }
      } catch (error) {
        if ((error as Error).message !== "")
          location.state.context === "admin"
            ? setFailedSubmitMessage((error as Error).message)
            : notification.error({ message: (error as Error).message });
      }
    },
    [location.state, formUsersRequester.send]
  );

  const resetPassword = useCallback(async (cpf: string) => {
    try {
      await passwordUsersRequester.send({
        method: "POST",
        url: requestUsersPasswordChangeEndpoint(cpf),
        cancellable: true,
      });

      notification.success({
        message: "O usuário foi marcado para redefinição de senha com sucesso!",
      });
    } catch (error) {
      if ((error as Error).message !== "")
        notification.error({ message: (error as Error).message });
    }
  }, []);

  const isNdesPresidentOrSchoolCoordinator = useCallback(
    (values: string[]) => {
      const selectedRoles = values
        ? values
        : formController.getFieldValue("roles");
      const ndePresidentOrSchoolCoordinator = selectedRoles.filter(
        (r: string) =>
          getRoleName(r) === "Presidente do NDE" ||
          getRoleName(r) === "Coordenador de escola"
      );
      setShouldRenderCourses(
        Boolean(ndePresidentOrSchoolCoordinator.length) ?? false
      );
    },
    [roles]
  );

  const getRoleName = (roleId: string) => {
    return roles.find((element: Role) => element._id === roleId)?.description;
  };

  const pageTitle = useMemo(() => {
    if (location.state.context === "user") return "Perfil de usuário";

    return `${params.id == null ? "Cadastrar" : "Alterar"} usuário`;
  }, []);

  useEffect(() => {
    (async () => {
      const roles = await dropDownListRolesRequester.send<Role[]>({
        method: "GET",
        url: getAllRolesEndpoint(),
        cancellable: true,
      });

      setRoles(roles ?? []);

      const courses = await dropDownListCoursesRequester.send<Course[]>({
        method: "GET",
        url: getAllCoursesEndpoint(),
        queryParams: new Map([["withPopulatedRefs", "true"]]),
        cancellable: true,
      });

      setCourses(courses ?? []);
    })();

    return () => {
      dropDownListCoursesRequester.halt();
      dropDownListRolesRequester.halt();
      formUsersRequester.halt();
      passwordUsersRequester.halt();
    };
  }, []);

  useEffect(() => {
    if (location.state?.user != null) {
      isNdesPresidentOrSchoolCoordinator(location.state.user.roles as string[]);
      formController.setFieldsValue(location.state.user);
    }
  }, [
    formController,
    roles,
    location.state,
    isNdesPresidentOrSchoolCoordinator,
  ]);

  if (location.state.context === "admin" && hasFinished) {
    if (failedSubmitMessage !== "")
      return (
        <Result
          status="error"
          title="Ops! Algo deu errado!"
          subTitle={failedSubmitMessage}
          extra={[
            <Button type="primary" onClick={() => history.goBack()}>
              Voltar
            </Button>,
          ]}
        />
      );

    return (
      <Result
        status="success"
        title="Usuário salvo com sucesso!"
        extra={[
          <Button type="primary" onClick={() => history.goBack()}>
            Continuar
          </Button>,
        ]}
      />
    );
  }

  return (
    <Structure title={pageTitle}>
      <Form layout="vertical" form={formController} onFinish={saveUser}>
        <Row justify="center" gutter={[0, 0]}>
          <Col xs={24} xl={21} xxl={18}>
            <Form.Item
              name="name"
              label="Nome"
              rules={[{ required: true, message: "Campo Obrigatório" }]}
            >
              <Input
                disabled={location.state.context === "user"}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} xl={21} xxl={18}>
            <Form.Item
              name="cpf"
              label="CPF"
              rules={[{ required: true, message: "Campo Obrigatório" }]}
            >
              <MaskedInput
                mask="111.111.111-11"
                disabled={location.state.context === "user"}
                style={{ width: "100%" }}
              />
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
              <Input
                addonBefore="https://cnpq.lattes/"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} xl={21} xxl={18}>
            <Form.Item name="password" label="Senha">
              {params.id == null || location.state.context === "user" ? (
                <Input.Password style={{ width: "100%" }} />
              ) : (
                <Button
                  block
                  type="primary"
                  loading={passwordUsersRequester.inProgress}
                  onClick={() => resetPassword(location.state.user!.cpf)}
                >
                  Resetar senha
                </Button>
              )}
            </Form.Item>
          </Col>

          {(params.id == null || location.state.context === "user") && (
            <Col xs={24} xl={21} xxl={18}>
              <Form.Item
                name="confirmPassword"
                label="Confirme sua senha"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const password = getFieldValue("password") ?? "";
                      const passwordConfirmation = value ?? "";
                      if (password !== passwordConfirmation)
                        return Promise.reject(
                          new Error("As senhas não coincidem!")
                        );

                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input.Password style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          )}

          {location.state.context === "admin" && (
            <Col xs={24} xl={21} xxl={18}>
              <Form.Item
                name="roles"
                label="Tipos de usuário"
                rules={[{ required: true, message: "Campo Obrigatório" }]}
              >
                <Select
                  options={roles.map((r: Role) => ({
                    label: r.description,
                    value: r._id!,
                  }))}
                  mode="multiple"
                  allowClear
                  onChange={(e) => {
                    isNdesPresidentOrSchoolCoordinator(e as string[]);
                  }}
                />
              </Form.Item>
            </Col>
          )}

          {shouldRenderCourses && (
            <Col xs={24} xl={21} xxl={18}>
              <Form.Item name="courses" label="Cursos">
                <Select
                  options={courses.map((c: Course) => ({
                    label: `${c.name} - ${(c.campus as Campus).name}`,
                    value: c._id!,
                  }))}
                  mode="multiple"
                  allowClear
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} xl={21} xxl={18}>
            <Row justify="space-between">
              <Button type="default" onClick={() => history.goBack()}>
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
