import React from 'react'
import { Form, Input, Button } from 'antd'
import { IGroupsProgram } from '../../../interfaces/formProgram'

interface Props {
    addGroup(group: IGroupsProgram): void;
}

const CreateGroup: React.FC<Props> = ({ addGroup }) => {
    return (
        <Form
            onFinish={addGroup}
        >
            <Form.Item
                name="name"
                label="Nome do grupo"
                rules={[{ required: true, message: 'Campo obrigatório' }]}
            >
                <Input placeholder="Ex: Dados pessoais" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Criar</Button>
            </Form.Item>
        </Form>
    )
}

export default CreateGroup