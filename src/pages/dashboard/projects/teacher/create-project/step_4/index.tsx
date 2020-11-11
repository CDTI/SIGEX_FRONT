import React from 'react'
import { ContainerFlex } from '../../../../../../global/styles'
import { Form, Input, Button, Space, Divider } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IProject } from '../../../../../../interfaces/project'
import { MaskedInput } from 'antd-mask-input'

interface Props {
    changePlanning(planning: any): void
    removeStep(index: number): void
    previous(): void
    project: IProject
}

const Planning: React.FC<Props> = ({ changePlanning, previous, project, removeStep }) => {
    const totalSteps = project.planning.length


    return (
        <ContainerFlex>
            <div
                style={{ maxWidth: '520px', width: '100%' }}
            >
                <div
                    style={{ width: '100%' }}
                >
                    <div style={{ maxWidth: '520px', width: '100%' }}>
                        {project.planning.map((p, index) => (
                            <div>
                                <h2>Etapa {index + 1}</h2>
                                <Button
                                    type='link'
                                    style={{ margin: '8px 0', padding: '0' }}
                                    onClick={() => {
                                        removeStep(index)
                                    }}>
                                    <MinusCircleOutlined
                                        className="dynamic-delete-button"

                                    />
                                        Excluir
                                    </Button>
                                <Form.Item label='Etapa'>
                                    <Input value={p.text} disabled />
                                </Form.Item>
                                <Form.Item
                                    label='Área de desenvolvimento'
                                >
                                    <Input value={p.developmentSite} disabled />
                                </Form.Item>
                                <Form.Item
                                    label='Modo desenvolvimento'
                                >
                                    <Input value={p.developmentMode} disabled />
                                </Form.Item>
                                <Form.Item
                                    label='Data de inicío'
                                >
                                    <Input value={p.startDate} disabled />
                                </Form.Item>
                                <Form.Item
                                    label='Data de término'
                                >
                                    <Input value={p.finalDate} disabled />
                                </Form.Item>
                                <Divider style={{ backgroundColor: '#333' }} />
                            </div>
                        ))}
                    </div>
                    <Form
                        layout='vertical'
                        style={{ maxWidth: '520px', width: '100%' }}
                        initialValues={project.planning}
                        onFinish={changePlanning}
                    >
                        <Form.List name='planning'>
                            {(fields, { add, remove }) => {
                                return (
                                    <div>
                                        {fields.map((field, index) => (
                                            <>
                                                <h2>Etapa {totalSteps + index + 1}</h2>
                                                {(fields.length > 1 || project.planning.length > 0) ? (
                                                    <Button
                                                        type='link'
                                                        style={{ margin: '8px 0', padding: '0' }}
                                                        onClick={() => {
                                                            remove(field.name);
                                                        }}>
                                                        <MinusCircleOutlined />
                                                        Excluir
                                                    </Button>

                                                ) : null}
                                                <Form.Item
                                                    required={false}
                                                    key={field.key}
                                                >
                                                    <Form.Item
                                                        {...field}
                                                        label={`Etapa ${index + 1}`}
                                                        name={[field.name, 'text']}
                                                        fieldKey={[field.fieldKey, 'text']}
                                                        rules={[
                                                            { required: true, message: 'Campo obrigatório' },
                                                            { max: 50, message: 'Número de caracteres ultrapassado' }
                                                        ]}
                                                    >
                                                        <Input placeholder="Descreva a etapa" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'developmentSite']}
                                                        label="Área de desenvolvimento"
                                                        rules={[
                                                            { required: true, message: 'Campo Obrigatório' }
                                                        ]}
                                                    >
                                                        <Input placeholder="Onde será desenvolvida?" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'developmentMode']}
                                                        label="Modo de desenvolvimento"
                                                        rules={[
                                                            { required: true, message: 'Campo Obrigatório' }
                                                        ]}
                                                    >
                                                        <Input placeholder="Como será desenvolvida?" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'startDate']}
                                                        label="Data de inicío"
                                                        rules={[
                                                            { required: true, message: 'Campo Obrigatório' }
                                                        ]}
                                                    >
                                                        <MaskedInput
                                                            mask="11/11/1111"
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'finalDate']}
                                                        label="Data de término"
                                                        rules={[
                                                            { required: true, message: 'Campo Obrigatório' }
                                                        ]}
                                                    >
                                                        <MaskedInput
                                                            mask="11/11/1111"
                                                        />
                                                    </Form.Item>
                                                </Form.Item>
                                                <Divider style={{ backgroundColor: '#333' }} />
                                            </>
                                        ))}

                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => {
                                                    add();
                                                }}
                                                style={{ width: '100%' }}
                                            >
                                                <PlusOutlined /> Adicionar Etapa
                                    </Button>
                                        </Form.Item>
                                    </div>
                                );
                            }}
                        </Form.List>

                        <Form.Item>
                            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button type="primary" onClick={previous}>Anterior</Button>
                                <Button htmlType="submit" type="primary">Próximo</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </ContainerFlex>
    )
}

export default Planning