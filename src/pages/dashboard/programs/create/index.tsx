import React from 'react'
import { Form, Button, Input, Select } from 'antd'
import { Categories } from '../../../../mocks/mockCategory'
import { CourseUnit } from '../../../../mocks/mockCourseUnit'

const { Option } = Select

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const CreateProgram: React.FC = () => {

    const onFinish = (values: any) => {
        console.log(values)
    }

    return (
        <>
            <Form
                onFinish={onFinish}
                {...layout}
                name="basic"
            >
                <Form.Item name="name"
                    rules={[{ required: true, message: 'Campo obrigatório' }]}
                    label="Nome"
                >
                    <Input />
                </Form.Item>
                <Form.Item name="start_period"
                    rules={[{ required: true, message: 'Campo obrigatório' }]}
                    label="Inicio do período"
                >
                    <Input />
                </Form.Item>
                <Form.Item name="final_period"
                    rules={[{ required: true, message: 'Campo obrigatório' }]}
                    label="Final do período"
                >
                    <Input />
                </Form.Item>
                <Form.Item name="mode"
                    rules={[{ required: true, message: 'Campo obrigatório' }]}
                    label="Modo programa"
                >
                    <Select defaultValue="" style={{ width: '100%' }}>
                        <Option value="presencial">Presencial</Option>
                        <Option value="semipresencial">Semipresencial</Option>
                        <Option value="online">Online</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="category"
                    rules={[{ required: true, message: 'Campo obrigatório' }]}
                    label="Categoria"
                >
                    <Select style={{ width: '100%' }}>
                        {Categories.map(category => (
                            <Option key={category.id} value={category.id}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="course_unity"
                    rules={[{ required: true, message: 'Campo obrigatório' }]}
                    label="Unidade Curricular"
                >
                    <Select style={{ width: '100%' }}>
                        {CourseUnit.map(course => (
                            <Option key={course.code} value={course.code}>
                                {course.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="type"
                    rules={[{ required: true, message: 'Campo obrigatório' }]}
                    label="Tipo"
                >
                    <Select defaultValue="" style={{ width: '100%' }}>
                        <Option value="obrigatoria">Obrigatória</Option>
                        <Option value="opcional">Opcional</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="allocation"
                    rules={[{ required: true, message: 'Campo obrigatório' }]}
                    label="Alocação"
                >
                    <Input />
                </Form.Item>
                <Form.Item name="type_evaluation"
                    rules={[{ required: true, message: 'Campo obrigatório' }]}
                    label="Tipo de avaliação"
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">Cadastrar</Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default CreateProgram