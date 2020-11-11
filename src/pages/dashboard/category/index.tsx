import React, { useEffect, useState, useMemo } from 'react'
import { Form, Input, Button, List, Typography, notification, Popconfirm, Modal, Space } from 'antd'
import { ICategory } from '../../../interfaces/category'
import { createCategory, listCategories, deleteCategory, updateCategory } from '../../../services/category_service'
import Structure from '../../../components/layout/structure'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface State {
    visible: boolean,
    category: ICategory | undefined
}

const CreateCategory: React.FC = () => {
    const [categories, setCategories] = useState<ICategory[]>([])
    const [initialState, setInitialState] = useState(0)
    const [form] = Form.useForm()
    const formModal = Form.useForm()[0]
    const [state, setState] = useState<State>({ visible: false, category: undefined })

    useEffect(() => {
        listCategories().then(loadCategories => {
            console.log(loadCategories)
            setCategories(loadCategories)
        })
    }, [initialState])

    const submitCategory = async (category: ICategory) => {
        category.isDeleted = false
        const newCategory = await createCategory(category)
        notification.open({
            message: newCategory.message
        })
        form.resetFields()
        setInitialState(initialState + 1)
    }

    const changeDelete = async (id: string) => {
        const category = await deleteCategory(id)

        notification.open({
            message: category.message,
        });

        setInitialState(initialState + 1)
    }

    const changeEdit = (category: ICategory) => {
        formModal.setFieldsValue(category)
        setState({ visible: true, category: category })
        console.log(state.category)
    }

    const submitEdit = async (item: any) => {
        const categoryEdit = await updateCategory(item)
        formModal.resetFields()
        notification[categoryEdit.status]({ message: categoryEdit.message })
        setState({ visible: false, category: undefined })
        setInitialState(initialState + 1)
    }

    const onCancel = () => {
        formModal.resetFields()
        setState({ visible: false, category: undefined })
    }

    const modal = useMemo(() => (
        <Modal
            visible={state.visible}
            onCancel={onCancel}
            title='Editar categoria'
            footer={[]}
        >
            <Form
                onFinish={submitEdit}
                form={formModal}
            >
                <Form.Item
                    name='_id'
                >
                    <Input style={{ display: 'none' }} />
                </Form.Item>
                <Form.Item
                    name='name'
                    label='Nome'
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type='primary' onClick={onCancel}>Cancelar</Button>
                        <Button htmlType='submit' type='primary'>Atualizar</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [state])

    return (
        <Structure title='Categoria'>
            {modal}
            <Form
                form={form}
                onFinish={submitCategory}
                layout='vertical'
                style={{ maxWidth: '500px', width: '100%' }}
            >
                <Form.Item
                    name="name"
                    label="Nome da categoria"
                    rules={[
                        { required: true, message: 'Campo Obrigatório' }
                    ]}
                >
                    <Input placeholder='Insira o nome da categoria' />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit'>Cadastrar</Button>
                </Form.Item>
            </Form>
            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={categories}
                renderItem={item => (
                    <List.Item
                        actions={[
                            <Button style={{ color: '#333' }} onClick={() => changeEdit(item)}>
                                Editar<EditOutlined />
                            </Button>,
                            <Popconfirm
                                title='Deseja deletar esta categoria?'
                                onConfirm={() => changeDelete(item._id)}
                                onCancel={() => {
                                    notification.info({ message: 'Ação cancelada' })
                                }}
                                okText='Sim'
                                cancelText='Não'
                            >
                                <Button style={{ color: '#333' }}>
                                    Deletar<DeleteOutlined />
                                </Button>
                            </Popconfirm>
                        ]}
                    >
                        <Typography>{item.name}</Typography>
                    </List.Item>
                )}
            />
        </Structure>
    )
}

export default CreateCategory