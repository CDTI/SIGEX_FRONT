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
import { history } from 'react-router-guard'
import { Link } from 'react-router-guard';
import { User } from '../../store/ducks/user/types';
import { ApplicationState } from '../../store';
import { Dispatch, bindActionCreators } from 'redux';
import * as UserActions from '../../store/ducks/user/actions'
import { connect } from 'react-redux';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


interface Props {
    user: User
    removeUser(): void
}

const Dashboard: React.FC<Props> = (props) => {
    const [collapsed, setcollapsed] = useState(false)
    const onCollapse = (collapsed: boolean) => {
        setcollapsed(collapsed);
    };

    const memoizedDate = useMemo(() => {
        let dt = new Date()
        let dateFormat = `${(dt.getMonth() + 1).toString().padStart(2, '0')}/${dt.getDate().toString().padStart(2, '0')}/${dt.getFullYear().toString().padStart(4, '0')}`
        return (
            <Typography style={{ color: '#fff', marginLeft: '9px' }}>
                {dateFormat}
            </Typography>
        )
    }, []);

    const logout = () => {
        props.removeUser()
        history.push('/login')
    }

    const location = window.location.href.slice(21)

    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    <div className="logo" >
                        <img src="https://www.up.edu.br/blogs/wp-content/uploads/2020/03/cropped-favicon.png" style={{ width: '100%', padding: '15px' }} alt="" />
                    </div>
                    {props.user.role === 'admin' && (
                        <Menu theme="dark" defaultSelectedKeys={[location]} mode="inline">
                            <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
                                <Link to='/dashboard'>
                                    Home
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
                            <Menu.Item key="2" icon={<TeamOutlined />}>
                                Propostas
                        </Menu.Item>
                            <SubMenu key="sub1" icon={<UserOutlined />} title="Lattes">
                                <Menu.Item icon={<UnorderedListOutlined />} key="3">Listar Curriculos</Menu.Item>
                                <Menu.Item key="4" icon={<PieChartOutlined />}>Relatórios</Menu.Item>
                            </SubMenu>
                        </Menu>
                    )}
                    {props.user.role === 'teacher' && (
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
                            <Menu.Item key="/dashboard/project/create" icon={<TeamOutlined />}>
                                <Link to="/dashboard/project/create">Registrar um projeto</Link>
                            </Menu.Item>
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
                        <Popover content={
                            <Button onClick={logout} type="link" style={{backgroundColor: '#b23a48', color: '#fff'}}>
                                <PoweroffOutlined />
                            </Button>
                        } trigger="focus">
                            <Button>
                                <SettingOutlined />
                            </Button>
                        </Popover>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        {/* <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>User</Breadcrumb.Item>
                            <Breadcrumb.Item>Bill</Breadcrumb.Item>
                        </Breadcrumb> */}
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

const mapStateToProps = (state: ApplicationState) => ({
    user: state.user.data
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(Object.assign({}, UserActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)