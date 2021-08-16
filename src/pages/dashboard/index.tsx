import React, { useState, useMemo } from "react";
import { Link, useHistory } from "react-router-dom";
import { Layout, Menu, Popover, Button, Typography } from "antd";
import
{
  BankOutlined,
  TeamOutlined,
  PieChartOutlined,
  UserOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  HomeOutlined,
  SettingOutlined,
  DiffOutlined,
  PoweroffOutlined,
  FileAddOutlined,
  FieldTimeOutlined
} from "@ant-design/icons";

import { useAuth } from "../../context/auth";
import logo from "../../sigex.png"
import { Restricted } from "../../components/Restricted";
import { Role } from "../../interfaces/user";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export const Dashboard: React.FC = (props) =>
{
  const history = useHistory();
  const [collapsed, setcollapsed] = useState(false);
  const context = useAuth();

  const onCollapse = (collapsed: boolean) => setcollapsed(collapsed);

  const memoizedDate = useMemo(() =>
  {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().padStart(4, "0");
    return (
      <Typography style={{ color: "#fff", marginLeft: "9px" }}>
        {`${day}/${month}/${year}`}
      </Typography>
    );
  }, []);

  const logout = () =>
  {
    context.logout();
    history.push("/");
  }

  const location = window.location.href.slice(21);
  const userRoles = useMemo(() =>
    context.user!.roles.map((r: string | Role) => (r as Role).description),
    [context.user]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div className="logo" >
          <img src={logo} style={{ width: "100%", padding: "15px" }} alt="" />
        </div>

        <Menu theme="dark" defaultSelectedKeys={[location]}>
          <Menu.Item
            key="/dashboard"
            icon={<HomeOutlined />}
          >
            <Link to="/dashboard">
              Home
            </Link>
          </Menu.Item>

          {userRoles.includes("Administrador") && (
            <Menu.Item
              key="/dashboard/courses"
              icon={<BankOutlined />}
            >
              <Link to="/dashboard/courses">
                Cursos
              </Link>
            </Menu.Item>
          )}

          <SubMenu
            key="/dashboard/programs"
            title="Programas"
            icon={<FileTextOutlined />}
          >
            <Menu.Item
              key="3"
              icon={<UnorderedListOutlined />}
            >
              <Link to="/dashboard/programs">
                Listar Programas
              </Link>
            </Menu.Item>

            {userRoles.includes("Administrador") && (
              <Menu.Item
                key="/dashboard/program/create"
                icon={<DiffOutlined />}
              >
                <Link to="/dashboard/program/create">
                  Criar Programa
                </Link>
              </Menu.Item>
            )}
          </SubMenu>

          {userRoles.includes("Administrador") && (
            <>
              <Menu.Item
                key="/dashboard/users"
                icon={<UserOutlined />}
              >
                <Link to="/dashboard/users">
                  Usuários
                </Link>
              </Menu.Item>

              <Menu.Item
                key="/dashboard/categories"
                icon={<UnorderedListOutlined />}
              >
                <Link to="/dashboard/categories">
                  Categorias
                </Link>
              </Menu.Item>

              <Menu.Item
                key="/dashboard/periods"
                icon={<FieldTimeOutlined />}
              >
                <Link to="/dashboard/notices">Editais</Link>
              </Menu.Item>

              <Menu.Item
                key="/dashboard/projects"
                icon={<TeamOutlined />}
              >
                <Link to="/dashboard/projects">
                  Projetos
                </Link>
              </Menu.Item>
            </>
          )}

          {(userRoles.includes("Professor") || userRoles.includes("Presidente do NDE")) && (
            <>
              <SubMenu
                key="myProjects"
                title="Meus projetos"
                icon={<FileTextOutlined />}
              >
                <Menu.Item
                  key="/dashboard/project/create"
                  icon={<FileAddOutlined />}
                >
                  <Link to="/dashboard/project/create">
                    Registrar novo projeto
                  </Link>
                </Menu.Item>

                <Menu.Item
                  key="/dashboard/myProjects"
                  icon={<TeamOutlined />}
                >
                  <Link to="/dashboard/myProjects">
                    Projetos registrados
                  </Link>
                </Menu.Item>
              </SubMenu>
            </>
          )}

          {userRoles.includes("Comitê de extensão") && !userRoles.includes("Administrador") && (
            <>
              <Menu.Item
                key="/dashboard/projects"
                icon={<TeamOutlined />}
              >
                <Link to="/dashboard/projects">
                  Projetos
                </Link>
              </Menu.Item>
            </>
          )}

          <SubMenu
            key="sub1"
            disabled
            title="Lattes"
            icon={<UserOutlined />}
          >
            <Menu.Item
              key="3"
              icon={<UnorderedListOutlined />}
            >
              Listar Curriculos
            </Menu.Item>

            <Menu.Item
              key="4"
              icon={<PieChartOutlined />}
            >
              Relatórios
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={
          {
            padding: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {memoizedDate}

          <div>
            <label style={{ color: "#fff", marginRight: "10px" }}>
              Olá, {context.user?.name}
            </label>

            <Popover
              trigger="focus"
              content={(
                <Button
                  onClick={logout}
                  type="link"
                  style={{ backgroundColor: "#b23a48", color: "#fff" }}
                >
                  <PoweroffOutlined />SAIR
                </Button>
              )}
            >
              <Button>
                <SettingOutlined />
              </Button>
            </Popover>
          </div>
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {props.children}
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          <Typography>Sigex ₢2020</Typography>
        </Footer>
      </Layout>
    </Layout>
  );
};
