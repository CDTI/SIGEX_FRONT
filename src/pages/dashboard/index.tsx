import React, { useState, useMemo } from 'react'
import { Layout, Menu, Popover, Button, Typography } from 'antd';
import {
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
} from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../context/auth';
import logo from '../../sigex.png'
import { IRole } from '../../interfaces/role';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Dashboard: React.FC = (props) => {
    const history = useHistory()
    const [collapsed, setcollapsed] = useState(false)
    const context = useAuth()

    const onCollapse = (collapsed: boolean) => {
        setcollapsed(collapsed);
    };

    const isIRole = (v: string | IRole): v is IRole =>
    {
      if ((v as IRole).description)
        return true;

      return false;
    };

    let userRoles = context.user?.roles?.map((r: string | IRole) => (isIRole(r)) ? r.description : r) ?? [];

    const memoizedDate = useMemo(() => {
        let dt = new Date()
        let dateFormat = `${dt.getDate().toString().padStart(2, '0')}/${(dt.getMonth() + 1).toString().padStart(2, '0')}/${dt.getFullYear().toString().padStart(4, '0')}`
        return (
            <Typography style={{ color: '#fff', marginLeft: '9px' }}>
                {dateFormat}
            </Typography>
        )
    }, []);

    const logout = () => {
        context.logout()
        history.push('/')
    }

    const location = window.location.href.slice(21)

    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    <div className="logo" >
                        <img src={logo} style={{ width: '100%', padding: '15px' }} alt="" />
                    </div>

                    <Menu theme="dark" defaultSelectedKeys={[location]}>
                        <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
                            <Link to='/dashboard'>
                                Home
                            </Link>
                        </Menu.Item>

                        <SubMenu key="/dashboard/programs" icon={<FileTextOutlined />} title="Programas">
                            <Menu.Item icon={<UnorderedListOutlined />} key="3">
                                <Link to="/dashboard/programs">Listar Programas</Link>
                            </Menu.Item>

                            {userRoles.includes("Administrador") && (
                                <Menu.Item key="/dashboard/program/create" icon={<DiffOutlined />}>
                                    <Link to="/dashboard/program/create">Criar Programa</Link>
                                </Menu.Item>
                            )}
                        </SubMenu>

                        {userRoles.includes('Administrador') && (
                          <>
                            <Menu.Item icon={<UserOutlined />}>
                              <Link to="/dashboard/users">Usuários</Link>
                            </Menu.Item>

                            <Menu.Item icon={<UnorderedListOutlined />} key="/dashboard/categories">
                              <Link to="/dashboard/categories">Categorias</Link>
                            </Menu.Item>

                            <Menu.Item icon={<FieldTimeOutlined />} key='/dashboard/periods'>
                              <Link to='/dashboard/notices'>Editais</Link>
                            </Menu.Item>

                            <Menu.Item key="/dashboard/projects" icon={<TeamOutlined />}>
                              <Link to='/dashboard/projects'>Projetos</Link>
                            </Menu.Item>
                          </>
                        )}

                        {(userRoles.includes('Professor') || userRoles.includes('Presidente do NDE')) && (
                          <>
                            <SubMenu key='myProjects' icon={<FileTextOutlined />} title="Meus projetos">
                              <Menu.Item key="/dashboard/project/create" icon={<FileAddOutlined />}>
                                <Link to="/dashboard/project/create">Registrar novo projeto</Link>
                              </Menu.Item>

                              <Menu.Item key="/dashboard/myProjects" icon={<TeamOutlined />}>
                                <Link to="/dashboard/myProjects">Projetos registrados</Link>
                              </Menu.Item>
                            </SubMenu>
                          </>
                        )}

                        {(userRoles.includes("Comitê de extensão") && !userRoles.includes("Administrador")) && (
                          <Menu.Item key="/dashboard/projects" icon={<TeamOutlined />}>
                            <Link to='/dashboard/projects'>Projetos</Link>
                          </Menu.Item>
                        )}

                        <SubMenu key="sub1" icon={<UserOutlined />} title="Lattes" disabled>
                            <Menu.Item icon={<UnorderedListOutlined />} key="3">Listar Curriculos</Menu.Item>
                            <Menu.Item key="4" icon={<PieChartOutlined />}>Relatórios</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>

                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{
                        padding: 0, display: "flex",
                        justifyContent: 'space-between', alignItems: 'center'
                    }} >
                        {memoizedDate}
                        <div>
                            <label style={{ color: '#fff', marginRight: '10px' }}>Olá, {context.user?.name}</label>
                            <Popover content={
                                <Button onClick={logout} type="link" style={{ backgroundColor: '#b23a48', color: '#fff' }}>
                                    <PoweroffOutlined />SAIR
                                </Button>
                            } trigger="focus">
                                <Button>
                                    <SettingOutlined />
                                </Button>
                            </Popover>
                        </div>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            {props.children}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        <Typography>Sigex ₢2020</Typography>
                    </Footer>
                </Layout>
            </Layout>
        </>
    )
}

export default Dashboard