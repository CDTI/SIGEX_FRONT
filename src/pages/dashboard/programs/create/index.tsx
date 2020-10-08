import React, { useState } from 'react'
import { Form, Button, Input, Select, Result } from 'antd'
import { Link } from 'react-router-guard'
import { Categories } from '../../../../mocks/mockCategory'
import { CourseUnit } from '../../../../mocks/mockCourseUnit'
import Structure from '../../../../components/layout/structure'

const { Option } = Select

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const CreateProgram: React.FC = () => {
    const [state, setstate] = useState(false)

    const onFinish = (values: any) => {
        setstate(true)
    }

    return (
        <Structure title="Criar campanha">
            {state && (
                <Result
                    status="success"
                    title="Programa criado com sucesso"
                    subTitle="O programa foi criado, agora você pode incluir um formulário para o mesmo"
                    extra={[
                        <Button type="primary" key="console">
                            <Link to="/dashboard/programs">Ok</Link>
                        </Button>,
                    ]}
                />
            )}
            {!state && (
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
                    <Form.Item name="total_workload"
                        rules={[{ required: true, message: 'Campo obrigatório' }]}
                        label="Total carga-horária UC"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="extension_workload"
                        rules={[{ required: true, message: 'Campo obrigatório' }]}
                        label="Total carga-horária extensão"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="weekly"
                        rules={[{ required: true, message: 'Campo obrigatório' }]}
                        label="Horas semanais"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="hour_clock"
                        rules={[{ required: true, message: 'Campo obrigatório' }]}
                        label="Horas relógio"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button htmlType="submit" type="primary">Cadastrar</Button>
                    </Form.Item>
                </Form>
            )}
        </Structure>
    )
}

export default CreateProgram