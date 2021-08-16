import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { Button, Input, Modal, Space, Typography } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";

import { User } from "../../../interfaces/user";
import { getUsers } from "../../../services/user_service";
import { CreateUser } from "../../../components/forms/create-user";
import Structure from "../../../components/layout/structure";
import MyTable from "../../../components/layout/table";
import { ContainerFlex } from "../../../global/styles";

interface State
{
  title: string
  visible: boolean,
  user: undefined | User
}

export const Users: React.FC = () =>
{
  const [users, setUsers] = useState<User[] | null>(null);
  const [filteredUser, setFilteredUser] = useState<User[]>([]);
  const [initialValue, setInitialValue] = useState(0);
  const [state, setState] = useState<State>(
  {
    visible: false,
    user: undefined,
    title: ""
  });

  useEffect(() =>
  {
    (async () =>
    {
      const response = await getUsers();
      setUsers(response.user);
      setFilteredUser(response.user);
    })();
  }, [initialValue]);

  const openModal = (title: string, userSelected?: User) =>
  {
    setState({ visible: true, user: userSelected, title });
  }

  const searchTable = (search: any) =>
  {
    const valueSearch = search.target.value.toLowerCase();
    if (valueSearch)
    {
      const filteredUsers = users?.filter(e => e.name.toLowerCase().match(valueSearch));
      if (filteredUsers !== undefined)
        setFilteredUser(filteredUsers);
    }
    else if (valueSearch.length === 0)
    {
      if (users !== null)
        setFilteredUser(users);
    }
  };

  const columns =
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
        href={`mailto:${record.email}`}
        type="link"
      >
          {record.email}
      </Button>
    )
  },
  {
    key: "isActive",
    title: "Ativo",
    filters:
    [{
      text: "Ativo",
      value: true,
    },
    {
      text: "Não ativo",
      value: false,
    }],

    onFilter: (value: any, record: User) => record.isActive === value,
    sortDirections: ["descend"],
    render: (text: any, record: User) => (
      <div
        style={
        {
          display: "flex",
          justifyContent: "left",
          alignItems: "center"
        }}
      >
        <div
          style={
          {
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: record.isActive ? "green" : "red"
          }}
        />

        <Typography style={{ marginLeft: "2px" }}>
          {record.isActive ? "Ativo" : "Não Ativo"}
        </Typography>
      </div>
    )
  },
  {
    key: "action",
    title: "Ação",
    render: (text: string, record: User) => (
      <Space>
        <Button
          icon={<EditOutlined />}
          onClick={() => openModal("Editar Usuário", record)}
        >
          Editar
        </Button>
      </Space>
    )
  }];

  const loadUser = useCallback(() =>
    setInitialValue((prevState) => prevState + 1),
    []);

  const closeModal = useCallback(() =>
    setState({ visible: false, user: undefined, title: "" }),
    []);

  const modal = useMemo(() => (
    <Modal
      visible={state.visible}
      onCancel={closeModal}
      footer={[]}
    >
      <CreateUser
        title={state.title}
        loadUser={loadUser}
        user={state.user}
        closeModal={closeModal}
      />
    </Modal>
  ), [state, initialValue]);

  return (
    <>
      {ReactDOM.createPortal(modal, document.getElementById("dialog-overlay")!)}

      <Structure title="usuários">
        <Button
          type="primary"
          icon={<UserOutlined />}
          onClick={() => openModal("Cadastrar Usuário")}
        >
          Cadastrar usuário
        </Button>

        <ContainerFlex>
          <div>
            <Input
              placeholder="Pesquisar por nome..."
              style={{ maxWidth: "350px", margin: "10px" }}
              onChange={searchTable}
            />

            {users !== null && (
              <MyTable columns={columns} data={filteredUser} />
            )}
          </div>
        </ContainerFlex>
      </Structure>
    </>
  )
}

export default Users