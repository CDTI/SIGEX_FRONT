import "antd/dist/antd.css";
import "../../assets/antd-override.css"
import logo from "../../assets/sigex.png"

import React, { useState, useMemo, useCallback, useContext } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Typography, Row, Dropdown } from "antd";
import
{
  BankOutlined,
  TeamOutlined,
  UserOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  HomeOutlined,
  DiffOutlined,
  FileAddOutlined,
  FieldTimeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from "@ant-design/icons";

import { Role } from "../../interfaces/user";
import { AuthContext } from "../../context/auth";
import { Restricted } from "../../components/Restricted";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export const AppLayout: React.FC = (props) =>
{
  const history = useHistory();
  const authContext = useContext(AuthContext);
  const [collapsed, setcollapsed] = useState(false);

  const toggleSideMenu = useCallback(() => setcollapsed((prevState) => !prevState), []);

  const location = useLocation();
  const userRoles = useMemo(() =>
    authContext.user?.roles?.map((r: string | Role) => (r as Role).description) ?? [],
    [authContext.user]);

  const userMenu = useMemo(() => (
    <Menu mode="vertical" style={{ padding: 8 }}>
      <Menu.Item disabled>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {`Olá, ${authContext.user?.name.split(" ")[0] ?? "como vai"}!`}
        </Typography.Title>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item>
        <Link to="/usuario/perfil">
          Perfil
        </Link>
      </Menu.Item>

      <Menu.Item danger onClick={() =>authContext.logout!()}>
        Sair
      </Menu.Item>
    </Menu>
  ), [authContext.user]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="header" style={{ padding: "0 16px" }}>
        <Row justify="space-between">
          <Button
            ghost
            size="large"
            shape="circle"
            style={{ marginTop: 12 }}
            onClick={toggleSideMenu}
          >
            {collapsed
              ? <MenuUnfoldOutlined />
              : <MenuFoldOutlined />
            }
          </Button>

          <Link to="/home">
            <img src={logo} alt="SIGEX logo" height={64} />
          </Link>

          <Dropdown arrow overlay={userMenu} placement="bottomRight">
            <Button
              ghost
              size="large"
              shape="circle"
              icon={<UserOutlined/>}
              style={{ marginTop: 12 }}
            />
          </Dropdown>
        </Row>
      </Header>

      <Layout>
        <Sider
          theme="light"
          width={250}
          collapsible
          collapsed={collapsed}
          collapsedWidth={0}
          trigger={null}
          className="site-layout-background"
        >
          <Menu
            mode="inline"
            theme="light"
            defaultSelectedKeys={[location.pathname]}
          >
            <Menu.Item
              key="/home"
              icon={<HomeOutlined />}
            >
              <Link to="/home">
                Home
              </Link>
            </Menu.Item>

            {userRoles.includes("Administrador") && (
              <Menu.Item
                key="/cursos"
                icon={<BankOutlined />}
              >
                <Link to="/cursos">
                  Cursos
                </Link>
              </Menu.Item>
            )}

            <SubMenu
              key="programas"
              title="Programas"
              icon={<FileTextOutlined />}
            >
              <Menu.Item
                key="/programas"
                icon={<UnorderedListOutlined />}
              >
                <Link to="/programas">
                  Listar Programas
                </Link>
              </Menu.Item>

              {userRoles.includes("Administrador") && (
                <Menu.Item
                  key="/programas/criar"
                  icon={<DiffOutlined />}
                >
                  <Link to="/programas/criar">
                    Criar Programa
                  </Link>
                </Menu.Item>
              )}
            </SubMenu>

            {userRoles.includes("Administrador") && (
              <>
                <Menu.Item
                  key="/usuarios"
                  icon={<UserOutlined />}
                >
                  <Link to="/usuarios">
                    Usuários
                  </Link>
                </Menu.Item>

                <Menu.Item
                  key="/categorias"
                  icon={<UnorderedListOutlined />}
                >
                  <Link to="/categorias">
                    Categorias
                  </Link>
                </Menu.Item>

                <Menu.Item
                  key="/editais"
                  icon={<FieldTimeOutlined />}
                >
                  <Link to="/editais">Editais</Link>
                </Menu.Item>

                <Menu.Item
                  key="/propostas"
                  icon={<TeamOutlined />}
                >
                  <Link to="/propostas">
                    Projetos
                  </Link>
                </Menu.Item>
              </>
            )}

            {(userRoles.includes("Professor") || userRoles.includes("Presidente do NDE")) && (
              <>
                <SubMenu
                  key="minhas-propostas"
                  title="Meus projetos"
                  icon={<FileTextOutlined />}
                >
                  <Menu.Item
                    key="/propostas/criar"
                    icon={<FileAddOutlined />}
                  >
                    <Link
                      to={
                      {
                        pathname: "/propostas/criar",
                        state: { context: "user" }
                      }}
                    >
                      Registrar novo projeto
                    </Link>
                  </Menu.Item>

                  <Menu.Item
                    key="/minhas-propostas"
                    icon={<TeamOutlined />}
                  >
                    <Link to="/minhas-propostas">
                      Projetos registrados
                    </Link>
                  </Menu.Item>
                </SubMenu>
              </>
            )}

            {userRoles.includes("Comitê de extensão") && !userRoles.includes("Administrador") && (
              <>
                <Menu.Item
                  key="/propostas"
                  icon={<TeamOutlined />}
                >
                  <Link to="/propostas">
                    Projetos
                  </Link>
                </Menu.Item>
              </>
            )}
          </Menu>
        </Sider>

        <Layout style={{ padding: "24px 24px 0 24px" }}>
          <Content
            style={{ padding: 24, margin: 0, backgroundColor: "#fff" }}
            className="site-layout-background"
          >
            {props.children}
          </Content>

          <Footer style={{ textAlign: "center" }}>
            <Typography>SIGEX &nbsp; 2020 - {new Date().getFullYear()}</Typography>
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
