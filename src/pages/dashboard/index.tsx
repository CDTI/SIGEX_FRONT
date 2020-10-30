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
    PoweroffOutlined
} from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../context/auth';
import logo from '../../sigex.png'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


const Dashboard: React.FC = (props) => {
    const history = useHistory()
    const [collapsed, setcollapsed] = useState(false)
    const context = useAuth()

    const onCollapse = (collapsed: boolean) => {
        setcollapsed(collapsed);
    };

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
                    {context.user?.role === 'admin' && (
                        <Menu theme="dark" defaultSelectedKeys={[location]} mode="inline">
                            <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
                                <Link to='/dashboard'>
                                    Home
                            </Link>
                            </Menu.Item>
                            <Menu.Item icon={<UserOutlined />}>
                                <Link to="/dashboard/users">
                                    Usuários
                                </Link>
                            </Menu.Item>
                            <SubMenu key="/dashboard/programs" icon={<FileTextOutlined />} title="Programas">
                                <Menu.Item icon={<UnorderedListOutlined />} key="3">
                                    <Link to="/dashboard/programs">Listar Programas</Link>
                                </Menu.Item>
                                <Menu.Item key="/dashboard/program/create" icon={<DiffOutlined />}>
                                    <Link to="/dashboard/program/create">Criar Programa</Link>
                                </Menu.Item>
                            </SubMenu>
                            <Menu.Item icon={<UnorderedListOutlined />} key="/dashboard/categories">
                                <Link to="/dashboard/categories">Categorias</Link>
                            </Menu.Item>
                            <Menu.Item key="/dashboard/projects" icon={<TeamOutlined />}>
                                <Link to='/dashboard/projects'>
                                    Propostas
                                    </Link>
                            </Menu.Item>
                            <SubMenu key="sub1" icon={<UserOutlined />} title="Lattes">
                                <Menu.Item icon={<UnorderedListOutlined />} key="3">Listar Curriculos</Menu.Item>
                                <Menu.Item key="4" icon={<PieChartOutlined />}>Relatórios</Menu.Item>
                            </SubMenu>
                        </Menu>
                    )}
                    {context.user?.role === 'teacher' && (
                        <Menu theme="dark" defaultSelectedKeys={[location]} mode="inline">
                            <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
                                <Link to='/dashboard'>
                                    Home
                                </Link>
                            </Menu.Item>
                            <SubMenu key="/dashboard/programs" icon={<FileTextOutlined />} title="Programas">
                                <Menu.Item icon={<UnorderedListOutlined />} key="/dashboard/programs">
                                    <Link to="/dashboard/programs">Listar Programas</Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu key='/dashboard/projects' icon={<FileTextOutlined />} title="Projetos">
                                <Menu.Item key="/dashboard/project/create" icon={<TeamOutlined />}>
                                    <Link to="/dashboard/project/create">Registrar um projeto</Link>
                                </Menu.Item>
                                <Menu.Item key="/dashboard/projects" icon={<TeamOutlined />}>
                                    <Link to="/dashboard/projects">Meus Projetos</Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub1" icon={<UserOutlined />} title="Lattes">
                                <Menu.Item icon={<UnorderedListOutlined />} key="3">Listar Curriculos</Menu.Item>
                                <Menu.Item key="4" icon={<PieChartOutlined />}>Relatórios</Menu.Item>
                            </SubMenu>
                        </Menu>
                    )}
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
                                    <PoweroffOutlined />
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
                    <Footer style={{ textAlign: 'center' }}>Dashboard ₢2020 Criado por Daniel Candido</Footer>
                </Layout>
            </Layout>
        </>
    )
}

export default Dashboard