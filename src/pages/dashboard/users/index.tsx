import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
  Switch,
  Table,
} from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";

import Structure from "../../../components/layout/structure";

import { Role, User } from "../../../interfaces/user";
import { useHttpClient } from "../../../hooks/useHttpClient";
import {
  getAllUsersEndpoint,
  getAllUsersPaginatedEndpoint,
  toggleUserEndpoint,
} from "../../../services/endpoints/users";
import { useForm } from "antd/lib/form/Form";
import { getAllRolesEndpoint } from "../../../services/endpoints/roles";

interface IUserQueryOptions {
  name?: string;
  roles?: string[];
}

export const UsersPage: React.FC = () => {
  const location = useLocation();

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userFilter, setUserFilter] = useState<string>("");
  const [rolesFilter, setRolesFilter] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = useForm();
  const tableUsersRequester = useHttpClient();
  const switchUsersRequester = useHttpClient();

  const getPaginatedUsers = async (data: IUserQueryOptions) => {
    setLoading(true);
    try {
      const users = await tableUsersRequester.send({
        method: "GET",
        url: getAllUsersPaginatedEndpoint(),
        queryParams: new Map([
          ["name", data.name ?? ""],
          ["roles", data.roles?.join(",") ?? ""],
          ["page", String(page)],
          ["limit", String(limit)],
        ]),
        cancellable: true,
      });

      setUsers(users.docs);
      setTotalPages(users.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      tableUsersRequester
        .send<Role[]>({
          method: "GET",
          url: getAllRolesEndpoint(),
          cancellable: true,
        })
        .then((res) => {
          setRoles(res ?? []);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
    getPaginatedUsers({ name: userFilter, roles: rolesFilter });
  }, [page, limit]);

  const cleanFilter = () => {
    form.resetFields();
    setUserFilter("");
    if (page !== 1) {
      setPage(1);
    }
    getPaginatedUsers({ name: "", roles: [] });
  };

  const toggleUserStatus = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        await switchUsersRequester.send({
          method: "PUT",
          url: toggleUserEndpoint(id),
          cancellable: true,
        });

        setUsers((prevState) => {
          const index = prevState.findIndex((u: User) => u._id === id)!;
          return [
            ...prevState.slice(0, index),
            { ...prevState[index], isActive },
            ...prevState.slice(index + 1),
          ];
        });

        setUsers((prevState) => {
          const index = prevState.findIndex((u: User) => u._id === id)!;
          return [
            ...prevState.slice(0, index),
            { ...prevState[index], isActive },
            ...prevState.slice(index + 1),
          ];
        });

        const status = isActive ? "habilitado" : "desabilitado";
        notification.success({
          message: `O usuário foi ${status} com sucesso!`,
        });
      } catch (error) {
        if ((error as Error).message !== "")
          notification.error({ message: (error as Error).message });
      }
    },
    [switchUsersRequester.send]
  );

  const tableColumns = useMemo(
    () => [
      {
        key: "name",
        title: "Nome",
        dataIndex: "name",
      },
      {
        key: "cpf",
        title: "CPF",
        dataIndex: "cpf",
      },
      {
        key: "email",
        title: "E-Mail",
        render: (text: any, record: User) => (
          <Button type="link" href={`mailto:${record.email}`}>
            {record.email}
          </Button>
        ),
      },
      {
        key: "isActive",
        title: "Ativo?",
        dataIndex: "isActive",
        render: (text: string, record: User) => (
          <Switch
            checked={record.isActive}
            loading={switchUsersRequester.inProgress}
            onChange={(isChecked: boolean) =>
              toggleUserStatus(record._id!, isChecked)
            }
          />
        ),
      },
      {
        key: "actions",
        title: "Ações",
        render: (text: string, record: User) => (
          <Space size="middle">
            <Button>
              <Link
                to={{
                  pathname: `${location.pathname}/editar/${record._id!}`,
                  state: { context: "admin", user: record },
                }}
              >
                Editar
              </Link>
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <Structure title="usuários">
      <Row gutter={[0, 8]} justify="center">
        <Col span={24}>
          <Form
            form={form}
            onFinish={(data) => {
              getPaginatedUsers(data);
            }}
            style={{ display: "flex", marginTop: "5px" }}
          >
            <Button>
              <Link
                to={{
                  pathname: `${location.pathname}/criar`,
                  state: { context: "admin" },
                }}
              >
                Adicionar
              </Link>
            </Button>
            <Form.Item
              name={"name"}
              style={{ marginLeft: "20px", width: "100%" }}
            >
              <Input
                style={{ width: "100%" }}
                placeholder={"Digite o nome do usuário para filtrar"}
                onChange={(e) => {
                  setUserFilter(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="roles"
              style={{ marginLeft: "5px", width: "100%" }}
            >
              <Select
                style={{ width: "100%" }}
                placeholder={"Filtrar por cargos"}
                options={roles.map((r: Role) => ({
                  label: r.description,
                  value: r._id!,
                }))}
                mode="multiple"
                allowClear
                onChange={(e) => {
                  setRolesFilter(e as string[]);
                }}
              />
            </Form.Item>
            <Button
              icon={<SearchOutlined />}
              type="primary"
              htmlType="submit"
              style={{ marginLeft: "5px" }}
            >
              Pesquisar
            </Button>
            <Button
              icon={<ClearOutlined />}
              type="primary"
              htmlType="button"
              style={{ marginLeft: "10px" }}
              onClick={cleanFilter}
            >
              Limpar Filtros
            </Button>
          </Form>
        </Col>
      </Row>

      <Table
        loading={loading}
        columns={tableColumns}
        dataSource={users}
        rowKey={"id"}
        pagination={{
          current: page,
          defaultPageSize: 10,
          defaultCurrent: 1,
          pageSize: limit,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", "50"],
          total: totalPages * limit,
          onChange: (actualPage, actualLimit) => {
            setPage(actualPage);
            setLimit(actualLimit!);
          },
        }}
      />
    </Structure>
  );
};
