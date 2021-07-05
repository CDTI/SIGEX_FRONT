import React, { useEffect, useMemo, useState } from 'react'
import { Button, Input, Modal, Space, Typography } from 'antd'
import Structure from '../../../components/layout/structure'
import { ContainerFlex } from '../../../global/styles'
import IUser from '../../../interfaces/user'
import { getUsers } from '../../../services/user_service'
import CreateUser from '../../../components/forms/create-user'
import MyTable from '../../../components/layout/table'
import { EditOutlined, UserOutlined } from '@ant-design/icons'

interface State {
    title: string
    visible: boolean,
    user: undefined | IUser
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<IUser[] | null>(null)
    const [filteredUser, setFilteredUser] = useState<IUser[]>([])
    // const [user, setUser] = useState<IUser | undefined>(undefined)
    const [initialValue, setInitialValue] = useState(0)
    const [state, setState] = useState<State>({ visible: false, user: undefined, title: '' })

    useEffect(() => {
        getUsers().then(data => {
            setUsers(data.user)
            setFilteredUser(data.user)
        })
    }, [initialValue])

    const openModal = (userSelected: IUser | undefined, title: string) => {
        setState({ visible: true, user: userSelected, title: title })
    }

    const searchTable = (search: any) => {
        const valueSearch = search.target.value.toLowerCase()
        if (valueSearch) {
            const filteredUsers = users?.filter(e => e.name.toLowerCase().match(valueSearch))
            if (filteredUsers !== undefined)
                setFilteredUser(filteredUsers)
        } else if (valueSearch.length === 0) {
            if (users !== null)
                setFilteredUser(users)
        }
    }

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'CPF',
            dataIndex: 'cpf',
            key: 'cpf'
        },
        {
            title: 'E-Mail',
            key: 'email',
            render: (text: any, record: IUser) => (
                <Button href={`mailto:${record.email}`} type='link'>{record.email}</Button>
            )
        },
        {
            title: 'Ativo',
            key: 'isActive',
            render: (text: any, record: IUser) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                        {record.isActive && (<div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'green' }} />)}
                        {!record.isActive && (<div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'red' }} />)}
                        <Typography style={{ marginLeft: '2px' }}>{record.isActive ? 'Ativo' : 'Não Ativo'}</Typography>
                    </div>
                )
            },
            filters: [
                {
                    text: 'Ativo',
                    value: true,
                },
                {
                    text: 'Não ativo',
                    value: false,
                }
            ],
            // specify the condition of filtering result
            // here is that finding the name started with `value`
            onFilter: (value: any, record: IUser) => record.isActive === value,
            // sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend'],
        },
        {
            title: 'Ação',
            key: 'action',
            render: (text: string, record: IUser) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openModal(record, 'Editar Usuário')}>Editar</Button>
                </Space>
            )
        }
    ]

    const memoModal = useMemo(() => {
        const loadUser = () => {
            setInitialValue(initialValue + 1)
        }

        const closeModal = () => {
            setState({ visible: false, user: undefined, title: '' })
        }

        return (
            <Modal
                visible={state.visible}
                onCancel={closeModal}
                footer={[]}
            >
                <CreateUser user={state.user} title={state.title} loadUser={loadUser} closeModal={closeModal} />
            </Modal>
        )

    }, [state, initialValue])

    return (
        <Structure title='usuários'>
            <Button icon={<UserOutlined />} type='primary' onClick={() => openModal(undefined, 'Cadastrar Usuário')}>Cadastrar usuário</Button>
            {memoModal}

            <ContainerFlex>
                <div>
                    <Input onChange={searchTable} style={{ maxWidth: '350px', margin: '10px' }} placeholder='Pesquisar por nome...' />
                    {(users !== null) && (
                        <MyTable columns={columns} data={filteredUser} />
                    )}
                </div>
            </ContainerFlex>
        </Structure>
    )
}

export default Users