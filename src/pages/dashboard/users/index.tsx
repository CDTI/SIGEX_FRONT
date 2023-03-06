import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  Col,
  Input,
  notification,
  Row,
  Space,
  Switch,
  Table,
} from "antd";

import Structure from "../../../components/layout/structure";

import { User } from "../../../interfaces/user";
import { useHttpClient } from "../../../hooks/useHttpClient";
import {
  getAllUsersEndpoint,
  getAllUsersPaginatedEndpoint,
  toggleUserEndpoint,
} from "../../../services/endpoints/users";

export const UsersPage: React.FC = () => {
  const location = useLocation();

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userFilter, setUserFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const tableUsersRequester = useHttpClient();
  const switchUsersRequester = useHttpClient();

  const getPaginatedUsers = async (query: string) => {
    setLoading(true);
    try {
      const users = await tableUsersRequester.send({
        method: "GET",
        url: getAllUsersPaginatedEndpoint(),
        queryParams: new Map([
          ["name", query],
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
  // useEffect(() => {
  //   (async () => {
  //     const response = await tableUsersRequester.send({
  //       method: "GET",
  //       url: getAllUsersEndpoint(),
  //       cancellable: true,
  //     });

  //     setUsers(response.user ?? []);
  //     setFilteredUsers(response.user ?? []);
  //   })();
  // }, [tableUsersRequester.send]);

  useEffect(() => {
    getPaginatedUsers(userFilter);
  }, [page, limit, userFilter]);

  const filterUsers = (ev: any) => {
    setUserFilter(ev.target.value);
    if (page !== 1) {
      setPage(1);
    }
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

        setFilteredUsers((prevState) => {
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
        </Col>
      </Row>

      <Row gutter={[0, 8]}>
        <Col span={24}>
          <Input
            style={{ width: "100%" }}
            placeholder={"Digite o nome do usuário para filtrar"}
            onChange={filterUsers}
          />
        </Col>
      </Row>

      <Table
        loading={loading}
        columns={tableColumns}
        dataSource={users}
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
