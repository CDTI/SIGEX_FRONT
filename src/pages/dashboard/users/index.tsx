import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Col, Input, notification, Row, Space, Switch, Table } from "antd";

import Structure from "../../../components/layout/structure";

import { User } from "../../../interfaces/user";
import { useHttpClient } from "../../../hooks/useHttpClient";
import { getAllUsersEndpoint, toggleUserEndpoint } from "../../../services/endpoints/users";

export const UsersPage: React.FC = () =>
{
  const location = useLocation();

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const tableUsersRequester = useHttpClient();
  const switchUsersRequester = useHttpClient();

  useEffect(() =>
  {
    (async () =>
    {
      const response = await tableUsersRequester.send(
      {
        method: "GET",
        url: getAllUsersEndpoint(),
        cancellable: true
      });

      setUsers(response.user ?? []);
      setFilteredUsers(response.user ?? []);
    })();
  }, [tableUsersRequester.send]);

  const filterUsers = (ev: any) =>
  {
    const searchTerm = ev.target.value.toLocaleLowerCase();
    setFilteredUsers(ev.target.value !== ""
      ? users.filter((u: User) => u.name.toLocaleLowerCase().includes(searchTerm))
      : users);
  };

  const toggleUserStatus = useCallback(async (id: string, isActive: boolean) =>
  {
    try
    {
      await switchUsersRequester.send(
      {
        method: "PUT",
        url: toggleUserEndpoint(id),
        cancellable: true
      });

      setUsers((prevState) =>
      {
        const index = prevState.findIndex((u: User) => u._id === id)!;
        return (
        [
          ...prevState.slice(0, index),
          { ...prevState[index], isActive },
          ...prevState.slice(index + 1)
        ]);
      });

      setFilteredUsers((prevState) =>
      {
        const index = prevState.findIndex((u: User) => u._id === id)!;
        return (
        [
          ...prevState.slice(0, index),
          { ...prevState[index], isActive },
          ...prevState.slice(index + 1)
        ]);
      });

      const status = isActive ? "habilitado" : "desabilitado";
      notification.success({ message: `O usuário foi ${status} com sucesso!` });
    }
    catch (error)
    {
      if ((error as Error).message !== "")
        notification.error({ message: (error as Error).message });
    }
  }, [switchUsersRequester.send]);

  const tableColumns = useMemo(() =>
  [{
    key: "name",
    title: "Nome",
    dataIndex: "name"
  },
  {
    key: "cpf",
    title: "CPF",
    dataIndex: "cpf"
  },
  {
    key: "email",
    title: "E-Mail",
    render: (text: any, record: User) => (
      <Button
        type="link"
        href={`mailto:${record.email}`}
      >
        {record.email}
      </Button>
    )
  },
  {
    key: "isActive",
    title: "Ativo?",
    dataIndex: "isActive",
    render: (text: string, record: User) => (
      <Switch
        checked={record.isActive}
        loading={switchUsersRequester.inProgress}
        onChange={(isChecked: boolean) => toggleUserStatus(record._id!, isChecked)}
      />
    )
  },
  {
    key: "actions",
    title: "Ações",
    render: (text: string, record: User) => (
      <Space size="middle">
        <Button>
          <Link
            to={
            {
              pathname: `${location.pathname}/editar/${record._id!}`,
              state: { context: "admin", user: record }
            }}
          >
            Editar
          </Link>
        </Button>
      </Space>
    )
  }], []);

  return (
    <Structure title="usuários">
      <Row gutter={[0, 8]} justify="center">
        <Col span={24}>
          <Button>
            <Link
              to={
              {
                pathname: `${location.pathname}/criar`,
                state: { context: "admin" }
              }}>
              Adicionar
            </Link>
          </Button>
        </Col>
      </Row>

      <Row gutter={[0, 8]}>
        <Col span={24}>
          <Input
            style={{ width: "100%" }}
            onChange={filterUsers}
          />
        </Col>
      </Row>

      <Table
        loading={tableUsersRequester.inProgress}
        columns={tableColumns}
        dataSource={filteredUsers}
      />
    </Structure>
  );
};
