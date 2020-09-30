import React, { useState } from 'react'
import { Layout, Menu, Breadcrumb, Button } from 'antd';
import {
    TeamOutlined,
    PieChartOutlined,
    UserOutlined,
    UnorderedListOutlined,
    FileTextOutlined,
    HomeOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-guard';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Dashboard: React.FC = (props) => {
    const [collapsed, setcollapsed] = useState(false)

    const onCollapse = (collapsed: boolean) => {
        setcollapsed(collapsed);
    };
    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    <div className="logo" >
                        <img src="https://www.up.edu.br/blogs/wp-content/uploads/2020/03/cropped-favicon.png" style={{ width: '100%', padding: '15px' }} alt="" />
                    </div>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
                            <Link to='/dashboard'>
                                Home
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/programs" icon={<FileTextOutlined />}>
                            <Link to='/dashboard/programs'>
                                Programas
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<TeamOutlined />}>
                            Propostas
                        </Menu.Item>
                        <SubMenu key="sub1" icon={<UserOutlined />} title="Lattes">
                            <Menu.Item icon={<UnorderedListOutlined />} key="3">Listar Curriculos</Menu.Item>
                            <Menu.Item key="4" icon={<PieChartOutlined />}>Relatórios</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0, textAlign: 'right'}} >
                        <Button>
                            <SettingOutlined />
                        </Button>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>User</Breadcrumb.Item>
                            <Breadcrumb.Item>Bill</Breadcrumb.Item>
                        </Breadcrumb>
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