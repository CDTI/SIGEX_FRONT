import React, { useEffect, useState } from 'react'
import { List, Button } from 'antd'
import { extensionPrograms } from '../../../mocks/mockPrograms'
import Structure from '../../../components/layout/structure';
import { IPrograms } from '../../../interfaces/programs';
import { CheckOutlined } from '@ant-design/icons'
import { User } from '../../../store/ducks/user/types';
import { ApplicationState } from '../../../store';
import { Dispatch, bindActionCreators } from 'redux';
import * as UserActions from '../../../store/ducks/user/actions'
import { connect } from 'react-redux';
import { Link } from 'react-router-guard'

interface Props {
    user: User
}

const Programs: React.FC<Props> = ({ user }) => {
    const [programs, setPrograms] = useState<IPrograms[]>()

    useEffect(() => {
        setPrograms(extensionPrograms)
    })

    return (
        <Structure title="Lista de Programas">
            {user.role === 'admin' && (
                <List
                    itemLayout="horizontal"
                    dataSource={programs}
                    renderItem={item => (
                        <List.Item
                            actions={(item.form_id > 0 && ([<Button type="link" style={{ fontSize: '18px' }}><Link to={{ pathname: '/dashboard/form/create', state: item }}>Incluir Formulário</Link></Button>])) ||
                                [<p style={{ color: 'green', padding: '12px 0' }}><CheckOutlined />OK</p>]}
                        >

                            <List.Item.Meta
                                title={<Button type="link">{item.name}</Button>}
                                description={item.course_unity}
                            />
                        </List.Item>
                    )}
                />
            )}
            {user.role === 'teacher' && (
                <List
                    itemLayout="horizontal"
                    dataSource={programs}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={<Button type="link"><Link to={{ pathname: '/dashboard/program/details', state: item }}>{item.name}</Link></Button>}
                                description={item.course_unity}
                            />
                        </List.Item>
                    )}
                />
            )}
        </Structure>
    )
}

const mapStateToProps = (state: ApplicationState) => ({
    user: state.user.data
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(Object.assign({}, UserActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Programs)