import React, { useEffect, useState } from 'react'
import { Form, Input, Button, List, Typography, notification } from 'antd'
import { ICategory } from '../../../interfaces/category'
import { createCategory, listCategories, deleteCategory } from '../../../services/category_service'
import Structure from '../../../components/layout/structure'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const CreateCategory: React.FC = () => {
    const [categories, setCategories] = useState<ICategory[]>([])
    const [initialState, setInitialState] = useState(0)
    const [form] = Form.useForm()

    useEffect(() => {
        listCategories().then(loadCategories => {
            console.log(loadCategories)
            setCategories(loadCategories)
        })
    }, [initialState])

    const submitCategory = async (category: ICategory) => {
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

    return (
        <Structure title='Categoria'>
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
                        actions={[<Button style={{ backgroundColor: '#61e294', color: '#333' }}><EditOutlined /></Button>, <Button style={{ backgroundColor: '#bb0a21', color: '#fff' }} onClick={() => changeDelete(item._id)}><DeleteOutlined /></Button>]}
                    >
                        <Typography>{item.name}</Typography>
                    </List.Item>
                )}
            />
        </Structure>
    )
}

export default CreateCategory